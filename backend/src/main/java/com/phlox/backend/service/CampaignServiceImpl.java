package com.phlox.backend.service;

import com.phlox.backend.dto.CampaignRequest;
import com.phlox.backend.dto.CampaignResponse;
import com.phlox.backend.entity.BrandProfile;
import com.phlox.backend.entity.Campaign;
import com.phlox.backend.entity.User;
import com.phlox.backend.entity.UserRole;
import com.phlox.backend.repository.BrandProfileRepository;
import com.phlox.backend.repository.CampaignRepository;
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
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final BrandProfileRepository brandProfileRepository;
    private final UserRepository userRepository;

    @Override
    public CampaignResponse createCampaign(CampaignRequest request) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.BRAND);

        BrandProfile brandProfile = brandProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brand profile not found"));

        Campaign campaign = Campaign.builder()
                .brand(brandProfile)
                .title(request.getTitle())
                .description(request.getDescription())
                .niche(request.getNiche())
                .budget(request.getBudget())
                .minFollowers(request.getMinFollowers())
                .build();

        Campaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    @Override
    public List<CampaignResponse> getAllCampaigns(String niche, Long minFollowers) {
        List<Campaign> campaigns;

        if (niche != null && minFollowers != null) {
            campaigns = campaignRepository.findByNicheIgnoreCaseAndMinFollowersGreaterThanEqual(niche, minFollowers);
        } else if (niche != null) {
            campaigns = campaignRepository.findByNicheIgnoreCase(niche);
        } else if (minFollowers != null) {
            campaigns = campaignRepository.findByMinFollowersGreaterThanEqual(minFollowers);
        } else {
            campaigns = campaignRepository.findAll();
        }

        return campaigns.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CampaignResponse getCampaignById(UUID id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found"));

        return mapToResponse(campaign);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void ensureRole(User user, UserRole requiredRole) {
        if (user.getRole() != requiredRole) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied for role: " + user.getRole());
        }
    }

    private CampaignResponse mapToResponse(Campaign campaign) {
        BrandProfile brand = campaign.getBrand();
        return CampaignResponse.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())
                .niche(campaign.getNiche())
                .budget(campaign.getBudget())
                .minFollowers(campaign.getMinFollowers())
                .createdAt(campaign.getCreatedAt())
                .brandId(brand.getId())
                .brandCompanyName(brand.getCompanyName())
                .brandIndustry(brand.getIndustry())
                .build();
    }
}
