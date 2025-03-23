package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.company.CompanyRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.company.CompanyResponse;
import com.javaweb.jobIT.dto.response.company.PageCompany;
import com.javaweb.jobIT.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(value = "/company")
@Slf4j
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @PostMapping
    ApiResponse<CompanyResponse> createCompany(@ModelAttribute @Valid CompanyRequest companyRequest) throws IOException {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.createCompany(companyRequest))
                .message("Create company successful")
                .build();
    }

    @GetMapping
    ApiResponse<PageCompany> getAllCompany(@RequestParam(defaultValue = "0", required = false) int page,
                                           @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageCompany>builder()
                .result(companyService.getAllCompany(page, size))
                .message("Get all company successful")
                .build();
    }

    @GetMapping("/{companyId}")
    ApiResponse<CompanyResponse> getCompany(@PathVariable Long companyId,
                                            @RequestParam(defaultValue = "0", required = false) int page,
                                            @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.getCompanyById(companyId,page,size))
                .message("Get company by id: " + companyId + " successful")
                .build();
    }

    @PutMapping("/{companyId}")
    ApiResponse<CompanyResponse> updateCompany(@PathVariable Long companyId,@ModelAttribute @Valid CompanyRequest companyRequest) throws IOException {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.updateInfoCompany(companyId, companyRequest))
                .message("Update company successful")
                .build();
    }

    @DeleteMapping("/{companyId}")
    ApiResponse<String> deleteCompany(@PathVariable Long companyId) {
        return ApiResponse.<String>builder()
                .result(companyService.deleteCompanyById(companyId))
                .build();
    }
}
