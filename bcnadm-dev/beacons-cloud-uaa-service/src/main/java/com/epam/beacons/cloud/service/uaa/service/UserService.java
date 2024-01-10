package com.epam.beacons.cloud.service.uaa.service;

import com.epam.beacons.cloud.service.uaa.domain.User;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.uaa.repository.UserMongoRepository;
import java.beans.FeatureDescriptor;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.validation.constraints.NotNull;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.Email;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.Resource;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Service for managing user entity.
 */
@Service
@EnableAsync
public class UserService {

    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");
    private static final Logger LOGGER = LogManager.getLogger(UserService.class);
    private static final String ANONYMOUS = "Anonymous";
    private final String telescopeAccountHostUrl;
    private final String telescopeAccountLogin;
    private final String telescopeAccountPassword;
    private final UserMongoRepository mongoRepository;

    @Value("classpath:anonymous.jpg")
    private Resource anonymousAvatarResource;

    private static final String AVATAR_WAS_NOT_FOUND = "Avatar was not found";
    private static final String INVALID_ENTITYID = "Invalid id was provided";
    private static final String UNSUPPORTED_AVATAR_FORMAT = "Format of the original avatar is not supported or invalid";
    private static final String USER_NOT_FOUND = "User wasn't found";
    private static final String MONGO_ENTITY_NOT_FOUND = "Mongo entity wasn't found";
    private static final String OBJECT_DTO_NOT_PROVIDED = "ObjectDTO wasn't provided";
    private static final String ENTITY_ID_NOT_PROVIDED = "EntityId wasn't provided";
    private static final String OBJECT_DTO_ID_CANT_BE_NULL = "ObjectDTO id can't be null";
    private static final String USER_ALREADY_EXISTS = "User with such login or email already exists";
    private static final String LOGIN_NOT_PROVIDED = "Login wasn't provided";
    private static final String STRING_NOT_MATCH_PATTERN = "Provided string doesn't match specified pattern";
    private static final String CAN_NOT_LOAD_EMPLOYEE_PHOTO = "Can't load employee photo";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"
                    + "\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\"
                    + "[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)"
                    + "+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.)"
                    + "{3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\\x01-\\x08\\x0b\\x0c"
                    + "\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])");

    public UserService(UserMongoRepository repository,
                       @Value("${telescope-api.account.host:}") String telescopeAccountHostUrl,
                       @Value("${telescope-api.account.login:}") String telescopeAccountLogin,
                       @Value("${telescope-api.account.password:}") String telescopeAccountPassword) {
        this.mongoRepository = repository;
        this.telescopeAccountHostUrl = telescopeAccountHostUrl;
        this.telescopeAccountLogin = telescopeAccountLogin;
        this.telescopeAccountPassword = telescopeAccountPassword;
    }

    /**
     * Get userDto by login.
     *
     * @param login of user
     * @return object associated with user
     */
    public UserDto getUserDtoByLogin(@NotNull String login) {
        User entity = findByLogin(login);
        return entity != null ? new UserDto(entity) : null;
    }

    /**
     * Retrieves user by login.
     *
     * @param login of user
     * @return object associated with user
     */
    public User findByLogin(@NotNull String login) {
        if (login == null) {
            throw new IllegalArgumentException(LOGIN_NOT_PROVIDED);
        }
        return mongoRepository.findByLogin(login);
    }

    /**
     * Checks if such an email is already assigned to some user.
     *
     * @param email of user
     * @return true if this email is in existence, otherwise - false
     */
    public boolean isUserEmailExists(@NotNull @Email String email) {
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        if (!matcher.matches()) {
            throw new IllegalArgumentException(STRING_NOT_MATCH_PATTERN);
        }
        return mongoRepository.existsByEmail(email);
    }

    /**
     * Checks if such an login is already assigned to some user.
     *
     * @param login of user
     * @return true if this login is in existence, otherwise - false
     */
    public boolean isUserLoginExists(@NotNull String login) {
        return mongoRepository.existsByLogin(login);
    }

    /**
     * Retrieves user by login.
     *
     * @param login of user
     * @return User
     */
    public User getUserByLogin(String login) throws IOException {
        User user = mongoRepository.findByLogin(login);
        if (user == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }

        if (!Objects.isNull(user.getAvatarAsByteArray()) && user.getAvatarAsByteArray().length > 0) {
            return user;
        }

        byte[] anonymousAvatarAsByteArray = getAnonymousUserAvatar();
        if (ANONYMOUS.equals(user.getLogin())) {
            user.setAvatarAsByteArray(anonymousAvatarAsByteArray);
            user.setMimeType(getMimeType(anonymousAvatarAsByteArray));
        } else {
            /*
             * telescopeAvatarAsByteArray is set to null because telescope-api.epam.com should not be called.
             * Caused by ticket 3146
             */
            byte[] telescopeAvatarAsByteArray = null;
            if (!Objects.isNull(telescopeAvatarAsByteArray)) {
                user.setAvatarAsByteArray(telescopeAvatarAsByteArray);
                user.setMimeType(getMimeType(telescopeAvatarAsByteArray));
            } else {
                user.setAvatarAsByteArray(anonymousAvatarAsByteArray);
                user.setMimeType(getMimeType(anonymousAvatarAsByteArray));
            }
        }
        return user;
    }

    private byte[] getAnonymousUserAvatar() throws IOException {
        try (InputStream in = anonymousAvatarResource.getInputStream()) {
            return IOUtils.toByteArray(in);
        }
    }

    private byte[] getEmployeePhotoFromTelescope(String email) {
        if (StringUtils.hasText(telescopeAccountHostUrl) && StringUtils.hasText(telescopeAccountLogin)
                && StringUtils.hasText(telescopeAccountPassword)) {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));

            HttpEntity<byte[]> entity = new HttpEntity<>(headers);
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromUriString(telescopeAccountHostUrl + "/rest/logo/v1/logo")
                    .queryParam("protocol", "attachment")
                    .queryParam("key", "email/" + email);

            RestTemplate restTemplate = new RestTemplateBuilder()
                    .basicAuthentication(telescopeAccountLogin, telescopeAccountPassword).build();
            try {
                ResponseEntity<byte[]> result = restTemplate
                        .exchange(builder.toUriString().toLowerCase(), HttpMethod.GET, entity, byte[].class);
                return result.getBody();
            } catch (HttpClientErrorException e) {
                LOGGER.info(CAN_NOT_LOAD_EMPLOYEE_PHOTO, e);
            }
        }
        return null;
    }

    /**
     * Saves avatar for user.
     *
     * @param login user's login that uses avatar
     * @param avatarAsByteArray avatar for user
     */
    public void saveAvatar(byte[] avatarAsByteArray, String login) throws IOException {
        if (avatarAsByteArray == null || avatarAsByteArray.length <= 0) {
            throw new IllegalArgumentException(AVATAR_WAS_NOT_FOUND);
        }
        User user = mongoRepository.findByLogin(login);

        user.setAvatarAsByteArray(avatarAsByteArray);
        String mimeType = getMimeType(avatarAsByteArray);
        user.setMimeType(mimeType);
        mongoRepository.save(user);
    }

    private String getMimeType(byte[] avatarAsByteArray) throws IOException {
        try (ImageInputStream imageInputStream =
                ImageIO.createImageInputStream(new ByteArrayInputStream(avatarAsByteArray))) {
            Iterator<ImageReader> imageReaders = ImageIO.getImageReaders(imageInputStream);
            String formatName;
            if (imageReaders.hasNext()) {
                ImageReader imageReader = imageReaders.next();
                formatName = imageReader.getFormatName().toLowerCase();
            } else {
                throw new IllegalArgumentException(UNSUPPORTED_AVATAR_FORMAT);
            }

            List<String> possibleFormats = Arrays.asList("jpeg","gif","png");
            if (!possibleFormats.contains(formatName)) {
                throw new IllegalArgumentException(UNSUPPORTED_AVATAR_FORMAT);
            }
            return ("image/" + formatName);
        }
    }

    /**
     * Return current user from session.
     *
     * @return current user from session
     */
    @Nullable
    public String getCurrentUserLogin() {
        Authentication baseAuth = SecurityContextHolder.getContext().getAuthentication();
        if (baseAuth instanceof AnonymousAuthenticationToken) {
            return ANONYMOUS;
        } else if (baseAuth instanceof AbstractAuthenticationToken) {
            AbstractAuthenticationToken authentication = (AbstractAuthenticationToken) baseAuth;
            boolean clientOnly = authentication instanceof OAuth2Authentication
                    && ((OAuth2Authentication) authentication).isClientOnly();
            if (!clientOnly) {
                return authentication.getName();
            }
        }
        return null;
    }

    /**
     * Find DTO by entity id.
     *
     * @param entityId entity id
     * @return found record
     */
    public UserDto findOne(String entityId) {
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException(INVALID_ENTITYID);
        }
        if (!StringUtils.hasText(entityId)) {
            throw new EntityNotFoundException(ENTITY_ID_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new EntityNotFoundException(ENTITY_ID_NOT_PROVIDED);
        }
        final User entity = mongoRepository.findById(entityId).orElse(null);
        UserDto userDto = entity == null ? null : new UserDto(entity);
        if (userDto == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return userDto;
    }

    /**
     * Find all DTOs of given type.
     *
     * @return collection of DTOs
     */
    public Collection<UserDto> findAll() {
        return mongoRepository.findAll().stream().map(UserDto::new).collect(Collectors.toList());
    }

    /**
     * Save entity.
     *
     * @param objectDto entity to save
     * @return saved entity
     */
    public UserDto save(final UserDto objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        final User entityToSave = objectDto.toUser();
        if (entityToSave.getId() != null) {
            User retrievedEntity = mongoRepository.findById(entityToSave.getId()).orElse(null);
            if (retrievedEntity != null) {
                BeanUtils.copyProperties(entityToSave, retrievedEntity, getNullPropertyNames(entityToSave));
                try {
                    return new UserDto(mongoRepository.save(entityToSave));
                } catch (DuplicateKeyException ex) {
                    throw new NonUniqueValueException(USER_ALREADY_EXISTS, ex);
                }
            }
        }
        try {
            return new UserDto(mongoRepository.save(entityToSave));
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(USER_ALREADY_EXISTS, ex);
        }
    }

    /**
     * Update entity.
     *
     * @param objectDto entity to update
     * @return updated entity
     */
    public UserDto update(final UserDto objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        if (objectDto.getEntityId() == null) {
            throw new IllegalArgumentException(OBJECT_DTO_ID_CANT_BE_NULL);
        }
        User retrievedEntity = mongoRepository.findById(objectDto.getEntityId()).orElseThrow(
                () -> new EntityNotFoundException(MONGO_ENTITY_NOT_FOUND));
        final User entity = objectDto.toUser();
        BeanUtils.copyProperties(entity, retrievedEntity, getNullPropertyNames(entity));
        try {
            return new UserDto(mongoRepository.save(retrievedEntity));
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(USER_ALREADY_EXISTS, ex);
        }
    }

    /**
     * Delete entity.
     *
     * @param objectDto entity to delete
     */
    public void delete(final UserDto objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        final User entity = mongoRepository.findById(objectDto.getEntityId()).orElse(null);
        if (entity == null) {
            throw new EntityNotFoundException(MONGO_ENTITY_NOT_FOUND);
        }
        mongoRepository.delete(entity);
    }

    /**
     * Delete all entities.
     */
    public void deleteAll() {
        mongoRepository.deleteAll();
    }

    private String[] getNullPropertyNames(Object entity) {
        final BeanWrapper wrappedSource = new BeanWrapperImpl(entity);
        return Stream.of(wrappedSource.getPropertyDescriptors()).map(FeatureDescriptor::getName)
                .filter(propertyName -> wrappedSource.getPropertyValue(propertyName) == null).toArray(String[]::new);
    }

}
