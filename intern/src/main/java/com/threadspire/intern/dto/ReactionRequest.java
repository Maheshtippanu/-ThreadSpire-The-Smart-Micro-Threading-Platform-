package com.threadspire.intern.dto;
import com.threadspire.intern.models.ReactionType;
import lombok.Data;

@Data
public class ReactionRequest {
    private long postId;
    private ReactionType type;
    private Long threadId;
    private int segmentIndex;
    private String emoji;
}
