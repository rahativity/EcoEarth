package com.pollution.analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitySummaryResponse {
    private String name;
    private String country;
    private int aqi;
    private String classification;
}
