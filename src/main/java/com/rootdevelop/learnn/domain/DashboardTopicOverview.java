package com.rootdevelop.learnn.domain;

import lombok.Data;

import java.util.ArrayList;

@Data
public class DashboardTopicOverview {
    private ArrayList<DashboardQuestionResult> dashboardQuestionResults = new ArrayList<>();
    private String topic;
}
