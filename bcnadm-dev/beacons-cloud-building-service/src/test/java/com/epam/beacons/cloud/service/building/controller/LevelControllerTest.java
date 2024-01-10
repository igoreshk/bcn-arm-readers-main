package com.epam.beacons.cloud.service.building.controller;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertThrows;
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
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
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
import java.util.Collections;
import javax.imageio.ImageIO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
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
 * Test for LevelController.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class LevelControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(LevelControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String IMAGE_FORMAT = "image/png";
    private static final String IMAGE_UNSUPPORTED_FORMAT = "image/bmp";
    private static final String LEVEL_PATH = "/api/v1/levels/";

    private MockMvc mockMvc;
    private byte[] imageAsByteArray;
    private byte[] imageAsByteArrayWithUnsupportedFormat;
    private LevelDto levelDto;
    private BuildingDto buildingDto;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LevelService levelService;

    @Autowired
    private BuildingService buildingService;

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
        buildingDto = new BuildingDto();
        buildingDto.setAddress("Test Building Address");
        buildingDto.setLatitude(1);
        buildingDto.setLongitude(2);
        buildingDto.setWidth(10.0);
        buildingDto.setHeight(20.0);
        buildingDto.setName("Test Building Name");
        buildingDto.setPhoneNumber("+7-123-456-7890");
        buildingDto.setWorkingHours("8-22");
        buildingDto.setCreatedBy("Test Created By");
        buildingDto = buildingService.save(buildingDto);

        levelDto = new LevelDto();
        levelDto.setNumber(1);
        levelDto.setBuildingId(buildingDto.getEntityId());
        levelDto.setSouthWestLatitude(1);
        levelDto.setSouthWestLongitude(2);
        levelDto.setNorthEastLatitude(3);
        levelDto.setNorthEastLongitude(4);
        levelDto.setScaleStartLatitude(5);
        levelDto.setScaleStartLongitude(6);
        levelDto.setScaleEndLatitude(7);
        levelDto.setScaleEndLongitude(8);
        levelDto.setScaleDistance(15);
        levelDto = levelService.save(levelDto);

        prepareImages();
    }

    public void prepareImages() throws IOException {
        File image = new File("src/test/resources/image.png");
        BufferedImage bufferedImage = ImageIO.read(image);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, IMAGE_FORMAT.split("/")[1], byteArrayOutputStream);
        imageAsByteArray = byteArrayOutputStream.toByteArray();
        levelService.saveImage(levelDto.getEntityId(), imageAsByteArray);

        File imageWithUnsupportedFormat = new File("src/test/resources/imageWithUnsupportedFormat.bmp");
        BufferedImage bufferedImageWithUnsupportedFormat = ImageIO.read(imageWithUnsupportedFormat);
        ByteArrayOutputStream byteArrayOutputStream2 = new ByteArrayOutputStream();
        ImageIO.write(bufferedImageWithUnsupportedFormat, IMAGE_UNSUPPORTED_FORMAT.split("/")[1],
                byteArrayOutputStream2);
        imageAsByteArrayWithUnsupportedFormat = byteArrayOutputStream2.toByteArray();
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        levelService.deleteAll();
        buildingService.deleteAll();
    }


    @Test
    public void getAllTest() throws Exception {
        final Collection<LevelDto> expectedCollection = levelService.findAll();
        Assert.assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = LEVEL_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<LevelDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, LevelDto.class)
        );

        Assert.assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<LevelDto> dtos = levelService.findAll();
        Assert.assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final LevelDto expected = dtos.iterator().next();
        Assert.assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = LEVEL_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        LevelDto result = objectMapper.readValue(contentAsString, LevelDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        LevelDto levelDto = new LevelDto();
        levelDto.setNumber(2);
        levelDto.setBuildingId(String.format("1%023d", 2));
        levelDto.setSouthWestLatitude(5);
        levelDto.setSouthWestLongitude(6);
        levelDto.setNorthEastLatitude(7);
        levelDto.setNorthEastLongitude(8);
        levelDto.setScaleStartLatitude(5);
        levelDto.setScaleStartLongitude(6);
        levelDto.setScaleEndLatitude(7);
        levelDto.setScaleEndLongitude(8);
        levelDto.setScaleDistance(15);

        byte[] content = objectMapper.writeValueAsBytes(levelDto);

        mockMvc.perform(post(LEVEL_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.buildingId").value(levelDto.getBuildingId()))
                .andExpect(jsonPath("$.number").value(levelDto.getNumber()))
                .andExpect(jsonPath("$.northEastLatitude").value(levelDto.getNorthEastLatitude()))
                .andExpect(jsonPath("$.northEastLongitude").value(levelDto.getNorthEastLongitude()))
                .andExpect(jsonPath("$.southWestLatitude").value(levelDto.getSouthWestLatitude()))
                .andExpect(jsonPath("$.southWestLongitude").value(levelDto.getSouthWestLongitude()))
                .andExpect(jsonPath("$.scaleStartLatitude").value(levelDto.getScaleStartLatitude()))
                .andExpect(jsonPath("$.scaleStartLongitude").value(levelDto.getScaleStartLongitude()))
                .andExpect(jsonPath("$.scaleEndLatitude").value(levelDto.getScaleEndLatitude()))
                .andExpect(jsonPath("$.scaleEndLongitude").value(levelDto.getScaleEndLongitude()))
                .andExpect(jsonPath("$.scaleDistance").value(levelDto.getScaleDistance()));
    }

    @Test
    public void putTest() throws Exception {
        final int originalNumber = levelDto.getNumber();
        final int updatedNumber = 666;
        final double originalNorthEastLatitude = levelDto.getNorthEastLatitude();
        final double originalNorthEastLongitude = levelDto.getNorthEastLongitude();
        final double originalScaleStartLatitude = levelDto.getScaleStartLatitude();
        final double originalScaleStartLongitude = levelDto.getScaleStartLongitude();
        final double updatedNorthEastLatitude = 99;
        final double updatedNorthEastLongitude = 88;
        final double updatedScaleStartLatitude = 77;
        final double updatedScaleStartLongitude = 66;

        levelDto.setNumber(updatedNumber);
        levelDto.setNorthEastLatitude(updatedNorthEastLatitude);
        levelDto.setNorthEastLongitude(updatedNorthEastLongitude);
        levelDto.setScaleStartLatitude(updatedScaleStartLatitude);
        levelDto.setScaleStartLongitude(updatedScaleStartLongitude);

        assertNotEquals(originalNumber, levelDto.getNumber());
        assertNotEquals(originalNorthEastLatitude, levelDto.getNorthEastLatitude());
        assertNotEquals(originalNorthEastLongitude, levelDto.getNorthEastLongitude());
        assertNotEquals(originalScaleStartLatitude, levelDto.getScaleStartLatitude());
        assertNotEquals(originalScaleStartLongitude, levelDto.getScaleStartLongitude());

        byte[] content = objectMapper.writeValueAsBytes(levelDto);

        mockMvc.perform(put(LEVEL_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(levelDto.getEntityId()))
                .andExpect(jsonPath("$.buildingId").value(levelDto.getBuildingId()))
                .andExpect(jsonPath("$.number").value(updatedNumber))
                .andExpect(jsonPath("$.northEastLatitude").value(updatedNorthEastLatitude))
                .andExpect(jsonPath("$.northEastLongitude").value(updatedNorthEastLongitude))
                .andExpect(jsonPath("$.southWestLatitude").value(levelDto.getSouthWestLatitude()))
                .andExpect(jsonPath("$.southWestLongitude").value(levelDto.getSouthWestLongitude()))
                .andExpect(jsonPath("$.scaleStartLatitude").value(updatedScaleStartLatitude))
                .andExpect(jsonPath("$.scaleStartLongitude").value(updatedScaleStartLongitude))
                .andExpect(jsonPath("$.scaleEndLatitude").value(levelDto.getScaleEndLatitude()))
                .andExpect(jsonPath("$.scaleEndLongitude").value(levelDto.getScaleEndLongitude()))
                .andExpect(jsonPath("$.scaleDistance").value(levelDto.getScaleDistance()));
    }

    @Test
    public void deleteTest() throws Exception {
        String entityId = levelDto.getEntityId();

        assertNotNull(levelService.getLevel(entityId));

        String urlTemplate = LEVEL_PATH + entityId;
        mockMvc.perform(delete(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value("true"));

        assertThrows(EntityNotFoundException.class, () -> levelService.getLevel(entityId));
    }

    @Test
    public void getImageTest() throws Exception {
        String urlTemplate = LEVEL_PATH + levelDto.getEntityId() + "/image";
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType(IMAGE_FORMAT)))
                .andExpect(content().bytes(imageAsByteArray));
    }

    @Test
    public void uploadImageTest() throws Exception {
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", imageAsByteArray);

        String urlTemplate = LEVEL_PATH + levelDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isCreated())
                .andExpect(result -> assertTrue(result.getResponse().containsHeader(HttpHeaders.LOCATION)))
                .andExpect(result ->
                        assertTrue(result.getResponse().getHeader(HttpHeaders.LOCATION).contains(urlTemplate)));
    }

    @Test
    public void getImageThrowsEntityNotFoundExceptionIfImageAsByteArrayIsEmpty() throws Exception {
        LevelDto levelDto = new LevelDto();
        LevelDto levelWithoutImageDto = levelService.save(levelDto);

        String urlTemplate = LEVEL_PATH + levelWithoutImageDto.getEntityId() + "/image";
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof EntityNotFoundException))
                .andExpect(result -> assertEquals(LevelService.IMAGE_WAS_NOT_FOUND,
                        result.getResolvedException().getMessage()
                ));
    }

    @Test
    public void uploadImageThrowsIllegalArgumentExceptionIfImageAsByteArrayIsEmpty() throws Exception {
        byte[] emptyImageArray = new byte[0];
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", emptyImageArray);

        String urlTemplate = LEVEL_PATH + levelDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(LevelService.IMAGE_WAS_NOT_FOUND,
                        result.getResolvedException().getMessage()
                ));
    }

    @Test
    public void uploadImageThrowsIllegalArgumentExceptionIfImageFormatIsNotSupported() throws Exception {
        MockMultipartFile mockMultipartFile =
                new MockMultipartFile("image", imageAsByteArrayWithUnsupportedFormat);

        String urlTemplate = LEVEL_PATH + levelDto.getEntityId() + "/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(LevelService.UNSUPPORTED_IMAGE_FORMAT,
                        result.getResolvedException().getMessage()));
    }
}
