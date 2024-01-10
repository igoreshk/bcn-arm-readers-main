package com.epam.beacons.cloud.service.uaa.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.UiConfiguration;
import springfox.documentation.swagger.web.UiConfigurationBuilder;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Swagger configuration for uaa-service.
 */
@EnableSwagger2
@Configuration
@Import(BeanValidatorPluginsConfiguration.class)
public class UaaServiceSwaggerConfiguration {

    private static final String BASE_PACKAGE = "com.epam.beacons.cloud.service.uaa";

    private static final String TITLE = "UAA Service REST API";

    private static final String MAIN_DESCRIPTION = "This service is a user authorization/resource service, "
            + "is used for user persistence and it's also used to set/get user role info.";

    @Bean
    public Docket swaggerConfiguration(@Value("${swagger.host}") String host) {
        return new Docket(DocumentationType.SWAGGER_2)
                .host(host)
                .select()
                .paths(PathSelectors.regex("/api/v1/users.*"))
                .apis(RequestHandlerSelectors.basePackage(BASE_PACKAGE))
                .build()
                .apiInfo(apiDetails());
    }

    private ApiInfo apiDetails() {
        return new ApiInfoBuilder()
                .title(TITLE)
                .description(MAIN_DESCRIPTION)
                .build();
    }

    @Bean
    public UiConfiguration uiConfig() {
        return UiConfigurationBuilder.builder()
                .displayRequestDuration(true)
                .validatorUrl("")
                .build();
    }
}
