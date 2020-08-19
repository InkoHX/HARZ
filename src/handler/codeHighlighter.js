'use strict'

const { highlightAuto } = require('highlight.js')
const { lintCode, minimumStyleRules } = require('../lib/linter')

const lintAndFix = code => lintCode(code, {
  overrideConfig: {
    rules: minimumStyleRules
  },
  fix: true
})

/**
 * Format the code
 * @param {string} code
 */
const format = async code => {
  const { language } = highlightAuto(code)

  switch (language) {
    case 'json':
      try {
        return [{
          code: JSON.stringify(JSON.parse(code), null, 2),
          extension: 'json',
          messages: null
        }]
      } catch (error) {
        return [{
          code,
          extension: 'json',
          messages: error.message
        }]
      }
    case 'javascript':
    case 'typescript':
      const lintResults = (await lintAndFix(code))
        .map(({ output, messages }) => ({
          code: output ?? code,
          extension: language,
          messages: messages.map(({
            severity,
            message,
            ruleId,
            line,
            column
          }) => `${severity === 1 ? 'WARNING' : 'ERROR'} ${message} (${ruleId}) [${line}, ${column}]`).join('\n') || null
        }))

      return lintResults
    default:
      return [{
        code,
        extension: language,
        messages: null
      }]
  }
}

/**
 * @param {import('discord.js').Message} message
 * @returns {Promise<void>}
 */
module.exports = async message => {
  const {
    mentionID,
    targetMessageID,
    channelID,
    messageID
  } = message.content.match(/<@!?(?<mentionID>\d{17,19})> ?hl ?(?:(?<targetMessageID>\d{17,19})|https?:\/\/.*?discord(?:app)?\.com\/channels\/\d{17,19}\/(?<channelID>\d{17,19})\/(?<messageID>\d{17,19}))?/u)?.groups ?? {}

  if (mentionID !== message.client.user.id) return

  /** @type {import('discord.js').Message} */
  const targetMessage = channelID && messageID
    ? await message.client.channels.fetch(channelID)
      .then(channel => channel.messages.fetch(messageID))
    : await message.channel.messages.fetch(targetMessageID ?? { before: message.id, limit: 1 })
      .then(message => message instanceof Map ? message.first() : message)

  const results = await format(targetMessage.content)

  for (const result of results) {
    if (result.messages) await message.reply(result.messages, { code: 'ts', split: true })

    await message.channel.send(result.code, { code: result.extension ?? true, split: true })
  }
}
