'use strict'

const fetch = require('node-fetch').default
const queryString = require('querystring').stringify

/**
 * @param {import('discord.js').Message} message
 * @returns {Promise<void>}
 */
module.exports = async message => {
  const {
    mentionID,
    query
  } = message.content.match(/<@!?(?<mentionID>\d{17,19})> ?docs ?(?<query>[\S]+)/u)?.groups ?? {}

  if (mentionID !== message.client.user.id) return

  const force = /-f|--force/ui.test(message.content)
  const includePrivate = /-p|--private/ui.test(message.content)
  const source = message.content.match(/(?:--src|-s)=(?<source>.*)?/ui)?.groups?.source ?? 'https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json'

  const queries = queryString({ q: query, src: source, force, includePrivate })
  const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queries}`)
    .then(response => response.json())

  message.reply({ embed })
    .catch(error => message.reply(error, { code: 'ts' }))
}
