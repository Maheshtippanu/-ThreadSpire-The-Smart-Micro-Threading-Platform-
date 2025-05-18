package com.threadspire.intern.dto;
import lombok.Data;

import java.util.List;

@Data
public class ForkThreadRequest {
    private Long threadId;   // This is the field being accessed
    private String comment;
    private Long getThreadId;
    private Long originalThreadId;
    private List<String> editedSegments;
    private String title;
}