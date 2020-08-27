'use strict'

const { CommandBuilder } = require('hardcord.js')
const fetch = require('node-fetch').default
const queryString = require('querystring').stringify

module.exports = new CommandBuilder()
  .boolean('force')
  .boolean('private')
  .string('src')
  .default('force', false)
  .default('private', false)
  .default('src', 'https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json')
  .alias('force', 'f')
  .alias('private', 'p')
  .alias('src', 's')
  .setCommandHandler(async ({
    message,
    flags: {
      force,
      private: includePrivate,
      src
    },
    args
  }) => {
    const query = args[0]

    if (!query) throw '第一引数に文字列を入力してください。'

    const queries = queryString({ q: query, includePrivate, src, force })
    const body = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queries}`)
      .then(response => response.json())

    if (body.error) {
      message.reply(JSON.stringify(body, null, 2), { code: 'json' })
        .catch(error => message.reply(error, { code: 'ts' }))
    } else {
      message.reply({ embed: body })
        .catch(error => message.reply(error, { code: 'ts' }))
    }
  })
