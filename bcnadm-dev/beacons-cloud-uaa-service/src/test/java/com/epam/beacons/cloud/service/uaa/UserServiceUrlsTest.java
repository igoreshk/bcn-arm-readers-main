package com.epam.beacons.cloud.service.uaa;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test for User Service URLs in feign clients and controllers.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@ActiveProfiles({"LOCAL", "PRE-PROD"})
public class UserServiceUrlsTest {

    private static final String CURLY_BRACES_REGEX = "\\{([^}]*)}";
    private static final String UUID_REGEXP = "[a-zA-Z0-9]{24}";
    private static final String EMAIL_REGEX = ".+";
    private static final String IMAGE_SIZE_REGEXP = "[0-9]+[x][0-9]+";
    private static final Logger LOGGER = LogManager.getLogger(UserServiceUrlsTest.class);
    private static final String[] REGEX_LIST = {UUID_REGEXP, EMAIL_REGEX, IMAGE_SIZE_REGEXP};
    private final List<Class<? extends Annotation>> seekingClassAnnotations = Arrays.asList(
            FeignClient.class, RequestMapping.class);
    private final List<Class<? extends Annotation>> seekingMethodAnnotations = Arrays.asList(RequestMapping.class,
            GetMapping.class, PostMapping.class, DeleteMapping.class, PutMapping.class, PatchMapping.class
    );
    private final List<Class<? extends Annotation>> seekingParamAnnotation = Collections.singletonList(
            PathVariable.class);
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    /**
     * Constructor with exception.
     *
     * @throws IllegalAccessException during getControllerRegexList.
     */
    public UserServiceUrlsTest() throws IllegalAccessException {
    }

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void urlsTest() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {

        Map<String, Object> beansMap = getBeansMapWithNeededAnnotation();
        List<Class<?>> classes = getClassesFromBeans(beansMap);
        for (Class<?> clazz : classes) {
            checkUrls(clazz);
        }
    }

    private Map<String, Object> getBeansMapWithNeededAnnotation() {
        Map<String, Object> beansMap = new HashMap<>();
        for (Class<? extends Annotation> annotation : seekingClassAnnotations) {
            beansMap.putAll(webApplicationContext.getBeansWithAnnotation(annotation));
        }
        return beansMap;
    }

    private List<Class<?>> getClassesFromBeans(Map<String, Object> beansMap) {
        List<Class<?>> classes = new ArrayList<>();
        for (Object object : beansMap.values()) {
            classes.addAll(getRealClass(object));
        }
        return classes;
    }

    private List<Class<?>> getRealClass(Object object) {
        if (object.getClass().toString().contains("com.sun.proxy")) {
            return Arrays.asList(object.getClass().getInterfaces());
        }
        return Collections.singletonList(object.getClass());
    }

    private void checkUrls(Class clazz)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {

        // Class{} + method{} = parameter
        List<String> parameterPathVariablesList = new ArrayList<>();
        List<String> classPathVariablesList = findClassPathVariables(clazz);
        List<String> methodPathVariablesList = findMethodPathVariables(clazz, parameterPathVariablesList);

        methodPathVariablesList.addAll(classPathVariablesList);

        Assert.assertTrue(clazz + "\nparameters path variables: \n" + parameterPathVariablesList
                        + "\nmethod, class path variables: \n" + methodPathVariablesList,
                methodPathVariablesList.containsAll(parameterPathVariablesList)
        );
    }

    private List<String> findClassPathVariables(Class clazz)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {

        List<String> classPathVariablesList = new ArrayList<>();
        for (Annotation classAnnotation : clazz.getAnnotations()) {
            if (seekingClassAnnotations.contains(classAnnotation.annotationType())) {
                if (RequestMapping.class.equals(classAnnotation.annotationType())) {
                    String[] paths = (String[]) classAnnotation.getClass().getMethod("value").invoke(classAnnotation);
                    for (String path : paths) {
                        classPathVariablesList.addAll(findPathVariables(path));
                    }
                } else if (FeignClient.class.equals(classAnnotation.annotationType())) {
                    classPathVariablesList.addAll(findPathVariables(
                            (String) classAnnotation.getClass().getMethod("value").invoke(classAnnotation)));
                } else {
                    throw new IllegalStateException("Unknown annotation " + classAnnotation);
                }
            }
        }
        return classPathVariablesList;
    }

    private List<String> findMethodPathVariables(Class clazz, List<String> parameterPathVariablesList)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {

        List<String> methodPathVariablesList = new ArrayList<>();
        for (Method method : clazz.getMethods()) {
            for (Annotation methodAnnotation : method.getAnnotations()) {
                if (seekingMethodAnnotations.contains(methodAnnotation.annotationType())) {
                    String[] values = (String[]) methodAnnotation.getClass().getMethod("value")
                            .invoke(methodAnnotation);
                    for (String s : values) {
                        methodPathVariablesList.addAll(findPathVariables(s));
                    }
                    findParameterPathVariables(method, parameterPathVariablesList);
                }
            }
        }
        return methodPathVariablesList;
    }

    private void findParameterPathVariables(Method method, List<String> parameterPathVariablesList)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {

        for (Parameter parameter : method.getParameters()) {
            for (Annotation annotation : parameter.getAnnotations()) {
                if (seekingParamAnnotation.contains(annotation.annotationType())) {
                    parameterPathVariablesList.add(
                            (String) annotation.getClass().getMethod("value").invoke(annotation));
                }
            }
        }
    }

    private List<String> findPathVariables(String mapping) {
        mapping = deleteRegex(mapping);
        List<String> pathVariablesList = new ArrayList<>();
        Pattern pattern = Pattern.compile(CURLY_BRACES_REGEX);
        Matcher matcher = pattern.matcher(mapping);
        while (matcher.find()) {
            pathVariablesList.add(matcher.group(1));
        }
        return pathVariablesList;
    }

    private String deleteRegex(String mapping) {
        for (String regex : REGEX_LIST) {
            int index;
            while ((index = mapping.indexOf(regex)) != -1) {
                mapping = mapping.substring(0, index - 1) + mapping.substring(index + regex.length());
            }
        }
        return mapping;
    }
}
