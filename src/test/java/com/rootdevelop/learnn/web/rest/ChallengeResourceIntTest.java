package com.rootdevelop.learnn.web.rest;

import com.rootdevelop.learnn.LearnNApp;

import com.rootdevelop.learnn.domain.Challenge;
import com.rootdevelop.learnn.repository.ChallengeRepository;
import com.rootdevelop.learnn.repository.search.ChallengeSearchRepository;
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
import org.springframework.util.Base64Utils;

import java.util.List;

import static com.rootdevelop.learnn.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ChallengeResource REST controller.
 *
 * @see ChallengeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnNApp.class)
public class ChallengeResourceIntTest {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final String DEFAULT_LANGUAGE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String DEFAULT_SNIPPET = "AAAAAAAAAA";
    private static final String UPDATED_SNIPPET = "BBBBBBBBBB";

    private static final String DEFAULT_TOPIC = "AAAAAAAAAA";
    private static final String UPDATED_TOPIC = "BBBBBBBBBB";

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ChallengeSearchRepository challengeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restChallengeMockMvc;

    private Challenge challenge;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChallengeResource challengeResource = new ChallengeResource(challengeRepository, challengeSearchRepository);
        this.restChallengeMockMvc = MockMvcBuilders.standaloneSetup(challengeResource)
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
    public static Challenge createEntity() {
        Challenge challenge = new Challenge()
            .question(DEFAULT_QUESTION)
            .answer(DEFAULT_ANSWER)
            .language(DEFAULT_LANGUAGE)
            .active(DEFAULT_ACTIVE)
            .snippet(DEFAULT_SNIPPET)
            .topic(DEFAULT_TOPIC);
        return challenge;
    }

    @Before
    public void initTest() {
        challengeRepository.deleteAll();
        challengeSearchRepository.deleteAll();
        challenge = createEntity();
    }

    @Test
    public void createChallenge() throws Exception {
        int databaseSizeBeforeCreate = challengeRepository.findAll().size();

        // Create the Challenge
        restChallengeMockMvc.perform(post("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(challenge)))
            .andExpect(status().isCreated());

        // Validate the Challenge in the database
        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeCreate + 1);
        Challenge testChallenge = challengeList.get(challengeList.size() - 1);
        assertThat(testChallenge.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testChallenge.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testChallenge.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testChallenge.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testChallenge.getSnippet()).isEqualTo(DEFAULT_SNIPPET);
        assertThat(testChallenge.getTopic()).isEqualTo(DEFAULT_TOPIC);

        // Validate the Challenge in Elasticsearch
        Challenge challengeEs = challengeSearchRepository.findOne(testChallenge.getId());
        assertThat(challengeEs).isEqualToIgnoringGivenFields(testChallenge);
    }

    @Test
    public void createChallengeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = challengeRepository.findAll().size();

        // Create the Challenge with an existing ID
        challenge.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restChallengeMockMvc.perform(post("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(challenge)))
            .andExpect(status().isBadRequest());

        // Validate the Challenge in the database
        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkQuestionIsRequired() throws Exception {
        int databaseSizeBeforeTest = challengeRepository.findAll().size();
        // set the field null
        challenge.setQuestion(null);

        // Create the Challenge, which fails.

        restChallengeMockMvc.perform(post("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(challenge)))
            .andExpect(status().isBadRequest());

        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkAnswerIsRequired() throws Exception {
        int databaseSizeBeforeTest = challengeRepository.findAll().size();
        // set the field null
        challenge.setAnswer(null);

        // Create the Challenge, which fails.

        restChallengeMockMvc.perform(post("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(challenge)))
            .andExpect(status().isBadRequest());

        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllChallenges() throws Exception {
        // Initialize the database
        challengeRepository.save(challenge);

        // Get all the challengeList
        restChallengeMockMvc.perform(get("/api/challenges?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(challenge.getId())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].snippet").value(hasItem(DEFAULT_SNIPPET.toString())))
            .andExpect(jsonPath("$.[*].topic").value(hasItem(DEFAULT_TOPIC.toString())));
    }

    @Test
    public void getChallenge() throws Exception {
        // Initialize the database
        challengeRepository.save(challenge);

        // Get the challenge
        restChallengeMockMvc.perform(get("/api/challenges/{id}", challenge.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(challenge.getId()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION.toString()))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER.toString()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.snippet").value(DEFAULT_SNIPPET.toString()))
            .andExpect(jsonPath("$.topic").value(DEFAULT_TOPIC.toString()));
    }

    @Test
    public void getNonExistingChallenge() throws Exception {
        // Get the challenge
        restChallengeMockMvc.perform(get("/api/challenges/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateChallenge() throws Exception {
        // Initialize the database
        challengeRepository.save(challenge);
        challengeSearchRepository.save(challenge);
        int databaseSizeBeforeUpdate = challengeRepository.findAll().size();

        // Update the challenge
        Challenge updatedChallenge = challengeRepository.findOne(challenge.getId());
        updatedChallenge
            .question(UPDATED_QUESTION)
            .answer(UPDATED_ANSWER)
            .language(UPDATED_LANGUAGE)
            .active(UPDATED_ACTIVE)
            .snippet(UPDATED_SNIPPET)
            .topic(UPDATED_TOPIC);

        restChallengeMockMvc.perform(put("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChallenge)))
            .andExpect(status().isOk());

        // Validate the Challenge in the database
        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeUpdate);
        Challenge testChallenge = challengeList.get(challengeList.size() - 1);
        assertThat(testChallenge.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testChallenge.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testChallenge.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testChallenge.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testChallenge.getSnippet()).isEqualTo(UPDATED_SNIPPET);
        assertThat(testChallenge.getTopic()).isEqualTo(UPDATED_TOPIC);

        // Validate the Challenge in Elasticsearch
        Challenge challengeEs = challengeSearchRepository.findOne(testChallenge.getId());
        assertThat(challengeEs).isEqualToIgnoringGivenFields(testChallenge);
    }

    @Test
    public void updateNonExistingChallenge() throws Exception {
        int databaseSizeBeforeUpdate = challengeRepository.findAll().size();

        // Create the Challenge

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restChallengeMockMvc.perform(put("/api/challenges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(challenge)))
            .andExpect(status().isCreated());

        // Validate the Challenge in the database
        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteChallenge() throws Exception {
        // Initialize the database
        challengeRepository.save(challenge);
        challengeSearchRepository.save(challenge);
        int databaseSizeBeforeDelete = challengeRepository.findAll().size();

        // Get the challenge
        restChallengeMockMvc.perform(delete("/api/challenges/{id}", challenge.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean challengeExistsInEs = challengeSearchRepository.exists(challenge.getId());
        assertThat(challengeExistsInEs).isFalse();

        // Validate the database is empty
        List<Challenge> challengeList = challengeRepository.findAll();
        assertThat(challengeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchChallenge() throws Exception {
        // Initialize the database
        challengeRepository.save(challenge);
        challengeSearchRepository.save(challenge);

        // Search the challenge
        restChallengeMockMvc.perform(get("/api/_search/challenges?query=id:" + challenge.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(challenge.getId())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].snippet").value(hasItem(DEFAULT_SNIPPET.toString())))
            .andExpect(jsonPath("$.[*].topic").value(hasItem(DEFAULT_TOPIC.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Challenge.class);
        Challenge challenge1 = new Challenge();
        challenge1.setId("id1");
        Challenge challenge2 = new Challenge();
        challenge2.setId(challenge1.getId());
        assertThat(challenge1).isEqualTo(challenge2);
        challenge2.setId("id2");
        assertThat(challenge1).isNotEqualTo(challenge2);
        challenge1.setId(null);
        assertThat(challenge1).isNotEqualTo(challenge2);
    }
}
