package com.phlox.backend.service;

import com.phlox.backend.dto.CampaignRequest;
import com.phlox.backend.dto.CampaignResponse;
import java.util.List;
import java.util.UUID;

public interface CampaignService {

    CampaignResponse createCampaign(CampaignRequest request);

    List<CampaignResponse> getAllCampaigns(String niche, Long minFollowers);

    CampaignResponse getCampaignById(UUID id);
}
