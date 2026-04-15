package com.phlox.backend.controller;

import com.phlox.backend.dto.BrandProfileRequest;
import com.phlox.backend.dto.BrandProfileResponse;
import com.phlox.backend.service.BrandProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/brand/profile")
@RequiredArgsConstructor
public class BrandProfileController {

    private final BrandProfileService brandProfileService;

    @PostMapping
    public ResponseEntity<BrandProfileResponse> createOrUpdateProfile(@RequestBody BrandProfileRequest request) {
        return ResponseEntity.ok(brandProfileService.createOrUpdateMyProfile(request));
    }

    @GetMapping("/me")
    public ResponseEntity<BrandProfileResponse> getMyProfile() {
        return ResponseEntity.ok(brandProfileService.getMyProfile());
    }
}
