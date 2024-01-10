package com.epam.beacons.cloud.monitor.service.domain;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Visitor domain class.
 */
@Document(collection = "visitor")
public class Visitor extends DomainObject {

    @Field
    @Indexed(unique = true)
    private String name;
    @Field
    @Indexed(unique = true)
    private String deviceId;
    @Field
    private DeviceType type;

    /**
     * Returns name.
     *
     * @return name value
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name - value to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns device id.
     *
     * @return deviceId value
     */
    public String getDeviceId() {
        return deviceId;
    }

    /**
     * Sets device id.
     *
     * @param deviceId - value to set
     */
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    /**
     * Returns device type.
     *
     * @return type value
     */
    public DeviceType getType() {
        return type;
    }

    /**
     * Sets device type.
     *
     * @param type - value to set
     */
    public void setType(DeviceType type) {
        this.type = type;
    }
}
