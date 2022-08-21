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
