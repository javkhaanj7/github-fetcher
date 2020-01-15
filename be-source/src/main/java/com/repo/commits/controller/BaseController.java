package com.repo.commits.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BaseController {

	public ResponseEntity<?> response(Object entity, HttpStatus status) {
		return new ResponseEntity<>(entity, status);
	}

	public ResponseEntity<?> responseOk(Object entity) {
		return ResponseEntity.ok(entity);
	}

	public ResponseEntity<?> responseBad(Object entity) {
		return ResponseEntity.badRequest().body(entity);
	}

}
