package com.epam.beacons.cloud.service.building.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.service.BuildingService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import javax.imageio.ImageIO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * This {@code BuildingControllerTest} class tests the {@code BuildingController} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class BuildingControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(BuildingControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String CONTENT_FORMAT = "image/png";
    private static final String BUILDING_PATH = "/api/v1/buildings/";

    private MockMvc mockMvc;
    private byte[] content;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BuildingService buildingService;

    @Autowired
    private LevelService levelService;

    @MockBean
    private UaaRemoteService uaaRemoteService;

    /**
     * Inits context before every test.
     */
    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    /**
     * Prepare data for tests.
     */
    @Before
    public void prepareData() throws IOException {
        BuildingDto buildingDto = new BuildingDto();
        buildingDto.setLatitude(1);
        buildingDto.setLongitude(1);
        buildingDto.setAddress("Test Building Address");
        buildingDto.setHeight(10);
        buildingDto.setWidth(10);
        buildingDto.setName("Test Building Name");
        buildingDto.setWorkingHours("11-12");
        buildingDto.setPhoneNumber("999-666-753");
        buildingDto.setCreatedBy("Test Created By");
        buildingService.save(buildingDto);

        prepareImage();
    }

    public void prepareImage() throws IOException {
        File file = new File("src/test/resources/testImage.png");
        BufferedImage bufferedImage = ImageIO.read(file);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, (CONTENT_FORMAT).split("/")[1], byteArrayOutputStream);
        content = byteArrayOutputStream.toByteArray();
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        buildingService.deleteAll();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<BuildingDto> expectedCollection = buildingService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = BUILDING_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<BuildingDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, BuildingDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<BuildingDto> dtos = buildingService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final BuildingDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = BUILDING_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        BuildingDto result = objectMapper.readValue(contentAsString, BuildingDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        buildingDto.setLatitude(2);
        buildingDto.setLongitude(2);
        buildingDto.setAddress("Post Test Building Address");
        buildingDto.setHeight(20);
        buildingDto.setWidth(20);
        buildingDto.setName("Post Test Building Name");
        buildingDto.setWorkingHours("8:00-21:00");
        buildingDto.setPhoneNumber("88-00-555");
        buildingDto.setCreatedBy("Post Test Created By");

        Mockito.when(uaaRemoteService.getCurrentUserId()).thenReturn("Post Test Created By");

        byte[] content = objectMapper.writeValueAsBytes(buildingDto);

        mockMvc.perform(post(BUILDING_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.latitude").value(buildingDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(buildingDto.getLongitude()))
                .andExpect(jsonPath("$.address").value(buildingDto.getAddress()))
                .andExpect(jsonPath("$.height").value(buildingDto.getHeight()))
                .andExpect(jsonPath("$.width").value(buildingDto.getWidth()))
                .andExpect(jsonPath("$.name").value(buildingDto.getName()))
                .andExpect(jsonPath("$.workingHours").value(buildingDto.getWorkingHours()))
                .andExpect(jsonPath("$.phoneNumber").value(buildingDto.getPhoneNumber()))
                .andExpect(jsonPath("$.createdBy").value(buildingDto.getCreatedBy()));
    }

    @Test
    public void putTest() throws Exception {
        BuildingDto buildingDto = buildingService.findAll().stream().findFirst().get();
        buildingDto.setName("Updated Test Building Name");
        buildingDto.setAddress("Updated Test Building Address");

        byte[] content = objectMapper.writeValueAsBytes(buildingDto);

        mockMvc.perform(put(BUILDING_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(buildingDto.getEntityId()))
                .andExpect(jsonPath("$.latitude").value(buildingDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(buildingDto.getLongitude()))
                .andExpect(jsonPath("$.address").value(buildingDto.getAddress()))
                .andExpect(jsonPath("$.height").value(buildingDto.getHeight()))
                .andExpect(jsonPath("$.width").value(buildingDto.getWidth()))
                .andExpect(jsonPath("$.name").value(buildingDto.getName()))
                .andExpect(jsonPath("$.workingHours").value(buildingDto.getWorkingHours()))
                .andExpect(jsonPath("$.phoneNumber").value(buildingDto.getPhoneNumber()))
                .andExpect(jsonPath("$.createdBy").value(buildingDto.getCreatedBy()));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<BuildingDto> dtos = buildingService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final BuildingDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = BUILDING_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void findAllBuildingsByUserIdTest() throws Exception {
        String userId = String.format("1%023d", 4);

        BuildingDto firstBuildingDto = new BuildingDto();
        firstBuildingDto.setCreatedBy(userId);

        BuildingDto secondBuildingDto = new BuildingDto();
        secondBuildingDto.setCreatedBy(userId);
        secondBuildingDto.setName("Another name");
        secondBuildingDto.setAddress("Another address");

        BuildingDto firstSavedBuildingDto = buildingService.save(firstBuildingDto);
        BuildingDto secondSavedBuildingDto = buildingService.save(secondBuildingDto);

        String urlTemplate = String.format("%sby-user/%s", BUILDING_PATH, userId);
        mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$.length()", is(2)))
                .andExpect(jsonPath("$[0].entityId").value(firstSavedBuildingDto.getEntityId()))
                .andExpect(jsonPath("$[1].entityId").value(secondSavedBuildingDto.getEntityId()));
    }

    @Test
    public void findAllByUserIdIfUserDoesNotHaveAvailableBuildingsTest() throws Exception {
        String urlTemplate = String.format("%sby-user/%s", BUILDING_PATH, String.format("1%023d", 5));
        LOGGER.info("GET URL {}", urlTemplate);

        mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$").isEmpty());
    }

    @Test
    public void getImageTest() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", content);
        buildingService.saveImage(savedBuildingDto.getEntityId(), mockMultipartFile.getBytes());

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType(CONTENT_FORMAT)))
                .andExpect(content().bytes(content));
    }

    @Test
    public void uploadImageTest() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", content);

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile)).andExpect(status().isCreated())
                .andExpect(result -> assertTrue(result.getResponse().containsHeader(HttpHeaders.LOCATION))).andExpect(
                    result -> assertTrue(result.getResponse().getHeader(HttpHeaders.LOCATION).contains(urlTemplate)));
    }

    @Test
    @DisplayName("uploadImage throws IllegalArgumentException if imageAsByteArray isEmpty")
    public void uploadImageThrowsWhenImageByteArrayIsEmpty() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        byte[] emptyImageArray = new byte[0];
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", emptyImageArray);

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile)).andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(BuildingService.IMAGE_IS_EMPTY,
                        result.getResolvedException().getMessage()
                ));
    }

    @Test
    @DisplayName("uploadImage throws IllegalArgumentException if incoming image is not an image")
    public void uploadImageThrowsWhenNotAnImage() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        byte[] fakeImageWithUnsupportedFormat = {10, 11, 12, 13, 14, 15, 16, 17};
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", fakeImageWithUnsupportedFormat);

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile)).andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(BuildingService.UNSUPPORTED_IMAGE_FORMAT,
                        result.getResolvedException().getMessage()
                ));
    }

    @Test
    @DisplayName("uploadImage throws IllegalArgumentException if ImageFormat is not supported")
    public void uploadImageThrowsUnsupportedImageFormat() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        File file = new File("src/test/resources/testBmpImage.bmp");
        BufferedImage bufferedImage = ImageIO.read(file);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "bmp", byteArrayOutputStream);
        byte[] unsupportedFormatImage = byteArrayOutputStream.toByteArray();

        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", unsupportedFormatImage);

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile)).andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(BuildingService.UNSUPPORTED_IMAGE_FORMAT,
                        result.getResolvedException().getMessage()
                ));
    }

    @Test
    public void uploadImageThrowsWhenImageIsOversized() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        BuildingDto savedBuildingDto = buildingService.save(buildingDto);

        byte[] oversizedImageAsByteArray = new byte[BuildingService.IMAGE_BYTES_LIMIT + 1];
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", oversizedImageAsByteArray);

        String urlTemplate = BUILDING_PATH + savedBuildingDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile)).andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(BuildingService.IMAGE_IS_OVERSIZED,
                        result.getResolvedException().getMessage()
                ));
    }


    @Test
    public void getAllTestForLevels() throws Exception {
        BuildingDto buildingDto = new BuildingDto();
        buildingDto = buildingService.save(buildingDto);

        LevelDto levelDto = new LevelDto();
        levelDto.setBuildingId(buildingDto.getEntityId());
        levelDto = levelService.save(levelDto);

        mockMvc.perform(get("/api/v1/buildings/" + buildingDto.getEntityId() + "/levels/")).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].entityId").value(levelDto.getEntityId()))
                .andExpect(jsonPath("$[0].buildingId").value(levelDto.getBuildingId()));
    }
}
