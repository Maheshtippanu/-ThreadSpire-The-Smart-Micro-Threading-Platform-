package com.threadspire.intern.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateCollectionRequest {
    private String name;
    private List<Long> threadIds;
}
