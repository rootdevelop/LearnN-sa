package com.rootdevelop.learnn.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.rootdevelop.learnn.domain.Challenge;

import com.rootdevelop.learnn.repository.ChallengeRepository;
import com.rootdevelop.learnn.repository.search.ChallengeSearchRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Challenge.
 */
@RestController
@RequestMapping("/api")
public class ChallengeResource {

    private final Logger log = LoggerFactory.getLogger(ChallengeResource.class);

    private static final String ENTITY_NAME = "challenge";

    private final ChallengeRepository challengeRepository;

    private final ChallengeSearchRepository challengeSearchRepository;

    public ChallengeResource(ChallengeRepository challengeRepository, ChallengeSearchRepository challengeSearchRepository) {
        this.challengeRepository = challengeRepository;
        this.challengeSearchRepository = challengeSearchRepository;
    }

    /**
     * POST  /challenges : Create a new challenge.
     *
     * @param challenge the challenge to create
     * @return the ResponseEntity with status 201 (Created) and with body the new challenge, or with status 400 (Bad Request) if the challenge has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/challenges")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Challenge> createChallenge(@Valid @RequestBody Challenge challenge) throws URISyntaxException {

        log.debug("REST request to save Challenge : {}", challenge);
        if (challenge.getId() != null) {
            throw new BadRequestAlertException("A new challenge cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Challenge result = challengeRepository.save(challenge);
        challengeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/challenges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /challenges : Updates an existing challenge.
     *
     * @param challenge the challenge to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated challenge,
     * or with status 400 (Bad Request) if the challenge is not valid,
     * or with status 500 (Internal Server Error) if the challenge couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/challenges")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Challenge> updateChallenge(@Valid @RequestBody Challenge challenge) throws URISyntaxException {

        log.debug("REST request to update Challenge : {}", challenge);
        if (challenge.getId() == null) {
            return createChallenge(challenge);
        }
        Challenge result = challengeRepository.save(challenge);
        challengeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, challenge.getId().toString()))
            .body(result);
    }

    /**
     * GET  /challenges : get all the challenges.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of challenges in body
     */
    @GetMapping("/challenges")
    @Secured(AuthoritiesConstants.USER)
    @Timed
    public ResponseEntity<List<Challenge>> getAllChallenges(Pageable pageable) {
        log.debug("REST request to get a page of Challenges");
        Page<Challenge> page = challengeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/challenges");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /challenges/:id : get the "id" challenge.
     *
     * @param id the id of the challenge to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the challenge, or with status 404 (Not Found)
     */
    @GetMapping("/challenges/{id}")
    @Secured(AuthoritiesConstants.USER)
    @Timed
    public ResponseEntity<Challenge> getChallenge(@PathVariable String id) {
        log.debug("REST request to get Challenge : {}", id);
        Challenge challenge = challengeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(challenge));
    }

    /**
     * DELETE  /challenges/:id : delete the "id" challenge.
     *
     * @param id the id of the challenge to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/challenges/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteChallenge(@PathVariable String id) {

        log.debug("REST request to delete Challenge : {}", id);
        challengeRepository.delete(id);
        challengeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/challenges?query=:query : search for the challenge corresponding
     * to the query.
     *
     * @param query the query of the challenge search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/challenges")
    @Secured(AuthoritiesConstants.USER)
    @Timed
    public ResponseEntity<List<Challenge>> searchChallenges(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Challenges for query {}", query);
        Page<Challenge> page = challengeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/challenges");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
