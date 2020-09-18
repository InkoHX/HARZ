'use strict'

const { CommandBuilder } = require('hardcord.js')
const { lintCode, minimumStyleRules } = require('../lib/linter')
const { searchCodeBlocks, MESSAGE_LINK_PATTERN } = require('../lib/util')

const supportLanguages = [
  'javascript',
  'typescript',
  'ts',
  'js'
]

/**
 * @param {string} code
 */
const lintAndFix = code => lintCode(code, {
  overrideConfig: {
    rules: minimumStyleRules
  },
  fix: true
})

module.exports = new CommandBuilder()
  .boolean('force')
  .alias('force', 'f')
  .default('force', false)
  .setCommandHandler(async ({
    message,
    flags: {
      force
    },
    args
  }) => {
    /**
     * @param {import('eslint').Linter.LintMessage[]} messages
     */
    const makeResultMessage = messages => messages.map(({
      severity,
      message,
      ruleId,
      line,
      column
    }) => `${severity === 1 ? 'WARNING' : 'ERROR'} ${message} (${ruleId}) [${line}, ${column}]`)

    /**
     * @param {import('discord.js').Message} targetMessage
     */
    const run = targetMessage => {
      const codeBlocks = force
        ? [...searchCodeBlocks(targetMessage.content)]
          .map(result => result.groups)
        : [...searchCodeBlocks(targetMessage.content)]
          .map(result => result.groups)
          .filter(({ extension }) => supportLanguages.includes(extension.toLowerCase()))

      for (const { code } of codeBlocks) {
        lintAndFix(code)
          .then(results => results.map(result => makeResultMessage(result.messages).join('\n')))
          .then(lintMessages => Promise.all(lintMessages.map(lintMessage => message.reply(lintMessage || '問題は見つかりませんでした。', { code: 'ts' }))))
          .catch(error => message.reply(error, { code: 'ts' }))
      }
    }

    const target = args[0] ?? ''

    if (/^\d{17,19}/.test(target)) {
      run(await message.channel.messages.fetch(target))

      return
    }

    if (MESSAGE_LINK_PATTERN.test(target)) {
      const {
        messageID,
        channelID
      } = MESSAGE_LINK_PATTERN.exec(target).groups

      /** @type {import('discord.js').Message} */
      const targetMessage = await message.client.channels.fetch(channelID)
        .then(channel => channel.messages.fetch(messageID))

      run(targetMessage)

      return
    }

    const targetMessage = await message.channel.messages.fetch({ before: message.id, limit: 1 })
      .then(messages => messages.first())

    run(targetMessage)
  })
