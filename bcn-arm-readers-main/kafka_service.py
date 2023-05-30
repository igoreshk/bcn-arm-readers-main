"""
Provides Producer class which works with Kafka.
"""
import os

from kafka import KafkaProducer


class Producer:
    """
    Works with Kafka as a producer, gives a way to create kafka producers for development, production and testing,
    works with all of them with "one click".
    The constructor takes strings of ip-addresses for kafka bootstrap servers as arguments
    """

    def __init__(self, *servers, host_name):

        self.kafkas = []
        self.servers = servers
        for server in self.servers:
            self.kafkas.append(
                KafkaProducer(
                    bootstrap_servers=[server],
                    value_serializer=lambda v: v.encode("utf-8"),
                    buffer_memory=2 ** 20,  # 1Mb
                    max_block_ms=3000,  # 3 sec
                    security_protocol="SASL_PLAINTEXT",
                    sasl_mechanism="PLAIN",
                    sasl_plain_username=f"{host_name}",
                    sasl_plain_password=os.getenv(f"USER_{host_name}"),
                )
            )

    def send(self, topic: str, value: str):
        """
        Sends given information to all kafkas
        :param topic: a topic to send to
        :param value: a value to send
        :return:
        """
        for producer, server in zip(self.kafkas, self.servers):
            producer.send(topic, value)
