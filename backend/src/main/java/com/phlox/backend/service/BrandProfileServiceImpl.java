package com.phlox.backend.service;

import com.phlox.backend.dto.BrandProfileRequest;
import com.phlox.backend.dto.BrandProfileResponse;
import com.phlox.backend.entity.BrandProfile;
import com.phlox.backend.entity.User;
import com.phlox.backend.entity.UserRole;
import com.phlox.backend.repository.BrandProfileRepository;
import com.phlox.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BrandProfileServiceImpl implements BrandProfileService {

    private final BrandProfileRepository brandProfileRepository;
    private final UserRepository userRepository;

    @Override
    public BrandProfileResponse createOrUpdateMyProfile(BrandProfileRequest request) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.BRAND);

        BrandProfile profile = brandProfileRepository.findByUser(currentUser)
                .orElseGet(() -> BrandProfile.builder().user(currentUser).build());

        profile.setCompanyName(request.getCompanyName());
        profile.setIndustry(request.getIndustry());
        profile.setWebsite(request.getWebsite());

        BrandProfile saved = brandProfileRepository.save(profile);
        return mapToResponse(saved);
    }

    @Override
    public BrandProfileResponse getMyProfile() {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.BRAND);

        BrandProfile profile = brandProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand profile not found"));

        return mapToResponse(profile);
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

    private BrandProfileResponse mapToResponse(BrandProfile profile) {
        return BrandProfileResponse.builder()
                .companyName(profile.getCompanyName())
                .industry(profile.getIndustry())
                .website(profile.getWebsite())
                .build();
    }
}
