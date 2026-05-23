package com.pollution.analyzer.config;

import com.pollution.analyzer.model.CityPollution;
import com.pollution.analyzer.repository.CityPollutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CityPollutionRepository repository;

    private static final String[][] CITY_LIST = {
        {"Dhaka", "Bangladesh"}, {"Chittagong", "Bangladesh"}, {"Sylhet", "Bangladesh"}, {"Rajshahi", "Bangladesh"},
        {"Delhi", "India"}, {"Mumbai", "India"}, {"Bangalore", "India"}, {"Chennai", "India"}, {"Kolkata", "India"}, {"Hyderabad", "India"},
        {"Beijing", "China"}, {"Shanghai", "China"}, {"Shenzhen", "China"}, {"Guangzhou", "China"}, {"Chengdu", "China"},
        {"Tokyo", "Japan"}, {"Osaka", "Japan"}, {"Kyoto", "Japan"}, {"Yokohama", "Japan"}, {"Sapporo", "Japan"},
        {"New York", "USA"}, {"Los Angeles", "USA"}, {"Chicago", "USA"}, {"Houston", "USA"}, {"Phoenix", "USA"}, {"Miami", "USA"}, {"Seattle", "USA"},
        {"London", "UK"}, {"Manchester", "UK"}, {"Birmingham", "UK"}, {"Glasgow", "UK"}, {"Edinburgh", "UK"},
        {"Toronto", "Canada"}, {"Vancouver", "Canada"}, {"Montreal", "Canada"}, {"Calgary", "Canada"},
        {"Berlin", "Germany"}, {"Munich", "Germany"}, {"Frankfurt", "Germany"}, {"Hamburg", "Germany"},
        {"Paris", "France"}, {"Marseille", "France"}, {"Lyon", "France"}, {"Toulouse", "France"},
        {"Dubai", "UAE"}, {"Abu Dhabi", "UAE"}, {"Sharjah", "UAE"},
        {"Sydney", "Australia"}, {"Melbourne", "Australia"}, {"Brisbane", "Australia"}, {"Perth", "Australia"},
        {"São Paulo", "Brazil"}, {"Rio de Janeiro", "Brazil"}, {"Brasília", "Brazil"}, {"Salvador", "Brazil"},
        {"Seoul", "South Korea"}, {"Busan", "South Korea"}, {"Incheon", "South Korea"},
        {"Moscow", "Russia"}, {"Saint Petersburg", "Russia"}, {"Novosibirsk", "Russia"},
        {"Cairo", "Egypt"}, {"Alexandria", "Egypt"}, {"Giza", "Egypt"},
        {"Lagos", "Nigeria"}, {"Abuja", "Nigeria"}, {"Kano", "Nigeria"},
        {"Johannesburg", "South Africa"}, {"Cape Town", "South Africa"}, {"Durban", "South Africa"},
        {"Nairobi", "Kenya"}, {"Mombasa", "Kenya"},
        {"Istanbul", "Turkey"}, {"Ankara", "Turkey"}, {"Izmir", "Turkey"},
        {"Mexico City", "Mexico"}, {"Guadalajara", "Mexico"}, {"Monterrey", "Mexico"},
        {"Buenos Aires", "Argentina"}, {"Córdoba", "Argentina"}, {"Rosario", "Argentina"},
        {"Rome", "Italy"}, {"Milan", "Italy"}, {"Naples", "Italy"},
        {"Madrid", "Spain"}, {"Barcelona", "Spain"}, {"Valencia", "Spain"},
        {"Jakarta", "Indonesia"}, {"Surabaya", "Indonesia"}, {"Bandung", "Indonesia"},
        {"Bangkok", "Thailand"}, {"Chiang Mai", "Thailand"}, {"Phuket", "Thailand"},
        {"Ho Chi Minh City", "Vietnam"}, {"Hanoi", "Vietnam"}, {"Da Nang", "Vietnam"},
        {"Manila", "Philippines"}, {"Cebu City", "Philippines"}, {"Davao City", "Philippines"},
        {"Karachi", "Pakistan"}, {"Lahore", "Pakistan"}, {"Islamabad", "Pakistan"},
        {"Riyadh", "Saudi Arabia"}, {"Jeddah", "Saudi Arabia"}, {"Mecca", "Saudi Arabia"}
    };

    private static final String[] AIR_POLLUTANTS = {"PM2.5", "PM10", "NO2", "Ozone", "SO2", "CO"};
    private static final String[] WATER_CONTAMINANTS = {"Industrial Waste", "Sewage", "Heavy Metals", "Agricultural Runoff", "Microplastics", "Chlorine"};
    private static final String[] SOIL_CONTAMINANTS = {"Heavy Metals", "Pesticides", "Industrial Runoff", "Fertilizers", "Plastic Waste", "Oil Spills"};
    private static final String[] NOISE_SOURCES = {"Traffic", "Construction", "Industry", "Aircraft", "Public Events", "Commercial Activity"};

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            List<CityPollution> cities = new ArrayList<>();
            Random random = new Random(42); // Fixed seed for reproducible data

            for (String[] cityInfo : CITY_LIST) {
                String name = cityInfo[0];
                String country = cityInfo[1];

                // Generate realistic-ish numbers
                // Some regions generally have higher/lower pollution, but we'll add some randomness
                int baseAqi = 20 + random.nextInt(150);
                if (country.equals("India") || country.equals("Bangladesh") || country.equals("Pakistan")) {
                    baseAqi += 100 + random.nextInt(100);
                } else if (country.equals("China") || country.equals("Indonesia") || country.equals("Nigeria")) {
                    baseAqi += 50 + random.nextInt(100);
                }

                double waterContamination = 10 + random.nextDouble() * 50;
                if (baseAqi > 100) waterContamination += 30;

                double soilDegradation = 1 + random.nextDouble() * 5;
                if (baseAqi > 100) soilDegradation += 3;

                int noise = 50 + random.nextInt(35);
                if (baseAqi > 100) noise += 15;

                cities.add(CityPollution.builder()
                        .name(name)
                        .country(country)
                        .aqi(Math.min(baseAqi, 500))
                        .mainAirPollutant(AIR_POLLUTANTS[random.nextInt(AIR_POLLUTANTS.length)])
                        .waterContaminationLevel(Math.min(Math.round(waterContamination * 10.0) / 10.0, 100.0))
                        .mainWaterContaminant(WATER_CONTAMINANTS[random.nextInt(WATER_CONTAMINANTS.length)])
                        .soilDegradationIndex(Math.min(Math.round(soilDegradation * 10.0) / 10.0, 10.0))
                        .mainSoilContaminant(SOIL_CONTAMINANTS[random.nextInt(SOIL_CONTAMINANTS.length)])
                        .noiseLevel(Math.min(noise, 120))
                        .mainNoiseSource(NOISE_SOURCES[random.nextInt(NOISE_SOURCES.length)])
                        .build());
            }

            repository.saveAll(cities);
            System.out.println("Database seeded with " + cities.size() + " cities.");
        }
    }
}
