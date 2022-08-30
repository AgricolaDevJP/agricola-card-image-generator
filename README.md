# agricola-card-image-generator

## Setup

### Install Dependencies

Here is a setup example using [nodenv](https://github.com/nodenv/nodenv) with [nodenv-yarn-install](https://github.com/pine/nodenv-yarn-install) plugin.

```
$ git clone git@github.com:AgricolaDevJP/agricola-card-image-generator.git
$ cd agricola-card-image-generator
$ nodenv install
$ yarn
```

### Download Assets

This program depends on [Noto Sans CJK JP](https://github.com/googlefonts/noto-cjk) fonts.

```
$ yarn download-fonts
```

## Deploy

```
$ yarn cdk deploy --profile=AgricolaDevJP-admin
```

## Test

### Preparation

```
$  sudo apt update && sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget fonts-noto-cjk
```