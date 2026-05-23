package com.pollution.analyzer.service;

import com.pollution.analyzer.dto.*;
import com.pollution.analyzer.exception.ResourceNotFoundException;
import com.pollution.analyzer.model.CityPollution;
import com.pollution.analyzer.repository.CityPollutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollutionService {

    private final CityPollutionRepository repository;

    private CityPollution getCityPollution(String cityName) {
        return repository.findByNameIgnoreCase(cityName.trim())
                .orElseThrow(() -> new ResourceNotFoundException("City not found: " + cityName));
    }

    public String getAqiClassification(int aqi) {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy (Sensitive)";
        if (aqi <= 200) return "Unhealthy";
        return "Hazardous";
    }

    public AirPollutionResponse getAirPollution(String cityName) {
        CityPollution city = getCityPollution(cityName);
        int aqi = city.getAqi();
        
        // Mock calculations
        double cigaretteEquivalent = Math.round((aqi / 22.0) * 100.0) / 100.0;
        double lifespanReductionHours = Math.round((aqi * 0.5) * 100.0) / 100.0;
        
        return AirPollutionResponse.builder()
                .city(city.getName())
                .country(city.getCountry())
                .aqi(aqi)
                .classification(getAqiClassification(aqi))
                .cigaretteEquivalent(cigaretteEquivalent)
                .lifespanReductionHours(lifespanReductionHours)
                .mainCause(city.getMainAirPollutant())
                .build();
    }

    public WaterPollutionResponse getWaterPollution(String cityName) {
        CityPollution city = getCityPollution(cityName);
        double level = city.getWaterContaminationLevel();
        
        String healthRisk = level > 70 ? "High" : (level > 40 ? "Medium" : "Low");
        String equivalentExposure = level > 70 ? "Drinking unfiltered swamp water" : (level > 40 ? "Drinking from a mildly polluted stream" : "Safe tap water equivalent");
        
        return WaterPollutionResponse.builder()
                .city(city.getName())
                .country(city.getCountry())
                .contaminationLevel(level)
                .healthRiskLevel(healthRisk)
                .equivalentExposure(equivalentExposure)
                .mainContaminant(city.getMainWaterContaminant())
                .build();
    }

    public SoilPollutionResponse getSoilPollution(String cityName) {
        CityPollution city = getCityPollution(cityName);
        double index = city.getSoilDegradationIndex();
        
        String damage = index > 7 ? "Severe yield loss expected" : (index > 4 ? "Moderate nutrient deficiency" : "Minimal impact");
        String foodRisk = index > 7 ? "High Risk of Heavy Metals" : (index > 4 ? "Medium Risk" : "Low Risk");
        String impactScore = index > 7 ? "Critical" : (index > 4 ? "Warning" : "Stable");
        
        return SoilPollutionResponse.builder()
                .city(city.getName())
                .country(city.getCountry())
                .degradationIndex(index)
                .cropDamageEstimation(damage)
                .foodContaminationRisk(foodRisk)
                .environmentalImpactScore(impactScore)
                .build();
    }

    public SoundPollutionResponse getSoundPollution(String cityName) {
        CityPollution city = getCityPollution(cityName);
        int db = city.getNoiseLevel();
        
        String category;
        String healthImpact;
        String exposure;

        if (db <= 30) {
            category = "Quiet";
            healthImpact = "No impact; promotes relaxation and sleep.";
            exposure = "Unlimited";
        } else if (db <= 60) {
            category = "Normal";
            healthImpact = "Generally safe; might cause mild annoyance over long periods.";
            exposure = "Safe for extended periods";
        } else if (db <= 85) {
            category = "High";
            healthImpact = "Can cause stress, sleep disruption, and reduced concentration.";
            exposure = "Limit to 8 hours daily";
        } else if (db <= 110) {
            category = "Dangerous";
            healthImpact = "High risk of progressive hearing damage and chronic stress.";
            exposure = "Less than 30 minutes";
        } else {
            category = "Extremely Dangerous";
            healthImpact = "Immediate risk of acoustic trauma and permanent hearing loss.";
            exposure = "Zero exposure without protection";
        }

        return SoundPollutionResponse.builder()
                .city(city.getName())
                .country(city.getCountry())
                .averageNoiseLevel(db)
                .noiseCategory(category)
                .healthImpactEstimation(healthImpact)
                .recommendedExposureDuration(exposure)
                .mainCause(city.getMainNoiseSource())
                .build();
    }

    public List<CityPollution> getComparisonData() {
        return repository.findAll();
    }

    public DashboardSummaryResponse getDashboardSummary() {
        List<CityPollution> allCities = repository.findAll();
        if (allCities.isEmpty()) return null;

        int totalAqi = 0, totalNoise = 0;
        double totalWater = 0, totalSoil = 0;

        for (CityPollution c : allCities) {
            totalAqi += c.getAqi();
            totalWater += c.getWaterContaminationLevel();
            totalSoil += c.getSoilDegradationIndex();
            totalNoise += c.getNoiseLevel();
        }

        int count = allCities.size();
        
        // Sort by AQI to get most polluted and safest
        allCities.sort((a, b) -> Integer.compare(b.getAqi(), a.getAqi())); // Descending
        
        List<CityPollution> mostPolluted = allCities.subList(0, Math.min(5, count));
        
        List<CityPollution> safest = new java.util.ArrayList<>();
        for (int i = count - 1; i >= Math.max(0, count - 5); i--) {
            safest.add(allCities.get(i));
        }

        return DashboardSummaryResponse.builder()
                .totalCitiesTracked(count)
                .globalAverageAqi((double) totalAqi / count)
                .globalAverageWaterContamination(totalWater / count)
                .globalAverageSoilDegradation(totalSoil / count)
                .globalAverageNoiseLevel((double) totalNoise / count)
                .mostPollutedCities(mostPolluted)
                .safestCities(safest)
                .build();
    }

    public ComparisonResponse compareCities(String city1Name, String city2Name) {
        CityPollution c1 = getCityPollution(city1Name);
        CityPollution c2 = getCityPollution(city2Name);

        // Score Calculation (Lower is better, scale of 0-100 roughly)
        // AQI: 0-300+ -> cap at 300, scale to 40% weight
        // Water: 0-100 -> 30% weight
        // Soil: 0-10 -> 10% weight
        // Sound: 30-120 -> 20% weight
        
        double c1Score = calculateScore(c1);
        double c2Score = calculateScore(c2);

        String c1Risk = determineRisk(c1Score);
        String c2Risk = determineRisk(c2Score);

        String saferCity = c1Score < c2Score ? c1.getName() : (c2Score < c1Score ? c2.getName() : "Equal");

        java.util.List<String> comments = new java.util.ArrayList<>();
        
        // Air comparison
        if (Math.abs(c1.getAqi() - c2.getAqi()) > 20) {
            String worse = c1.getAqi() > c2.getAqi() ? c1.getName() : c2.getName();
            String better = c1.getAqi() > c2.getAqi() ? c2.getName() : c1.getName();
            comments.add(worse + " has significantly higher air pollution than " + better + ".");
        } else {
            comments.add("Both cities have comparable air quality levels.");
        }

        // Water comparison
        if (Math.abs(c1.getWaterContaminationLevel() - c2.getWaterContaminationLevel()) > 15) {
            String worse = c1.getWaterContaminationLevel() > c2.getWaterContaminationLevel() ? c1.getName() : c2.getName();
            comments.add("Water contamination in " + worse + " is notably worse.");
        } else {
            comments.add("Water contamination levels are relatively balanced between the two cities.");
        }

        // Sound comparison
        if (c1.getNoiseLevel() > 85 && c2.getNoiseLevel() > 85) {
            comments.add("Sound pollution in both cities exceeds safe urban limits.");
        } else if (c1.getNoiseLevel() > c2.getNoiseLevel() + 10) {
             comments.add(c1.getName() + " is a much noisier city compared to " + c2.getName() + ".");
        } else if (c2.getNoiseLevel() > c1.getNoiseLevel() + 10) {
             comments.add(c2.getName() + " is a much noisier city compared to " + c1.getName() + ".");
        }

        return ComparisonResponse.builder()
                .city1(c1)
                .city2(c2)
                .city1Score(Math.round(c1Score * 100.0) / 100.0)
                .city2Score(Math.round(c2Score * 100.0) / 100.0)
                .city1RiskLevel(c1Risk)
                .city2RiskLevel(c2Risk)
                .saferCityIndicator(saferCity)
                .intelligentComments(comments)
                .build();
    }

    private double calculateScore(CityPollution city) {
        double aqiScore = Math.min(city.getAqi(), 300) / 300.0 * 40;
        double waterScore = city.getWaterContaminationLevel() / 100.0 * 30;
        double soilScore = city.getSoilDegradationIndex() / 10.0 * 10;
        double soundScore = Math.max(0, Math.min(city.getNoiseLevel() - 30, 90)) / 90.0 * 20;
        return aqiScore + waterScore + soilScore + soundScore;
    }

    private String determineRisk(double score) {
        if (score < 25) return "Low Risk";
        if (score < 50) return "Moderate Risk";
        if (score < 75) return "High Risk";
        return "Severe Risk";
    }

    public AdviceResponse getAdvice(String classification) {
        String level = classification.toLowerCase();
        
        if (level.contains("good")) {
            return AdviceResponse.builder()
                    .classification("Good")
                    .healthImplications("Air quality is considered satisfactory, and air pollution poses little or no risk.")
                    .actionableAdvice(Arrays.asList("Enjoy outdoor activities.", "Open windows to bring in fresh air."))
                    .build();
        } else if (level.contains("moderate")) {
            return AdviceResponse.builder()
                    .classification("Moderate")
                    .healthImplications("Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.")
                    .actionableAdvice(Arrays.asList("Unusually sensitive people should consider reducing prolonged or heavy exertion.", "Keep indoor air clean."))
                    .build();
        } else if (level.contains("sensitive")) {
            return AdviceResponse.builder()
                    .classification("Unhealthy (Sensitive)")
                    .healthImplications("Members of sensitive groups may experience health effects. The general public is not likely to be affected.")
                    .actionableAdvice(Arrays.asList("Sensitive groups should reduce prolonged or heavy exertion.", "Keep windows closed during peak pollution hours."))
                    .build();
        } else if (level.contains("unhealthy") && !level.contains("sensitive")) {
            return AdviceResponse.builder()
                    .classification("Unhealthy")
                    .healthImplications("Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.")
                    .actionableAdvice(Arrays.asList("Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion.", "Everyone else, especially children, should limit prolonged outdoor exertion.", "Wear a high-quality N95 mask if you must go outside."))
                    .build();
        } else {
            return AdviceResponse.builder()
                    .classification("Hazardous")
                    .healthImplications("Health warnings of emergency conditions. The entire population is more likely to be affected.")
                    .actionableAdvice(Arrays.asList("Avoid all physical activity outdoors.", "Remain indoors and keep activity levels low.", "Use air purifiers indoors if available."))
                    .build();
        }
    }

    public List<CitySummaryResponse> getAllCitySummaries() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(CityPollution::getName))
                .map(city -> CitySummaryResponse.builder()
                        .name(city.getName())
                        .country(city.getCountry())
                        .aqi(city.getAqi())
                        .classification(getAqiClassification(city.getAqi()))
                        .build())
                .collect(Collectors.toList());
    }
}
