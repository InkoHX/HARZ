<div align="center">

<img width="100%" src="https://github.com/InkoHX/HARZ/raw/master/media/HARZ_BANNER.gif" />

# HARZ

**A Discord bot developed for the Discord.js Japan User Group for developers.**

![Jest Action](https://github.com/InkoHX/HARZ/workflows/Jest/badge.svg)
[![PayPal Donate](https://img.shields.io/badge/PayPal-donate-brightgreen)](https://paypal.me/inkohxdev?locale.x=ja_JP)
[![Patreon Donate](https://img.shields.io/badge/Patreon-donate-brightgreen)](https://patreon.com/inkohx)

</div>

## Features

- Highlighting code that is not enclosed in a code block
  - The language will be selected automatically
- Executing a linter using ESLint on code in a code block
  - JavaScript or TypeScript only
- Parse GitHub's highlighted line links and send the code for the highlighted lines
- Search the Discord.js documentation
  - By [djsdocs.sorta.moe](https://djsdocs.sorta.moe)

## Deploy to Heroku

Click the "Deploy to Heroku" button below and you can get HARZ running now.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Running Docker image

An image published in the [Docker Hub](https://hub.docker.com/r/inkohx/harz) can also be used.

```bash
# Create
docker create -e DISCORD_TOKEN="token here" --name harz-d1f inkohx/harz:latest

# Start
docker start harz-d1f

# Stop
docker stop harz-d1f
```
