package com.phlox.backend.repository;

import com.phlox.backend.entity.Application;
import com.phlox.backend.entity.Campaign;
import com.phlox.backend.entity.CreatorProfile;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    boolean existsByCampaignAndCreator(Campaign campaign, CreatorProfile creator);

    List<Application> findByCreator(CreatorProfile creator);

    List<Application> findByCampaign(Campaign campaign);

    Optional<Application> findByIdAndCampaign(UUID id, Campaign campaign);
}
