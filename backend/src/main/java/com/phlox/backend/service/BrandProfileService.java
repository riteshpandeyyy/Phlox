package com.phlox.backend.service;

import com.phlox.backend.dto.BrandProfileRequest;
import com.phlox.backend.dto.BrandProfileResponse;

public interface BrandProfileService {
    BrandProfileResponse createOrUpdateMyProfile(BrandProfileRequest request);

    BrandProfileResponse getMyProfile();
}
