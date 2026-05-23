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
public class DashboardSummaryResponse {
    private int totalCitiesTracked;
    private double globalAverageAqi;
    private double globalAverageWaterContamination;
    private double globalAverageSoilDegradation;
    private double globalAverageNoiseLevel;
    
    private List<CityPollution> mostPollutedCities;
    private List<CityPollution> safestCities;
}
