package com.rootdevelop.learnn.repository;

import com.rootdevelop.learnn.domain.ActivityResult;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the ActivityResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityResultRepository extends MongoRepository<ActivityResult, String> {
    ActivityResult findByUserAndChallengeIdAndResult(String user, String challengeId, String result);
}
