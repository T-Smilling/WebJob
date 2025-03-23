package com.javaweb.jobIT.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1500, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    ROLE_NOT_FOUND(1501, "Role not found", HttpStatus.NOT_FOUND),
    USER_EXISTED(1502, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_OR_PASSWORD_INCORRECT(1503, "Username or password incorrect", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1505, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1506, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1507, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_IS_NOT_ACTIVE(1510, "User is inactive", HttpStatus.BAD_REQUEST),
    NOT_FOUND_RESUME(1511, "Not found resume", HttpStatus.NOT_FOUND),
    NOT_CREATED_INTERVIEW(1512, "Not created interview", HttpStatus.BAD_REQUEST),
    NOT_UPDATE(1513, "Cannot update because the resume is under review.", HttpStatus.BAD_REQUEST),
    JOB_NOT_ACTIVE(1514, "Job not active", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
