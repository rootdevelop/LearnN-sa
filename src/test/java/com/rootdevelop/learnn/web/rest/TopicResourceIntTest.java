package com.rootdevelop.learnn.web.rest;

import com.rootdevelop.learnn.LearnNApp;

import com.rootdevelop.learnn.domain.Topic;
import com.rootdevelop.learnn.repository.TopicRepository;
import com.rootdevelop.learnn.repository.search.TopicSearchRepository;
import com.rootdevelop.learnn.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static com.rootdevelop.learnn.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TopicResource REST controller.
 *
 * @see TopicResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnNApp.class)
public class TopicResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicSearchRepository topicSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restTopicMockMvc;

    private Topic topic;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TopicResource topicResource = new TopicResource(topicRepository, topicSearchRepository);
        this.restTopicMockMvc = MockMvcBuilders.standaloneSetup(topicResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Topic createEntity() {
        Topic topic = new Topic()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return topic;
    }

    @Before
    public void initTest() {
        topicRepository.deleteAll();
        topicSearchRepository.deleteAll();
        topic = createEntity();
    }

    @Test
    public void createTopic() throws Exception {
        int databaseSizeBeforeCreate = topicRepository.findAll().size();

        // Create the Topic
        restTopicMockMvc.perform(post("/api/topics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(topic)))
            .andExpect(status().isCreated());

        // Validate the Topic in the database
        List<Topic> topicList = topicRepository.findAll();
        assertThat(topicList).hasSize(databaseSizeBeforeCreate + 1);
        Topic testTopic = topicList.get(topicList.size() - 1);
        assertThat(testTopic.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTopic.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Topic in Elasticsearch
        Topic topicEs = topicSearchRepository.findOne(testTopic.getId());
        assertThat(topicEs).isEqualToIgnoringGivenFields(testTopic);
    }

    @Test
    public void createTopicWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = topicRepository.findAll().size();

        // Create the Topic with an existing ID
        topic.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restTopicMockMvc.perform(post("/api/topics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(topic)))
            .andExpect(status().isBadRequest());

        // Validate the Topic in the database
        List<Topic> topicList = topicRepository.findAll();
        assertThat(topicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllTopics() throws Exception {
        // Initialize the database
        topicRepository.save(topic);

        // Get all the topicList
        restTopicMockMvc.perform(get("/api/topics?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(topic.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void getTopic() throws Exception {
        // Initialize the database
        topicRepository.save(topic);

        // Get the topic
        restTopicMockMvc.perform(get("/api/topics/{id}", topic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(topic.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingTopic() throws Exception {
        // Get the topic
        restTopicMockMvc.perform(get("/api/topics/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateTopic() throws Exception {
        // Initialize the database
        topicRepository.save(topic);
        topicSearchRepository.save(topic);
        int databaseSizeBeforeUpdate = topicRepository.findAll().size();

        // Update the topic
        Topic updatedTopic = topicRepository.findOne(topic.getId());
        updatedTopic
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restTopicMockMvc.perform(put("/api/topics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTopic)))
            .andExpect(status().isOk());

        // Validate the Topic in the database
        List<Topic> topicList = topicRepository.findAll();
        assertThat(topicList).hasSize(databaseSizeBeforeUpdate);
        Topic testTopic = topicList.get(topicList.size() - 1);
        assertThat(testTopic.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTopic.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Topic in Elasticsearch
        Topic topicEs = topicSearchRepository.findOne(testTopic.getId());
        assertThat(topicEs).isEqualToIgnoringGivenFields(testTopic);
    }

    @Test
    public void updateNonExistingTopic() throws Exception {
        int databaseSizeBeforeUpdate = topicRepository.findAll().size();

        // Create the Topic

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTopicMockMvc.perform(put("/api/topics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(topic)))
            .andExpect(status().isCreated());

        // Validate the Topic in the database
        List<Topic> topicList = topicRepository.findAll();
        assertThat(topicList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteTopic() throws Exception {
        // Initialize the database
        topicRepository.save(topic);
        topicSearchRepository.save(topic);
        int databaseSizeBeforeDelete = topicRepository.findAll().size();

        // Get the topic
        restTopicMockMvc.perform(delete("/api/topics/{id}", topic.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean topicExistsInEs = topicSearchRepository.exists(topic.getId());
        assertThat(topicExistsInEs).isFalse();

        // Validate the database is empty
        List<Topic> topicList = topicRepository.findAll();
        assertThat(topicList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchTopic() throws Exception {
        // Initialize the database
        topicRepository.save(topic);
        topicSearchRepository.save(topic);

        // Search the topic
        restTopicMockMvc.perform(get("/api/_search/topics?query=id:" + topic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(topic.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Topic.class);
        Topic topic1 = new Topic();
        topic1.setId("id1");
        Topic topic2 = new Topic();
        topic2.setId(topic1.getId());
        assertThat(topic1).isEqualTo(topic2);
        topic2.setId("id2");
        assertThat(topic1).isNotEqualTo(topic2);
        topic1.setId(null);
        assertThat(topic1).isNotEqualTo(topic2);
    }
}
