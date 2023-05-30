FROM python:3.7

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install essential tools
RUN apt-get -y update && apt-get install -y \
    bluez \
    bluetooth \
    kafkacat

WORKDIR /iscan3

COPY . /iscan3

RUN pip install -r requirements.txt

ENTRYPOINT ["bash", "/iscan3/entrypoint.sh"]
