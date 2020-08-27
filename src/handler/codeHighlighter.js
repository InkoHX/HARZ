'use strict'

const { CommandBuilder } = require('hardcord.js')
const { highlightAuto } = require('highlight.js')
const { lintCode, minimumStyleRules } = require('../lib/linter')
const { MESSAGE_LINK_PATTERN } = require('../lib/util')

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

module.exports = new CommandBuilder()
  .setCommandHandler(async ({
    message,
    args
  }) => {
    const target = args[0] ?? ''

    if (/^\d{17,19}/.test(target)) {
      const targetMessage = await message.channel.messages.fetch(target)
      const results = await format(targetMessage.content)

      for (const result of results) {
        if (result.messages) await message.reply(result.messages, { code: 'ts', split: true })

        await message.channel.send(result.code, { code: result.extension ?? true, split: true })
      }

      return
    }

    if (MESSAGE_LINK_PATTERN.test(target)) {
      const {
        channelID,
        messageID
      } = MESSAGE_LINK_PATTERN.exec(target).groups

      const targetMessage = await message.client.channels.fetch(channelID)
        .then(channel => channel.messages.fetch(messageID))
      const results = await format(targetMessage.content)

      for (const result of results) {
        if (result.messages) await message.reply(result.messages, { code: 'ts', split: true })

        await message.channel.send(result.code, { code: result.extension ?? true, split: true })
      }

      return
    }

    const targetMessage = await message.channel.messages.fetch({ before: message.id, limit: 1 })
      .then(messages => messages.first())
    const results = await format(targetMessage.content)

    for (const result of results) {
      if (result.messages) await message.reply(result.messages, { code: 'ts', split: true })

      await message.channel.send(result.code, { code: result.extension ?? true, split: true })
    }
  })
