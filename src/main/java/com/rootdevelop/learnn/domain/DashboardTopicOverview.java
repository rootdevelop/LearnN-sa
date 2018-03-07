package com.rootdevelop.learnn.domain;

import java.util.ArrayList;

public class DashboardTopicOverview {
    private ArrayList<DashboardQuestionResult> dashboardQuestionResults = new ArrayList<>();
    private String topic;

    public ArrayList<DashboardQuestionResult> getDashboardQuestionResults() {
        return dashboardQuestionResults;
    }

    public void setDashboardQuestionResults(ArrayList<DashboardQuestionResult> dashboardQuestionResults) {
        this.dashboardQuestionResults = dashboardQuestionResults;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
