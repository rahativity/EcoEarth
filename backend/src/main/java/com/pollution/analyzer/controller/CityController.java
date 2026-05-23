package com.pollution.analyzer.controller;

import com.pollution.analyzer.dto.CitySummaryResponse;
import com.pollution.analyzer.dto.StandardResponse;
import com.pollution.analyzer.service.PollutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@RequiredArgsConstructor
public class CityController {

    private final PollutionService pollutionService;

    @GetMapping
    public StandardResponse<List<CitySummaryResponse>> getAllCities() {
        return StandardResponse.success(pollutionService.getAllCitySummaries());
    }
}
