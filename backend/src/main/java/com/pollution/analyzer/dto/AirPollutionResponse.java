package com.pollution.analyzer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AirPollutionResponse {
    private String city;
    private String country;
    private int aqi;
    private String classification; // Good, Moderate, etc.
    private double cigaretteEquivalent;
    private double lifespanReductionHours;
    private String mainCause;
}
