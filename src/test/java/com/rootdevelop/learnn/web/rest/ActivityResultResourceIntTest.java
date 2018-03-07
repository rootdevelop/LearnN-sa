package com.rootdevelop.learnn.web.rest;

import com.rootdevelop.learnn.LearnNApp;

import com.rootdevelop.learnn.domain.ActivityResult;
import com.rootdevelop.learnn.repository.ActivityResultRepository;
import com.rootdevelop.learnn.repository.search.ActivityResultSearchRepository;
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

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.rootdevelop.learnn.web.rest.TestUtil.sameInstant;
import static com.rootdevelop.learnn.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ActivityResultResource REST controller.
 *
 * @see ActivityResultResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnNApp.class)
public class ActivityResultResourceIntTest {

    private static final String DEFAULT_USER = "AAAAAAAAAA";
    private static final String UPDATED_USER = "BBBBBBBBBB";

    private static final String DEFAULT_CHALLENGE_ID = "AAAAAAAAAA";
    private static final String UPDATED_CHALLENGE_ID = "BBBBBBBBBB";

    private static final String DEFAULT_RESULT = "AAAAAAAAAA";
    private static final String UPDATED_RESULT = "BBBBBBBBBB";

    private static final Integer DEFAULT_TIME_SPENT = 1;
    private static final Integer UPDATED_TIME_SPENT = 2;

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ActivityResultRepository activityResultRepository;

    @Autowired
    private ActivityResultSearchRepository activityResultSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restActivityResultMockMvc;

    private ActivityResult activityResult;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ActivityResultResource activityResultResource = new ActivityResultResource(activityResultRepository, activityResultSearchRepository, null, null);
        this.restActivityResultMockMvc = MockMvcBuilders.standaloneSetup(activityResultResource)
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
    public static ActivityResult createEntity() {
        ActivityResult activityResult = new ActivityResult()
            .user(DEFAULT_USER)
            .challengeId(DEFAULT_CHALLENGE_ID)
            .result(DEFAULT_RESULT)
            .timeSpent(DEFAULT_TIME_SPENT)
            .timestamp(DEFAULT_TIMESTAMP);
        return activityResult;
    }

    @Before
    public void initTest() {
        activityResultRepository.deleteAll();
        activityResultSearchRepository.deleteAll();
        activityResult = createEntity();
    }

    @Test
    public void createActivityResult() throws Exception {
        int databaseSizeBeforeCreate = activityResultRepository.findAll().size();

        // Create the ActivityResult
        restActivityResultMockMvc.perform(post("/api/activity-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activityResult)))
            .andExpect(status().isCreated());

        // Validate the ActivityResult in the database
        List<ActivityResult> activityResultList = activityResultRepository.findAll();
        assertThat(activityResultList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityResult testActivityResult = activityResultList.get(activityResultList.size() - 1);
        assertThat(testActivityResult.getUser()).isEqualTo(DEFAULT_USER);
        assertThat(testActivityResult.getChallengeId()).isEqualTo(DEFAULT_CHALLENGE_ID);
        assertThat(testActivityResult.getResult()).isEqualTo(DEFAULT_RESULT);
        assertThat(testActivityResult.getTimeSpent()).isEqualTo(DEFAULT_TIME_SPENT);
        assertThat(testActivityResult.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);

        // Validate the ActivityResult in Elasticsearch
        ActivityResult activityResultEs = activityResultSearchRepository.findOne(testActivityResult.getId());
        assertThat(testActivityResult.getTimestamp()).isEqualTo(testActivityResult.getTimestamp());
        assertThat(activityResultEs).isEqualToIgnoringGivenFields(testActivityResult, "timestamp");
    }

    @Test
    public void createActivityResultWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = activityResultRepository.findAll().size();

        // Create the ActivityResult with an existing ID
        activityResult.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityResultMockMvc.perform(post("/api/activity-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activityResult)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityResult in the database
        List<ActivityResult> activityResultList = activityResultRepository.findAll();
        assertThat(activityResultList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllActivityResults() throws Exception {
        // Initialize the database
        activityResultRepository.save(activityResult);

        // Get all the activityResultList
        restActivityResultMockMvc.perform(get("/api/activity-results?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityResult.getId())))
            .andExpect(jsonPath("$.[*].user").value(hasItem(DEFAULT_USER.toString())))
            .andExpect(jsonPath("$.[*].challengeId").value(hasItem(DEFAULT_CHALLENGE_ID.toString())))
            .andExpect(jsonPath("$.[*].result").value(hasItem(DEFAULT_RESULT.toString())))
            .andExpect(jsonPath("$.[*].timeSpent").value(hasItem(DEFAULT_TIME_SPENT)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))));
    }

    @Test
    public void getActivityResult() throws Exception {
        // Initialize the database
        activityResultRepository.save(activityResult);

        // Get the activityResult
        restActivityResultMockMvc.perform(get("/api/activity-results/{id}", activityResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(activityResult.getId()))
            .andExpect(jsonPath("$.user").value(DEFAULT_USER.toString()))
            .andExpect(jsonPath("$.challengeId").value(DEFAULT_CHALLENGE_ID.toString()))
            .andExpect(jsonPath("$.result").value(DEFAULT_RESULT.toString()))
            .andExpect(jsonPath("$.timeSpent").value(DEFAULT_TIME_SPENT))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)));
    }

    @Test
    public void getNonExistingActivityResult() throws Exception {
        // Get the activityResult
        restActivityResultMockMvc.perform(get("/api/activity-results/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateActivityResult() throws Exception {
        // Initialize the database
        activityResultRepository.save(activityResult);
        activityResultSearchRepository.save(activityResult);
        int databaseSizeBeforeUpdate = activityResultRepository.findAll().size();

        // Update the activityResult
        ActivityResult updatedActivityResult = activityResultRepository.findOne(activityResult.getId());
        updatedActivityResult
            .user(UPDATED_USER)
            .challengeId(UPDATED_CHALLENGE_ID)
            .result(UPDATED_RESULT)
            .timeSpent(UPDATED_TIME_SPENT)
            .timestamp(UPDATED_TIMESTAMP);

        restActivityResultMockMvc.perform(put("/api/activity-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedActivityResult)))
            .andExpect(status().isOk());

        // Validate the ActivityResult in the database
        List<ActivityResult> activityResultList = activityResultRepository.findAll();
        assertThat(activityResultList).hasSize(databaseSizeBeforeUpdate);
        ActivityResult testActivityResult = activityResultList.get(activityResultList.size() - 1);
        assertThat(testActivityResult.getUser()).isEqualTo(UPDATED_USER);
        assertThat(testActivityResult.getChallengeId()).isEqualTo(UPDATED_CHALLENGE_ID);
        assertThat(testActivityResult.getResult()).isEqualTo(UPDATED_RESULT);
        assertThat(testActivityResult.getTimeSpent()).isEqualTo(UPDATED_TIME_SPENT);
        assertThat(testActivityResult.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);

        // Validate the ActivityResult in Elasticsearch
        ActivityResult activityResultEs = activityResultSearchRepository.findOne(testActivityResult.getId());
        assertThat(testActivityResult.getTimestamp()).isEqualTo(testActivityResult.getTimestamp());
        assertThat(activityResultEs).isEqualToIgnoringGivenFields(testActivityResult, "timestamp");
    }

    @Test
    public void updateNonExistingActivityResult() throws Exception {
        int databaseSizeBeforeUpdate = activityResultRepository.findAll().size();

        // Create the ActivityResult

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restActivityResultMockMvc.perform(put("/api/activity-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activityResult)))
            .andExpect(status().isCreated());

        // Validate the ActivityResult in the database
        List<ActivityResult> activityResultList = activityResultRepository.findAll();
        assertThat(activityResultList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteActivityResult() throws Exception {
        // Initialize the database
        activityResultRepository.save(activityResult);
        activityResultSearchRepository.save(activityResult);
        int databaseSizeBeforeDelete = activityResultRepository.findAll().size();

        // Get the activityResult
        restActivityResultMockMvc.perform(delete("/api/activity-results/{id}", activityResult.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean activityResultExistsInEs = activityResultSearchRepository.exists(activityResult.getId());
        assertThat(activityResultExistsInEs).isFalse();

        // Validate the database is empty
        List<ActivityResult> activityResultList = activityResultRepository.findAll();
        assertThat(activityResultList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchActivityResult() throws Exception {
        // Initialize the database
        activityResultRepository.save(activityResult);
        activityResultSearchRepository.save(activityResult);

        // Search the activityResult
        restActivityResultMockMvc.perform(get("/api/_search/activity-results?query=id:" + activityResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityResult.getId())))
            .andExpect(jsonPath("$.[*].user").value(hasItem(DEFAULT_USER.toString())))
            .andExpect(jsonPath("$.[*].challengeId").value(hasItem(DEFAULT_CHALLENGE_ID.toString())))
            .andExpect(jsonPath("$.[*].result").value(hasItem(DEFAULT_RESULT.toString())))
            .andExpect(jsonPath("$.[*].timeSpent").value(hasItem(DEFAULT_TIME_SPENT)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityResult.class);
        ActivityResult activityResult1 = new ActivityResult();
        activityResult1.setId("id1");
        ActivityResult activityResult2 = new ActivityResult();
        activityResult2.setId(activityResult1.getId());
        assertThat(activityResult1).isEqualTo(activityResult2);
        activityResult2.setId("id2");
        assertThat(activityResult1).isNotEqualTo(activityResult2);
        activityResult1.setId(null);
        assertThat(activityResult1).isNotEqualTo(activityResult2);
    }
}
