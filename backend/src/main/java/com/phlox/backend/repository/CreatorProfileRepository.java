package com.phlox.backend.repository;

import com.phlox.backend.entity.CreatorProfile;
import com.phlox.backend.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorProfileRepository extends JpaRepository<CreatorProfile, UUID> {

    Optional<CreatorProfile> findByUser(User user);
}
