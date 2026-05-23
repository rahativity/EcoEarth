package com.pollution.analyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdviceResponse {
    private String classification;
    private String healthImplications;
    private List<String> actionableAdvice;
}
