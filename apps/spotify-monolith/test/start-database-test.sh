#!/bin/bash

DATABASE="monolith-test"

docker rm -f $DATABASE 2&> /dev/null
docker run -d -p 5555:5432 -e POSTGRES_DB=test -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test --name $DATABASE postgres
