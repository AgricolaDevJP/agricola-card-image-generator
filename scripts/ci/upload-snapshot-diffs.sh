#!/bin/sh

set -eu

cd `dirname $0`

aws s3 cp ../../src/__image_snapshots__/__diff_output__/ s3://agricola-card-image-generator-snapshot/$1/ --recursive
