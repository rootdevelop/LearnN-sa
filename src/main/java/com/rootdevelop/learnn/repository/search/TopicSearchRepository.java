package com.rootdevelop.learnn.repository.search;

import com.rootdevelop.learnn.domain.Topic;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Topic entity.
 */
public interface TopicSearchRepository extends ElasticsearchRepository<Topic, String> {
}
