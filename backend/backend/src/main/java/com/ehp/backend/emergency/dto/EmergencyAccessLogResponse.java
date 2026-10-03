package com.ehp.backend.emergency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAccessLogResponse {

    private Long id;

    private String accessType;

    private Boolean success;

    private LocalDateTime accessedAt;
}