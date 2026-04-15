package com.phlox.backend.controller;

import com.phlox.backend.dto.CreatorProfileRequest;
import com.phlox.backend.dto.CreatorProfileResponse;
import com.phlox.backend.service.CreatorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/creator/profile")
@RequiredArgsConstructor
public class CreatorProfileController {

    private final CreatorProfileService creatorProfileService;

    @PostMapping
    public ResponseEntity<CreatorProfileResponse> createOrUpdateProfile(@RequestBody CreatorProfileRequest request) {
        return ResponseEntity.ok(creatorProfileService.createOrUpdateMyProfile(request));
    }

    @GetMapping("/me")
    public ResponseEntity<CreatorProfileResponse> getMyProfile() {
        return ResponseEntity.ok(creatorProfileService.getMyProfile());
    }
}
