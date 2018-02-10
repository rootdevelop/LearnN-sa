package com.rootdevelop.learnn.repository.search;

import com.rootdevelop.learnn.domain.ActivityResult;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ActivityResult entity.
 */
public interface ActivityResultSearchRepository extends ElasticsearchRepository<ActivityResult, String> {
}
