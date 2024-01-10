package com.epam.beacons.cloud.service.mobile.controller;

import com.epam.beacons.cloud.service.mobile.domain.MobileDto;
import com.epam.beacons.cloud.service.mobile.service.MobileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api("Mobile Controller")
@RequestMapping("/api/v1/mobile")
public class MobileController {

    private final MobileService mobileService;
    private static final String DATA_UPDATES = "Receive data updates from Android application";
    private static final String DATA_WAS_NOT_PROVIDED = "Data wasn't provided";
    private static final String LEVEL_VISITOR_NOT_FOUND = "Level and/or visitor was not found for provided id";

    public MobileController(MobileService mobileService) {
        this.mobileService = mobileService;
    }

    /**
     * Receives data updates from Android application.
     *
     * @param mobileDto - data from mobile client
     */
    @PostMapping("/history/visitors")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @ApiOperation(value = DATA_UPDATES, code = 202)
    @ApiResponses({
            @ApiResponse(code = 400, message = DATA_WAS_NOT_PROVIDED),
            @ApiResponse(code = 404, message = LEVEL_VISITOR_NOT_FOUND)
    })
    public void acceptMobileData(@RequestBody @Valid @NotNull MobileDto mobileDto) {
        mobileService.sendMessage(mobileDto);
    }
}
