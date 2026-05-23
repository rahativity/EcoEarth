package com.pollution.analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StandardResponse<T> {
    private int status;
    private String message;
    private T data;

    public static <T> StandardResponse<T> success(T data) {
        return new StandardResponse<>(200, "success", data);
    }

    public static <T> StandardResponse<T> error(int status, String message) {
        return new StandardResponse<>(status, message, null);
    }
}
