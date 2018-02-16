package com.rootdevelop.learnn.domain;

public class TopicProgress {

    private String topic;

    private int total;

    private int success;

    public TopicProgress() {}

    public TopicProgress(String topic, int total, int success) {
        this.topic = topic;
        this.total = total;
        this.success = success;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getSuccess() {
        return success;
    }

    public void setSuccess(int success) {
        this.success = success;
    }
}
