package com.pollution.analyzer.dto;

import com.pollution.analyzer.model.CityPollution;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResponse {
    private CityPollution city1;
    private CityPollution city2;
    
    private double city1Score;
    private double city2Score;
    
    private String city1RiskLevel;
    private String city2RiskLevel;
    
    private String saferCityIndicator;
    private List<String> intelligentComments;
}
