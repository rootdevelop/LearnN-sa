package com.rootdevelop.learnn.repository.search;

import com.rootdevelop.learnn.domain.Challenge;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Challenge entity.
 */
public interface ChallengeSearchRepository extends ElasticsearchRepository<Challenge, String> {
}
