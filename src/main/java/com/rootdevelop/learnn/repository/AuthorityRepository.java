package com.rootdevelop.learnn.repository;

import com.rootdevelop.learnn.domain.Authority;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Authority entity.
 */
public interface AuthorityRepository extends MongoRepository<Authority, String> {
}
