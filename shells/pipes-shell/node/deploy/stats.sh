#!/bin/sh
echo packing...
npx webpack --profile --json > pack-stats.json
echo studying...
whybundled pack-stats.json

