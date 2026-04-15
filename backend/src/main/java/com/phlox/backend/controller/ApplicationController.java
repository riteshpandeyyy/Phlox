package com.phlox.backend.controller;

import com.phlox.backend.dto.ApplicationRequest;
import com.phlox.backend.dto.ApplicationResponse;
import com.phlox.backend.dto.ApplicationStatusUpdateRequest;
import com.phlox.backend.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/application")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> applyForCampaign(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForCampaign(request));
    }

    @GetMapping("/creator")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<ApplicationResponse>> getCampaignApplications(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(applicationService.getCampaignApplications(campaignId));
    }

    @PatchMapping("/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(@Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(request));
    }
}
