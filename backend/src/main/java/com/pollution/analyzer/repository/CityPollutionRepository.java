package com.pollution.analyzer.repository;

import com.pollution.analyzer.model.CityPollution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityPollutionRepository extends JpaRepository<CityPollution, Long> {
    Optional<CityPollution> findByNameIgnoreCase(String name);
}
