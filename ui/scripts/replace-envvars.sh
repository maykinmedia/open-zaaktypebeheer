#!/bin/bash

set -eux -o pipefail

for file in ./assets/*.js;
do
  sed -i 's|VITE_BASE_API_URL_PLACEHOLDER|'${VITE_BASE_API_URL}'|g' $file
done