package com.phlox.backend.repository;

import com.phlox.backend.entity.Campaign;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    List<Campaign> findByNicheIgnoreCase(String niche);

    List<Campaign> findByMinFollowersGreaterThanEqual(Long minFollowers);

    List<Campaign> findByNicheIgnoreCaseAndMinFollowersGreaterThanEqual(String niche, Long minFollowers);
}
