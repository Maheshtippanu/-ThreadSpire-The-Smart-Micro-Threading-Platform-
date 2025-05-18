package com.threadspire.intern.dto;
import lombok.Data;

import java.util.List;

@Data
public class CreateThreadRequest {
    private String title;
    private List<String> segments;
    private List<String> tags;
    private boolean draft;

    public boolean isPublished() {
    return draft;
    }
}
