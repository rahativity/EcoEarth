package com.pollution.analyzer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WaterPollutionResponse {
    private String city;
    private String country;
    private double contaminationLevel;
    private String healthRiskLevel;
    private String equivalentExposure;
    private String mainContaminant;
}
