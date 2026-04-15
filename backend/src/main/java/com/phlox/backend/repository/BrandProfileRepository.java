package com.phlox.backend.repository;

import com.phlox.backend.entity.BrandProfile;
import com.phlox.backend.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandProfileRepository extends JpaRepository<BrandProfile, UUID> {

    Optional<BrandProfile> findByUser(User user);
}
