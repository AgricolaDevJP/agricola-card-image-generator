#!/bin/sh

set -eu

cd `dirname $0`

curl -L https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf -o ../src/assets/fonts/NotoSansCJKjp-Regular.otf
