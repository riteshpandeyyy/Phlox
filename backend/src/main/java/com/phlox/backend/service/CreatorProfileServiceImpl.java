package com.phlox.backend.service;

import com.phlox.backend.dto.CreatorProfileRequest;
import com.phlox.backend.dto.CreatorProfileResponse;
import com.phlox.backend.entity.CreatorProfile;
import com.phlox.backend.entity.User;
import com.phlox.backend.entity.UserRole;
import com.phlox.backend.repository.CreatorProfileRepository;
import com.phlox.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CreatorProfileServiceImpl implements CreatorProfileService {

    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;

    @Override
    public CreatorProfileResponse createOrUpdateMyProfile(CreatorProfileRequest request) {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.CREATOR);

        CreatorProfile profile = creatorProfileRepository.findByUser(currentUser)
                .orElseGet(() -> CreatorProfile.builder().user(currentUser).build());

        profile.setNiche(request.getNiche());
        profile.setFollowers(request.getFollowers());
        profile.setEngagementRate(request.getEngagementRate());
        profile.setBio(request.getBio());

        CreatorProfile saved = creatorProfileRepository.save(profile);
        return mapToResponse(saved);
    }

    @Override
    public CreatorProfileResponse getMyProfile() {
        User currentUser = getCurrentUser();
        ensureRole(currentUser, UserRole.CREATOR);

        CreatorProfile profile = creatorProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator profile not found"));

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

    private CreatorProfileResponse mapToResponse(CreatorProfile profile) {
        return CreatorProfileResponse.builder()
                .niche(profile.getNiche())
                .followers(profile.getFollowers())
                .engagementRate(profile.getEngagementRate())
                .bio(profile.getBio())
                .build();
    }
}
