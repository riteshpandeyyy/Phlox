package com.phlox.backend.service;

import com.phlox.backend.dto.CreatorProfileRequest;
import com.phlox.backend.dto.CreatorProfileResponse;

public interface CreatorProfileService {
    CreatorProfileResponse createOrUpdateMyProfile(CreatorProfileRequest request);

    CreatorProfileResponse getMyProfile();
}
