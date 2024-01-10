FROM ecse00500096.epam.com:5000/nginx
MAINTAINER EPM-LSTR-BCN

ARG artifact_file
ARG nginx_conf

ARG CI_COMMIT_REF_NAME="ci_COMMIT_REF_NAMEr"
ARG CI_COMMIT_SHORT_SHA="ci_COMMIT_SHORT_SHAr"
ENV CI_COMMIT_REF_NAME1=${CI_COMMIT_REF_NAME}
ENV CI_COMMIT_SHORT_SHA1=${CI_COMMIT_SHORT_SHA}

ADD  ${artifact_file}.tar /usr/beacon/
WORKDIR /usr/beacon/beacon-admin-web
RUN rm /etc/nginx/conf.d/default.conf
COPY files-for-build/${nginx_conf}.conf  /etc/nginx/conf.d/default.conf

RUN touch logfile.log

RUN echo $CI_COMMIT_REF_NAME1 >> logfile.log
RUN echo $CI_COMMIT_SHORT_SHA1 >> logfile.log​​​​​​​​
RUN service nginx restart
