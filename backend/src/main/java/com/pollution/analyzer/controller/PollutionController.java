package com.pollution.analyzer.controller;

import com.pollution.analyzer.dto.*;
import com.pollution.analyzer.model.CityPollution;
import com.pollution.analyzer.service.PollutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pollution")
@RequiredArgsConstructor
public class PollutionController {

    private final PollutionService pollutionService;

    @GetMapping("/air")
    public StandardResponse<AirPollutionResponse> getAirPollution(@RequestParam String city) {
        return StandardResponse.success(pollutionService.getAirPollution(city));
    }

    @GetMapping("/water")
    public StandardResponse<WaterPollutionResponse> getWaterPollution(@RequestParam String city) {
        return StandardResponse.success(pollutionService.getWaterPollution(city));
    }

    @GetMapping("/soil")
    public StandardResponse<SoilPollutionResponse> getSoilPollution(@RequestParam String city) {
        return StandardResponse.success(pollutionService.getSoilPollution(city));
    }

    @GetMapping("/comparison")
    public StandardResponse<List<CityPollution>> getComparison() {
        return StandardResponse.success(pollutionService.getComparisonData());
    }

    @GetMapping("/summary")
    public StandardResponse<DashboardSummaryResponse> getSummary() {
        return StandardResponse.success(pollutionService.getDashboardSummary());
    }

    @GetMapping("/sound")
    public StandardResponse<SoundPollutionResponse> getSoundPollution(@RequestParam String city) {
        return StandardResponse.success(pollutionService.getSoundPollution(city));
    }

    @GetMapping("/compare")
    public StandardResponse<ComparisonResponse> compareCities(
            @RequestParam String city1,
            @RequestParam String city2) {
        return StandardResponse.success(pollutionService.compareCities(city1, city2));
    }

    @GetMapping("/advice")
    public StandardResponse<AdviceResponse> getAdvice(@RequestParam String classification) {
        return StandardResponse.success(pollutionService.getAdvice(classification));
    }
}
