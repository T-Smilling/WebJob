package com.javaweb.jobIT.service;

import com.javaweb.jobIT.constant.RoleEnum;
import com.javaweb.jobIT.dto.request.user.AuthenticationRequest;
import com.javaweb.jobIT.dto.request.user.CheckTokenRequest;
import com.javaweb.jobIT.dto.response.user.AuthenticationResponse;
import com.javaweb.jobIT.dto.response.user.CheckTokenResponse;
import com.javaweb.jobIT.entity.RoleEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.repository.RoleRepository;
import com.javaweb.jobIT.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository userRepository;
    private final BaseRedisService baseRedisService;
    private final RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public CheckTokenResponse checkValidToken(CheckTokenRequest request) {
        String token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }
        return CheckTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime =(isRefresh) ?
                new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(jwsVerifier);
        if (!verified && expiryTime.before(new Date())) throw new AppException(ErrorCode.UNAUTHENTICATED);

        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        String logoutToken = (String) baseRedisService.get("logoutToken:" + jwtId);
        if (logoutToken != null && logoutToken.equals(token)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    private String buildScope(UserEntity user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        return stringJoiner.toString();
    }

    private String generateToken(UserEntity userEntity) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userEntity.getUsername())
                .issuer("Smiling")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(userEntity))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Generate token failed!",e);
            throw new RuntimeException(e);
        }
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) throws ParseException {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        UserEntity userEntity = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), userEntity.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.USERNAME_OR_PASSWORD_INCORRECT);
        if (userEntity.getStatus().equals("inactive") || !userEntity.getEmailVerified()) throw new AppException(ErrorCode.USER_IS_NOT_ACTIVE);
        String token = generateToken(userEntity);

        SignedJWT signedJWT = SignedJWT.parse(token);
        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        baseRedisService.setForMinutes("token:" + jwtId, token, VALID_DURATION/60);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public void logout(HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                SignedJWT signToken = verifyToken(token, true);

                String jwtId = signToken.getJWTClaimsSet().getJWTID();

                baseRedisService.delete("token:" + jwtId);

                baseRedisService.setForMinutes("logoutToken:" + jwtId, token,VALID_DURATION/60);

                log.info("Token {} đã bị vô hiệu hóa thành công! ", jwtId);
            }
        } catch (ParseException | JOSEException e) {
            log.error("Lỗi khi phân tích hoặc xác minh token: {}", e.getMessage());
        } catch (AppException e) {
            log.warn("Token không hợp lệ hoặc đã hết hạn: {}", e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public AuthenticationResponse refreshToken(HttpServletRequest request) throws ParseException, JOSEException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) throw new AppException(ErrorCode.UNAUTHORIZED);

        String token = header.substring(7);

        SignedJWT signedJWT = verifyToken(token, true);

        String username = signedJWT.getJWTClaimsSet().getSubject();

        UserEntity user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        String tokenRefresh = generateToken(user);

        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        String currentToken = (String) baseRedisService.get("token:" + jwtId);

        if (currentToken != null && currentToken.equals(token)) {
            baseRedisService.setForMinutes("token:" + jwtId, tokenRefresh, VALID_DURATION/60);
        }

        return AuthenticationResponse.builder().token(tokenRefresh).build();
    }

    public AuthenticationResponse googleLogin(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture");
        if (email == null) {
            log.error("Email from Google is null");
            throw new AppException(ErrorCode.INVALID_GOOGLE_EMAIL);
        }
        RoleEntity role = roleRepository.findById(String.valueOf(RoleEnum.CANDIDATE)).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Set<RoleEntity> roles = new HashSet<>();
        roles.add(role);
        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setEmail(email);
                    newUser.setUsername(email.split("@")[0]);
                    newUser.setFullName(name);
                    newUser.setPassword("");
                    newUser.setAvatarUrl(avatarUrl != null ? avatarUrl : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
                    newUser.setRoles(roles);
                    newUser.setStatus("active");
                    newUser.setEmailVerified(true);
                    return userRepository.save(newUser);
                });

        String token = generateToken(user);
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
            baseRedisService.setForMinutes("token:" + jwtId, token, VALID_DURATION/60);
        } catch (ParseException e) {
            log.error("Error parsing JWT: {}", e.getMessage());
            throw new RuntimeException(e);
        }

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }
}
