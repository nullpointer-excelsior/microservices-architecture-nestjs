#!/bin/bash

app=$1
module=$2

cd "apps/$app/src" || exit
nest generate module "$module"
mkdir -p "$module"/{application,infrastructure,domain/{model,repositories}}


