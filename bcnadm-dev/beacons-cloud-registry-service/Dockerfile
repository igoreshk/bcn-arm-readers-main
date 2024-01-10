FROM ecse00500096.epam.com:5000/openjdk8
MAINTAINER EPM-LSTR-BCN
RUN mkdir -p /usr/beacon/logs/
COPY beacons-cloud-registry-service/dist/beacons-cloud-registry-service.jar /usr/beacon/

ARG CI_COMMIT_REF_NAME="ci_COMMIT_REF_NAMEr"
ARG CI_COMMIT_SHORT_SHA="ci_COMMIT_SHORT_SHAr"
ENV CI_COMMIT_REF_NAME1=${CI_COMMIT_REF_NAME}
ENV CI_COMMIT_SHORT_SHA1=${CI_COMMIT_SHORT_SHA}
ENV profile=${profile}
ARG V_TOKEN="replace-me"
ENV V_TOKEN1=${V_TOKEN}
ENV port=${port}
ENV reg_port=${reg_port}
ENV loglevel=${loglevel}

# RUN apt install -y  --no-cache openssl
WORKDIR /usr/beacon/
COPY bcn-registry.crt.pem /usr/beacon/
RUN touch logfile.log
RUN echo $CI_COMMIT_REF_NAME1 >> logfile.log
RUN echo $CI_COMMIT_SHORT_SHA1 >> logfile.log
EXPOSE 10005
EXPOSE 10006
RUN keytool -import -v -trustcacerts -alias vault-cert -file bcn-registry.crt.pem \
            -keystore /usr/local/openjdk-8/lib/security/cacerts -keypass changeit -storepass changeit -noprompt
CMD java -XX:MaxRAMPercentage=75.0 -Dspring.profiles.active=${profile} \
                  -Dspring.cloud.vault.token=${V_TOKEN1} \
                  -Dspring.cloud.config.uri=http://ecse0050040f.epam.com:${reg_port} \
                  -Deureka.client.service-url.defaultZone=http://ecse0050040f.epam.com:${port}/eureka/,http://localhost:10005/eureka/ \
                  -Dlogging.level.root=${loglevel} \
                  -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=10006 \
                  -jar /usr/beacon/beacons-cloud-registry-service.jar