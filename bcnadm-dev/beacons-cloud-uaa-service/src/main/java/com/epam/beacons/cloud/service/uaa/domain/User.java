package com.epam.beacons.cloud.service.uaa.domain;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * User mongo entity class.
 */
@Document(collection = "users")
public class User implements Serializable {

    @Id
    private String id;

    @Field
    @Indexed(unique = true, direction = IndexDirection.ASCENDING, name = "login_1")
    private String login;
    @Field
    @Indexed(unique = true, direction = IndexDirection.ASCENDING, name = "email_1")
    private String email;
    @Field
    @Indexed(unique = true)
    private String name;
    @Field
    private String locale;
    // Null value is considered valid for the case of user that never logged in.
    @Field
    private LocalDateTime lastEntryDate;
    @Field
    private RoleName role;
    @Field
    private UserStatus status;
    @Field
    private byte[] avatarAsByteArray;
    @Field
    private String mimeType;

    /**
     * Returns login.
     *
     * @return value of login
     */
    public String getLogin() {
        return login;
    }

    /**
     * Sets login value.
     *
     * @param login - value to set
     */
    public void setLogin(String login) {
        this.login = login;
    }

    /**
     * Returns email.
     *
     * @return value of email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets email value.
     *
     * @param email - value to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Returns name.
     *
     * @return value of name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name value.
     *
     * @param name - value to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns lastEntryDate.
     *
     * @return value of lastEntryDate
     */
    public LocalDateTime getLastEntryDate() {
        return lastEntryDate;
    }

    /**
     * Sets lastEntryDate value.
     *
     * @param lastEntryDate - value to set
     */
    public void setLastEntryDate(LocalDateTime lastEntryDate) {
        this.lastEntryDate = lastEntryDate;
    }

    /**
     * Returns roles.
     *
     * @return value of roles
     */
    public RoleName getRole() {
        return role;
    }

    /**
     * Sets roles value.
     *
     * @param role - value to set
     */
    public void setRole(RoleName role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    /**
     * Gets user avatar as byte array.
     *
     * @return byte array of avatar image
     */
    public byte[] getAvatarAsByteArray() {
        return avatarAsByteArray;
    }

    /**
     * Sets user avatar as byte array.
     *
     * @param avatarAsByteArray byte array of avatar images to set
     */
    public void setAvatarAsByteArray(byte[] avatarAsByteArray) {
        this.avatarAsByteArray = avatarAsByteArray;
    }

    /**
     * Returns locale.
     *
     * @return value of locale
     */
    public String getLocale() {
        return locale;
    }

    /**
     * Sets locale value.
     *
     * @param locale - value to set
     */
    public void setLocale(String locale) {
        this.locale = locale;
    }

    /**
     * Gets mime type of user avatar.
     *
     * @return mimeType mime type
     */
    public String getMimeType() {
        return mimeType;
    }

    /**
     * Sets mime type for user avatar.
     *
     * @param mimeType mime type
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    /**
     * Returns id.
     *
     * @return value of id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets id value.
     *
     * @param id - value to set
     */
    public void setId(String id) {
        this.id = id;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        User domainObject = (User) o;
        return Objects.equals(id, domainObject.id);
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }

}
