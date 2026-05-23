package com.pollution.analyzer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SoilPollutionResponse {
    private String city;
    private String country;
    private double degradationIndex;
    private String cropDamageEstimation;
    private String foodContaminationRisk;
    private String environmentalImpactScore;
}
