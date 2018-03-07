package com.rootdevelop.learnn.domain;

import lombok.Data;

@Data
public class DashboardQuestionResult {

    private String topic;
    private String question;
    private int success;
    private int fail;
    private int averageTime;
}
