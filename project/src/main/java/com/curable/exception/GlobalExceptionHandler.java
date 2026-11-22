package com.curable.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException exception,
			HttpServletRequest request) {
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("timestamp", Instant.now());
		response.put("status", exception.getStatus().value());
		response.put("error", exception.getStatus().getReasonPhrase());
		response.put("message", exception.getReason());
		response.put("path", request.getRequestURI());
		return ResponseEntity.status(exception.getStatus()).body(response);
	}

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex,
			HttpServletRequest request) {

		Map<String, Object> response = new LinkedHashMap<>();
		response.put("timestamp", Instant.now());
		response.put("status", HttpStatus.CONFLICT.value());
		response.put("error", HttpStatus.CONFLICT.getReasonPhrase());
		response.put("errorCode", ex.getErrorCode());
		response.put("message", ex.getMessage());
		response.put("path", request.getRequestURI());

		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}
}
