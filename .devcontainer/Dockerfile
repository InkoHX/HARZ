FROM node:14-alpine

# Required to download yuta0801/discord.js-repl from GitHub
RUN apk update && \
  apk add --no-cache git

# Install Discord.js REPL
RUN yarn global add yuta0801/discord.js-repl
