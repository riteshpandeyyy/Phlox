package com.phlox.backend.dto;

import java.math.BigDecimal;
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
public class CampaignResponse {

    private UUID id;
    private String title;
    private String description;
    private String niche;
    private BigDecimal budget;
    private Long minFollowers;
    private Instant createdAt;
    private UUID brandId;
    private String brandCompanyName;
    private String brandIndustry;
}
