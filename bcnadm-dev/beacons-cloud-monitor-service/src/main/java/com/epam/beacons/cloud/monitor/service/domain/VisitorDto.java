package com.epam.beacons.cloud.monitor.service.domain;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * Dto for Visitor entity.
 */
public class VisitorDto extends DtoObject {

    @NotNull
    private String name;

    @Pattern(regexp = "[a-zA-Z0-9\\s]{0,200}$", message = "deviceId should match regex [a-zA-Z0-9\\s]{0,200}$")
    @NotBlank
    private String deviceId;

    @NotNull
    private DeviceType type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public DeviceType getType() {
        return type;
    }

    public void setType(DeviceType type) {
        this.type = type;
    }
}
