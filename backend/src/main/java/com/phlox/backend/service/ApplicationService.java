package com.phlox.backend.service;

import com.phlox.backend.dto.ApplicationRequest;
import com.phlox.backend.dto.ApplicationResponse;
import com.phlox.backend.dto.ApplicationStatusUpdateRequest;
import java.util.List;
import java.util.UUID;

public interface ApplicationService {

    ApplicationResponse applyForCampaign(ApplicationRequest request);

    List<ApplicationResponse> getMyApplications();

    List<ApplicationResponse> getCampaignApplications(UUID campaignId);

    ApplicationResponse updateApplicationStatus(ApplicationStatusUpdateRequest request);
}
