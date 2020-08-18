'use strict'

const { highlightAuto } = require('highlight.js')

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
  const targetCodeLanguage = highlightAuto(targetMessage.content).language

  message.reply(`このコードの言語は「**${targetCodeLanguage}**」と判断されました。`)
    .then(() => message.channel.send(targetMessage.cleanContent, { code: targetCodeLanguage ?? true, split: true }))
    .catch(error => message.reply(error, { code: 'ts' }))
}
