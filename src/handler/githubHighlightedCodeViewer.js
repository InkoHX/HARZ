'use strict'

const fetch = require('node-fetch').default
const { searchGitHubHighlightedLineLinks } = require('../lib/util')

const formatDate = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  dateStyle: 'long',
  timeStyle: 'full',
  timeZone: 'Asia/Tokyo'
}).format

/**
 * @param {import('discord.js').Message} message
 * @returns {Promise<void>}
 */
module.exports = async message => {
  const links = [...searchGitHubHighlightedLineLinks(message.content)].map(link => link.groups)
  const responses = await Promise.all(links.map(({
    owner,
    repo,
    branch,
    path,
    firstLine,
    lastLine
  }) => fetch(`https://gh-highlighted-line.vercel.app/api/${owner}/${repo}/${branch}/${encodeURIComponent(path)}/${firstLine}/${lastLine ?? ''}`)))

  for (const response of responses) {
    const cacheDate = formatDate(Date.parse(response.headers.get('date')))
    const cacheStatus = response.headers.get('x-vercel-cache')
    const { extension, code } = await response.json()

    if (!code.length) continue

    message.reply(`このデータは「${cacheDate}」にキャッシュされたデータを使用しています。（キャッシュの状態: ${cacheStatus}）`)
      .then(() => message.channel.send(code.join('\n'), { code: extension ?? 'livecodeserver', split: true }))
      .catch(console.error)
  }
}
