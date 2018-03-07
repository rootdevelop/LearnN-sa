package com.rootdevelop.learnn.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.rootdevelop.learnn.domain.*;

import com.rootdevelop.learnn.repository.ActivityResultRepository;
import com.rootdevelop.learnn.repository.ChallengeRepository;
import com.rootdevelop.learnn.repository.TopicRepository;
import com.rootdevelop.learnn.repository.search.ActivityResultSearchRepository;
import com.rootdevelop.learnn.security.AuthoritiesConstants;
import com.rootdevelop.learnn.security.SecurityUtils;
import com.rootdevelop.learnn.web.rest.errors.BadRequestAlertException;
import com.rootdevelop.learnn.web.rest.util.HeaderUtil;
import com.rootdevelop.learnn.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing ActivityResult.
 */
@RestController
@RequestMapping("/api")
public class ActivityResultResource {

    private final Logger log = LoggerFactory.getLogger(ActivityResultResource.class);

    private static final String ENTITY_NAME = "activityResult";

    private final ActivityResultRepository activityResultRepository;

    private final ActivityResultSearchRepository activityResultSearchRepository;

    private final ChallengeRepository challengeRepository;

    private final TopicRepository topicRepository;

    public ActivityResultResource(ActivityResultRepository activityResultRepository,
                                  ActivityResultSearchRepository activityResultSearchRepository,
                                  ChallengeRepository challengeRepository,
                                  TopicRepository topicRepository) {
        this.activityResultRepository = activityResultRepository;
        this.activityResultSearchRepository = activityResultSearchRepository;
        this.challengeRepository = challengeRepository;
        this.topicRepository = topicRepository;
    }

    /**
     * POST  /activity-results : Create a new activityResult.
     *
     * @param activityResult the activityResult to create
     * @return the ResponseEntity with status 201 (Created) and with body the new activityResult, or with status 400 (Bad Request) if the activityResult has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/activity-results")
    @Secured(AuthoritiesConstants.USER)
    @Timed
    public ResponseEntity<ActivityResult> createActivityResult(@RequestBody ActivityResult activityResult) throws URISyntaxException {
        log.debug("REST request to save ActivityResult : {}", activityResult);
        if (activityResult.getId() != null) {
            throw new BadRequestAlertException("A new activityResult cannot already have an ID", ENTITY_NAME, "idexists");
        }

        activityResult.setTimestamp(ZonedDateTime.now());
        activityResult.setUser(SecurityUtils.getCurrentUserLogin().get());

        ActivityResult result = activityResultRepository.save(activityResult);
        activityResultSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/activity-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /activity-results : Updates an existing activityResult.
     *
     * @param activityResult the activityResult to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated activityResult,
     * or with status 400 (Bad Request) if the activityResult is not valid,
     * or with status 500 (Internal Server Error) if the activityResult couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/activity-results")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<ActivityResult> updateActivityResult(@RequestBody ActivityResult activityResult) throws URISyntaxException {

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) return ResponseEntity.ok(null);

        log.debug("REST request to update ActivityResult : {}", activityResult);
        if (activityResult.getId() == null) {
            return createActivityResult(activityResult);
        }
        ActivityResult result = activityResultRepository.save(activityResult);
        activityResultSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, activityResult.getId()))
            .body(result);
    }

    /**
     * GET  /activity-results : get all the activityResults.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of activityResults in body
     */
    @GetMapping("/activity-results")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<List<ActivityResult>> getAllActivityResults(Pageable pageable) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) return ResponseEntity.ok(null);

        log.debug("REST request to get a page of ActivityResults");
        Page<ActivityResult> page = activityResultRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/activity-results");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /activity-results/:id : get the "id" activityResult.
     *
     * @param id the id of the activityResult to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the activityResult, or with status 404 (Not Found)
     */
    @GetMapping("/activity-results/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<ActivityResult> getActivityResult(@PathVariable String id) {

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) return ResponseEntity.ok(null);

        log.debug("REST request to get ActivityResult : {}", id);
        ActivityResult activityResult = activityResultRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(activityResult));
    }

    /**
     * DELETE  /activity-results/:id : delete the "id" activityResult.
     *
     * @param id the id of the activityResult to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/activity-results/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteActivityResult(@PathVariable String id) {

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) return ResponseEntity.ok(null);


        log.debug("REST request to delete ActivityResult : {}", id);
        activityResultRepository.delete(id);
        activityResultSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/activity-results?query=:query : search for the activityResult corresponding
     * to the query.
     *
     * @param query the query of the activityResult search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/activity-results")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<List<ActivityResult>> searchActivityResults(@RequestParam String query, Pageable pageable) {

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) return ResponseEntity.ok(null);

        log.debug("REST request to search for a page of ActivityResults for query {}", query);
        Page<ActivityResult> page = activityResultSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/activity-results");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/progress/{topic}")
    @Secured(AuthoritiesConstants.USER)
    @Timed
    public TopicProgress getProgressForTopic(@PathVariable String topic) {

        Iterable<Challenge> challenges = challengeRepository.findAllByTopicEquals(topic);

        int success = 0;
        int total = 0;

        for (Challenge challenge : challenges) {
            ActivityResult result = activityResultRepository.findByUserAndChallengeIdAndResult(SecurityUtils.getCurrentUserLogin().get(), challenge.getId(), "SUCCESS");

            if (result != null) {
                success++;
            }

            total++;
        }


        return  new TopicProgress(topic, total, success);
    }

    @GetMapping("/challenge-status/{challenge}")
    @Secured(AuthoritiesConstants.USER)
    public ChallengeStatus getChallengeStatus(@PathVariable String challenge) {

        ActivityResult result = activityResultRepository.findByUserAndChallengeIdAndResult(SecurityUtils.getCurrentUserLogin().get(), challenge, "SUCCESS");

        ChallengeStatus challengeStatus = new ChallengeStatus();
        challengeStatus.setChallengeId(challenge);

        if (result == null) {
            challengeStatus.setResult(false);
        } else {
            challengeStatus.setResult(true);
            challengeStatus.setTimeSpent(result.getTimeSpent());

        }

        return challengeStatus;
    }


    @GetMapping("/user-dashboard/{user}")
    @Secured(AuthoritiesConstants.ADMIN)
    public ArrayList<DashboardTopicOverview> getUserDashboard(@PathVariable String user) {

        ArrayList<DashboardQuestionResult> result = new ArrayList<>();
        Iterable<ActivityResult> activityResults = this.activityResultRepository.findAllByUser(user);

        for (ActivityResult activityResult : activityResults) {

            Challenge challenge = this.challengeRepository.findOne(activityResult.getChallengeId());

            boolean found = false;
            for (DashboardQuestionResult item : result) {
                if (item.getQuestion().equals(challenge.getQuestion())) {

                    if (activityResult.getResult().equals("SUCCESS")) item.setSuccess(item.getSuccess() + 1);
                    if (activityResult.getResult().equals("FAIL")) item.setFail(item.getFail() + 1);

                    int count = item.getSuccess() + item.getFail();
                    int avgTime = ((item.getAverageTime() * (count - 1)) + activityResult.getTimeSpent()) / count;

                    item.setAverageTime(avgTime);

                    found = true;
                    break;
                }
            }

            if (challenge != null && !found) {
                DashboardQuestionResult item = new DashboardQuestionResult();
                item.setQuestion(challenge.getQuestion());
                item.setTopic(this.topicRepository.findOne(challenge.getTopic()).getName());
                item.setAverageTime(activityResult.getTimeSpent());

                if (activityResult.getResult().equals("SUCCESS")) item.setSuccess(1);
                if (activityResult.getResult().equals("FAIL")) item.setFail(1);

                result.add(item);
            }
        }


        ArrayList<DashboardTopicOverview> topicResult = new ArrayList<>();

        for (DashboardQuestionResult item : result) {

            boolean found = false;

            for(DashboardTopicOverview topic : topicResult) {

                if (topic.getTopic().equals(item.getTopic())) {
                    topic.getDashboardQuestionResults().add(item);
                    found = true;
                    break;
                }
            }

            if (!found) {
                DashboardTopicOverview topic = new DashboardTopicOverview();
                topic.getDashboardQuestionResults().add(item);
                topic.setTopic(item.getTopic());
                topicResult.add(topic);
            }

        }


        return topicResult;
    }

}

