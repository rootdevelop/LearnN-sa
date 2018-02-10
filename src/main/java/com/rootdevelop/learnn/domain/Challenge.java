package com.rootdevelop.learnn.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Challenge.
 */
@Document(collection = "challenge")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "challenge")
public class Challenge implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("question")
    private String question;

    @NotNull
    @Field("answer")
    private String answer;

    @Field("language")
    private String language;

    @Field("active")
    private Boolean active;

    @Field("snippet")
    private String snippet;

    @Field("topic")
    private String topic;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public Challenge question(String question) {
        this.question = question;
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public Challenge answer(String answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getLanguage() {
        return language;
    }

    public Challenge language(String language) {
        this.language = language;
        return this;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean isActive() {
        return active;
    }

    public Challenge active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getSnippet() {
        return snippet;
    }

    public Challenge snippet(String snippet) {
        this.snippet = snippet;
        return this;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

    public String getTopic() {
        return topic;
    }

    public Challenge topic(String topic) {
        this.topic = topic;
        return this;
    }

    public void setTopic(String topic) {
        this.topic = topic;
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
        Challenge challenge = (Challenge) o;
        if (challenge.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), challenge.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Challenge{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", language='" + getLanguage() + "'" +
            ", active='" + isActive() + "'" +
            ", snippet='" + getSnippet() + "'" +
            ", topic='" + getTopic() + "'" +
            "}";
    }
}
