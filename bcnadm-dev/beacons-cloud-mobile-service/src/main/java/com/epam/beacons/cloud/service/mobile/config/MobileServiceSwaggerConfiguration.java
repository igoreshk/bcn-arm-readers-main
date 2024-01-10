package com.epam.beacons.cloud.service.mobile.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
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

@Configuration
@EnableSwagger2
@Import(BeanValidatorPluginsConfiguration.class)
public class MobileServiceSwaggerConfiguration {

    private static final String BASE_PACKAGE = "com.epam.beacons.cloud.service.mobile";

    private static final String TITLE = "Mobile Service REST API";

    private static final String MAIN_DESCRIPTION = "Mobile service is a microservice that receives data "
            + "from mobile clients, processes it, and sends it to other microservices via Kafka.\n";

    @Bean
    public Docket swaggerConfiguration(@Value("${swagger.host}") String host) {
        return new Docket(DocumentationType.SWAGGER_2)
                .host(host)
                .select()
                .paths(PathSelectors.regex("/api/v1/.*"))
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
    public WebMvcConfigurer corsConfig(@Value("${swagger.cors.allowedOrigins:*}") String[] allowedOrigins) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    public UiConfiguration uiConfig() {
        return UiConfigurationBuilder.builder()
                .displayRequestDuration(true)
                .validatorUrl("")
                .build();
    }
}
