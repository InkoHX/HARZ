'use strict'

const { lintCode, minimumStyleRules } = require('../lib/linter')
const { searchCodeBlocks } = require('../lib/util')

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

/**
 * @param {import('discord.js').Message} message
 * @param {import('eslint').ESLint.LintResult} result 
 */
const makeResultMessage = (message, result) => message.channel.send(result.messages.map(({
  severity,
  message,
  ruleId,
  line,
  column
}) => `${severity === 1 ? 'WARNING' : 'ERROR'} ${message} (${ruleId}) [${line}, ${column}]`).join('\n') || '問題は見つかりませんでした。', { code: 'ts', split: true })

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
  } = message.content.match(/<@!?(?<mentionID>\d{17,19})> ?lint ?(?:(?<targetMessageID>\d{17,19})|https?:\/\/.*?discord(?:app)?\.com\/channels\/\d{17,19}\/(?<channelID>\d{17,19})\/(?<messageID>\d{17,19}))?/u)?.groups ?? {}

  if (mentionID !== message.client.user.id) return

  const isForce = /-f|-F|--force/gu.test(message.content)
  /** @type {import('discord.js').Message} */
  const targetMessage = channelID && messageID
    ? await message.client.channels.fetch(channelID)
      .then(channel => channel.messages.fetch(messageID))
    : await message.channel.messages.fetch(targetMessageID ?? { before: message.id, limit: 1 })
      .then(message => message instanceof Map ? message.first() : message)
  const codeBlocks = [...searchCodeBlocks(targetMessage.content)]
    .map(result => result.groups)
    .filter(({ extension }) => isForce || supportLanguages.includes(extension))

  Promise.all(codeBlocks.map(({ code }) => lintAndFix(code)))
    .then(results => results.flat())
    .then(results => Promise.all(results.map(result => makeResultMessage(message, result))))
    .catch(error => message.reply(error, { code: 'ts' }))
}
