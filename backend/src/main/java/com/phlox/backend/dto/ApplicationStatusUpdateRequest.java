package com.phlox.backend.dto;

import com.phlox.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
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
public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Application ID is required")
    private UUID applicationId;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}
