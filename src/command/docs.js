'use strict'

const { APIMessage } = require('discord.js')
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

    if (!query) return message.reply('第一引数に文字列を入力してください。')

    const queries = queryString({ q: query, includePrivate, src, force })
    const body = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queries}`)
      .then(response => response.json())
      .then(body => body.error ? APIMessage.transformOptions(JSON.stringify(body, null, 2), { code: 'json' }) : { embed: body })
    const documentMessage = await message.channel.send(body)

    const reactionFilter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id

    documentMessage.react('🗑️')
      .then(reaction => reaction.message.awaitReactions(reactionFilter, { time: 60 * 1000, max: 1, errors: ['time'] }))
      .then(() => Promise.all([documentMessage.delete(), message.delete()]))
      .catch(error => error instanceof Map ? documentMessage.reactions.removeAll() : message.reply(error, { code: 'ts' }))
  })
