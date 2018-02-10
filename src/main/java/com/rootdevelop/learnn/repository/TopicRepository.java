package com.rootdevelop.learnn.repository;

import com.rootdevelop.learnn.domain.Topic;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Topic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TopicRepository extends MongoRepository<Topic, String> {

}
