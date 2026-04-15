package com.phlox.backend.dto;

import com.phlox.backend.entity.ApplicationStatus;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private UUID id;
    private UUID campaignId;
    private String campaignTitle;
    private UUID creatorId;
    private String creatorNiche;
    private Long creatorFollowers;
    private ApplicationStatus status;
    private Instant appliedAt;
}
