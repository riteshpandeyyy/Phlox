package com.phlox.backend.service;

import com.phlox.backend.dto.ApplicationRequest;
import com.phlox.backend.dto.ApplicationResponse;
import com.phlox.backend.dto.ApplicationStatusUpdateRequest;
import com.phlox.backend.entity.Application;
import com.phlox.backend.entity.ApplicationStatus;
import com.phlox.backend.entity.BrandProfile;
import com.phlox.backend.entity.Campaign;
import com.phlox.backend.entity.CreatorProfile;
import com.phlox.backend.entity.User;
import com.phlox.backend.entity.UserRole;
import com.phlox.backend.repository.ApplicationRepository;
import com.phlox.backend.repository.BrandProfileRepository;
import com.phlox.backend.repository.CampaignRepository;
import com.phlox.backend.repository.CreatorProfileRepository;
import com.phlox.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final BrandProfileRepository brandProfileRepository;
    private final UserRepository userRepository;

    @Override
    public ApplicationResponse applyForCampaign(ApplicationRequest request) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.CREATOR);

        CreatorProfile creatorProfile = creatorProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator profile not found"));

        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found"));

        if (applicationRepository.existsByCampaignAndCreator(campaign, creatorProfile)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application already exists for this campaign");
        }

        Application application = Application.builder()
                .campaign(campaign)
                .creator(creatorProfile)
                .status(ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Override
    public List<ApplicationResponse> getMyApplications() {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.CREATOR);

        CreatorProfile creatorProfile = creatorProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator profile not found"));

        return applicationRepository.findByCreator(creatorProfile).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getCampaignApplications(UUID campaignId) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.BRAND);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found"));

        BrandProfile brandProfile = brandProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brand profile not found"));

        if (!campaign.getBrand().getId().equals(brandProfile.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brand does not own this campaign");
        }

        return applicationRepository.findByCampaign(campaign).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationResponse updateApplicationStatus(ApplicationStatusUpdateRequest request) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.BRAND);

        BrandProfile brandProfile = brandProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brand profile not found"));

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        Campaign campaign = application.getCampaign();
        if (!campaign.getBrand().getId().equals(brandProfile.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brand does not own this campaign");
        }

        if (request.getStatus() == null || request.getStatus() == ApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only ACCEPTED or REJECTED are allowed");
        }

        application.setStatus(request.getStatus());
        Application updated = applicationRepository.save(application);
        return mapToResponse(updated);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof org.springframework.security.core.userdetails.User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }

        String email = ((org.springframework.security.core.userdetails.User) principal).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        
        System.out.println("Current user: " + email + " with role: " + user.getRole());
        return user;
    }

    private void ensureRole(User user, UserRole requiredRole) {
        System.out.println("Checking role - User has: " + user.getRole() + ", Required: " + requiredRole);
        if (user.getRole() != requiredRole) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied for role: " + user.getRole());
        }
    }

    private ApplicationResponse mapToResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .campaignId(application.getCampaign().getId())
                .campaignTitle(application.getCampaign().getTitle())
                .creatorId(application.getCreator().getId())
                .creatorNiche(application.getCreator().getNiche())
                .creatorFollowers(application.getCreator().getFollowers())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
