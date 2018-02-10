package com.rootdevelop.learnn.repository;

import com.rootdevelop.learnn.domain.Challenge;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Challenge entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChallengeRepository extends MongoRepository<Challenge, String> {

}
