package com.rootdevelop.learnn.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A ActivityResult.
 */
@Document(collection = "activity_result")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "activityresult")
public class ActivityResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user")
    private String user;

    @Field("challenge_id")
    private String challengeId;

    @Field("result")
    private String result;

    @Field("answer")
    private String answer;

    @Field("time_spent")
    private Integer timeSpent;

    @Field("timestamp")
    private ZonedDateTime timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public ActivityResult user(String user) {
        this.user = user;
        return this;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getChallengeId() {
        return challengeId;
    }

    public ActivityResult challengeId(String challengeId) {
        this.challengeId = challengeId;
        return this;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }

    public String getResult() {
        return result;
    }

    public ActivityResult result(String result) {
        this.result = result;
        return this;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public ActivityResult timeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
        return this;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public ActivityResult timestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ActivityResult activityResult = (ActivityResult) o;
        if (activityResult.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), activityResult.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ActivityResult{" +
            "id=" + getId() +
            ", user='" + getUser() + "'" +
            ", challengeId='" + getChallengeId() + "'" +
            ", result='" + getResult() + "'" +
            ", timeSpent=" + getTimeSpent() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
