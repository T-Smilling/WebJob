package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.user.AuthenticationRequest;
import com.javaweb.jobIT.dto.request.user.CheckTokenRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.user.AuthenticationResponse;
import com.javaweb.jobIT.dto.response.user.CheckTokenResponse;
import com.javaweb.jobIT.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RestController
@RequestMapping(value = "/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) throws ParseException {
        AuthenticationResponse result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .message("Login successful")
                .build();
    }

    @GetMapping("/google-login")
    public void googleLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/google-login-success")
    public void googleLoginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User, HttpServletResponse response) throws IOException {
        AuthenticationResponse authResponse = authenticationService.googleLogin(oAuth2User);
        String redirectUrl = "http://localhost:3000/google/callback?token=" + authResponse.getToken();
        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/validate-token")
    ApiResponse<CheckTokenResponse> validateToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = "";
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }
        CheckTokenResponse result = authenticationService.checkValidToken(CheckTokenRequest.builder().token(token).build());
        return ApiResponse.<CheckTokenResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(HttpServletRequest request)
            throws ParseException, JOSEException {
        AuthenticationResponse result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
    @PostMapping("/logout")
    ApiResponse<Void> logout(HttpServletRequest request) {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .build();
    }
}
