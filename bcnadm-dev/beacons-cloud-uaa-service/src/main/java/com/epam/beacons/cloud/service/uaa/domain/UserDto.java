package com.epam.beacons.cloud.service.uaa.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for user entity.
 */
public class UserDto {

    private static final String EMAIL_REGEX =
            "(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"
                    + "\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\"
                    + "[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)"
                    + "+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.)"
                    + "{3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\\x01-\\x08\\x0b\\x0c"
                    + "\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
    private static final String USER_NAME_REGEX = "^[\\w+-]{2,55}$";
    private static final String DEFAULT_LOCALE = "en";
    public static final String ISO_8601 = "yyyy-MM-dd HH:mm:ss";

    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "entityId should match regex [a-fA-F\\d]{24}")
    private String entityId;
    private String login;

    @NotNull(message = "name can't be undefined")
    @Pattern(regexp = USER_NAME_REGEX, message = "Name can't be less than 2 or more than 55 letters")
    private String name;

    @NotNull
    @Pattern(regexp = EMAIL_REGEX, message = "email is not correct")
    private String email;

    /**
     * Alias for language.
     */
    private String locale = DEFAULT_LOCALE;

    /**
     * The number of seconds since the epoch of 1970-01-01T00:00:00Z until last session-start time of this user. Null
     * value is considered valid for the case of user that never logged in.
     */
    @JsonFormat(pattern = ISO_8601)
    private LocalDateTime lastEntry;

    private RoleName role;

    private UserStatus status;

    public UserDto() {
    }

    public UserDto(User user) {
        entityId = user.getId();
        login = user.getLogin();
        name = user.getName();
        email = user.getEmail();
        lastEntry = user.getLastEntryDate();
        locale = user.getLocale();
        role = user.getRole();
        status = user.getStatus();
    }

    public User toUser() {
        User user = new User();
        user.setId(entityId);
        user.setLogin(login);
        user.setEmail(email);
        user.setName(name);
        user.setLocale(locale);
        user.setLastEntryDate(lastEntry);
        user.setRole(role);
        user.setStatus(status);
        return user;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getLastEntry() {
        return lastEntry;
    }

    public void setLastEntry(LocalDateTime lastEntry) {
        this.lastEntry = lastEntry;
    }

    public RoleName getRole() {
        return role;
    }

    public void setRole(RoleName role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    /**
     * Returns entityId.
     *
     * @return value of entityId
     */
    public String getEntityId() {
        return entityId;
    }

    /**
     * Sets entityId value.
     *
     * @param entityId - value to set
     */
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    /**
     * Checks that current object equal to some object.
     *
     * @param o object to check
     * @return true if equals, false if not
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserDto dtoObject = (UserDto) o;
        return Objects.equals(entityId, dtoObject.entityId);
    }

    /**
     * Returns hash code.
     *
     * @return hash code
     */
    @Override
    public int hashCode() {
        return Objects.hash(entityId);
    }

}
