package com.bitehub.service;

import com.bitehub.dto.HealthResponse;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public HealthResponse getHealth() {
        return new HealthResponse("UP", "bitehub", "Spring Boot backend is running");
    }
}
