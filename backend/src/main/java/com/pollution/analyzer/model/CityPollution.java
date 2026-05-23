package com.pollution.analyzer.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityPollution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    
    // Air
    private int aqi;
    private String mainAirPollutant;
    
    // Water
    private double waterContaminationLevel; // percentage (0-100)
    private String mainWaterContaminant;
    
    // Soil
    private double soilDegradationIndex; // 0-10
    private String mainSoilContaminant;
    
    // Sound
    private int noiseLevel; // dB
    private String mainNoiseSource;
}
