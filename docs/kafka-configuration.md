# Kafka configuration

Comandos utiles para kafka

```shell
#!/bin/bash

# create a topic
kafka-topics --create --topic $TOPIC_NAME --bootstrap-server localhost:9092
# list topics
kafka-topics --describe --topic $TOPIC_NAME --bootstrap-server localhost:9092
# swrte events to topic
kafka-console-producer --topic $TOPIC_NAME --bootstrap-server localhost:9092
# read event topics
kafka-console-consumer --topic $TOPIC_NAME --from-beginning --bootstrap-server localhost:9092

```