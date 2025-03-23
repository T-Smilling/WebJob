package com.javaweb.jobIT.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("api-service for web jobId") // /v3/api-docs/api-service
                .packagesToScan("com.javaweb.jobIT.controller")
                .build();
    }

    @Bean
    public OpenAPI springShopOpenAPI(){
        return new OpenAPI().info(new Info().title("Web Job IT")
                .description("Backend APIs for Web Job IT")
                .version("1.0.0")
                .contact(new Contact().name("Chu Ngọc Thắng").email("chuthanglsz@gmail.com"))
                .license(new License().name("License").url("/")))
                .externalDocs(new ExternalDocumentation().description("Web Job IT")
                        .url("http://localhost:8080/swagger-ui.html"))
                .components(
                        new Components()
                                .addSecuritySchemes("bearerAuth",
                                        new SecurityScheme()
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")))
                .security(List.of(new SecurityRequirement().addList("bearerAuth")));
    }
}
