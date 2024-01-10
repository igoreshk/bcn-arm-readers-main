package com.epam.beacons.cloud.service.uaa.controller;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.User;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.domain.UserStatus;
import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * UserController.
 */
@RestController
@RequestMapping(value = "/api/v1/users", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "User Controller")
public class UserController {

    private static final String USER_NOT_FOUND = "User wasn't found";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users.
     *
     * @return all users
     */
    @GetMapping
    @ApiOperation("Returns all users")
    public Collection<UserDto> findAll() {
        return userService.findAll();
    }

    /**
     * Add user.
     *
     * @param userDto userDto
     * @return added user
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation("Adds user")
    @ApiResponses({
            @ApiResponse(code = 400, message = "ObjectDTO wasn't provided"),
            @ApiResponse(code = 201, message = "OK")
    })
    public UserDto save(@RequestBody @Valid UserDto userDto) {
        return userService.save(userDto);
    }

    /**
     * Update user.
     *
     * @param userDto userDto
     * @return updated user
     */
    @PutMapping
    @ApiOperation("Updates user")
    @ApiResponses({
            @ApiResponse(code = 400, message = "ObjectDTO wasn't provided")
    })
    public UserDto update(@RequestBody @Valid UserDto userDto) {
        return userService.update(userDto);
    }

    /**
     * Get user by id.
     *
     * @param entityId id
     * @return user
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns user by user id")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Invalid id was provided"),
            @ApiResponse(code = 404, message = "User wasn't found")
    })
    public UserDto findOne(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        return userService.findOne(entityId);
    }

    /**
     * Get user by login.
     *
     * @param login login
     * @return user
     */
    @GetMapping("/by-login/{login:.+}")
    @ApiOperation("Returns user by user login")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Login can't be null"),
            @ApiResponse(code = 404, message = USER_NOT_FOUND)
    })
    public UserDto getUser(@PathVariable("login") String login) {
        return Optional.ofNullable(userService.getUserDtoByLogin(login))
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
    }

    /**
     * Get user status by login.
     *
     * @param login login
     * @return user status
     */
    @GetMapping("/inactive/{login:.+}")
    @ApiOperation("Returns user status by user login")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Login can't be null")
    })
    public boolean isInactive(@PathVariable("login") String login) {
        UserDto userDto = userService.getUserDtoByLogin(login);
        if (userDto != null) {
            return UserStatus.INACTIVE == userDto.getStatus();
        }
        return true;
    }

    /**
     * Delete user.
     *
     * @param entityId id
     * @return ResponseEntity with deletion result (true if successful).
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes user by user id")
    @ApiResponses({
            @ApiResponse(code = 400, message = "User id wasn't provided"),
            @ApiResponse(code = 400, message = "Invalid id was provided"),
            @ApiResponse(code = 404, message = "User wasn't found!")
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        UserDto userDto = userService.findOne(entityId);
        userService.delete(userDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Get current user.
     *
     * @return current user
     */
    @GetMapping("/current")
    @ApiOperation("Returns current user")
    public UserDto getCurrentUser() {
        return Optional.ofNullable(userService.getCurrentUserLogin())
                .map(userService::getUserDtoByLogin).orElse(null);
    }

    /**
     * Get current user ID.
     *
     * @return current user ID
     */
    @GetMapping("/currentId")
    @ApiOperation("Returns current user ID")
    public String getCurrentUserId() {
        return Optional.ofNullable(userService.getCurrentUserLogin())
                .map(userService::getUserDtoByLogin).map(UserDto::getEntityId).orElse(null);
    }

    /**
     * Get current user's avatar.
     *
     * @return avatar
     */
    @GetMapping("/current/image")
    @ApiOperation("Returns current user's avatar")
    @ApiResponses({
            @ApiResponse(code = 400, message = "User wasn't found")
    })
    public ResponseEntity<byte[]> getCurrentAvatar() throws IOException {
        String currentUserLogin = userService.getCurrentUserLogin();

        User user = userService.getUserByLogin(currentUserLogin);
        byte[] avatarAsByteArray = user.getAvatarAsByteArray();
        String mimeType = user.getMimeType();

        return ResponseEntity.status(HttpStatus.OK).contentLength(avatarAsByteArray.length)
                .contentType(MediaType.parseMediaType(mimeType)).body(avatarAsByteArray);
    }

    /**
     * Upload user's avatar.
     *
     * @param image avatar for user
     * @return response entity
     */
    @PostMapping("/current/image")
    @ApiOperation("Uploads user's avatar")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Login of user can't be null!"),
            @ApiResponse(code = 201, message = "Created")
    })
    public ResponseEntity<Void> uploadAvatar(@RequestParam(value = "image") MultipartFile image) throws IOException {
        String currentUserLogin = userService.getCurrentUserLogin();
        if (currentUserLogin == null) {
            throw new EntityNotFoundException("Login of user can't be null!");
        }
        byte[] avatarAsByteArray = image.getBytes();
        userService.saveAvatar(avatarAsByteArray, currentUserLogin);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(location).build();
    }

    /**
     * Returns true, if specified email exists - otherwise false.
     *
     * @param email email to check
     * @return true, if email already exists, otherwise - false
     */
    @GetMapping("/check-email/{email:.+}")
    @ApiOperation("Checks if email exists")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Provided string doesn't match specified pattern")
    })
    public boolean isEmailExists(@PathVariable("email") @NotNull String email) {
        return userService.isUserEmailExists(email);
    }

    /**
     * Checks provided login.
     *
     * @param login login to check
     * @return true, if login already exists, otherwise - false
     */
    @GetMapping("/check-login/{login:.+}")
    @ApiOperation("Checks if login exists")
    public boolean isLoginExists(@PathVariable("login") @NotNull String login) {
        return userService.isUserLoginExists(login);
    }

    /**
     * Get list of possible user roles.
     *
     * @return list of roles
     */
    @GetMapping("roles")
    @ApiOperation("Returns list of possible roles")
    public List<RoleName> getRoles() {
        return Arrays.asList(RoleName.values());
    }
}
