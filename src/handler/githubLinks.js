'use strict'

const { searchGitHubHighlightedLineLinks } = require('../lib/util')
const fetch = require('node-fetch').default

/**
 * @param {import('discord.js').Message} message
 */
module.exports = async message => {
  const links = [...searchGitHubHighlightedLineLinks(message.content)].map(link => link.groups)

  const results = await Promise.all(links.map(({
    owner,
    repo,
    branch,
    path,
    firstLine,
    lastLine
  }) => fetch(`https://gh-highlighted-line.vercel.app/api/${owner}/${repo}/${branch}/${encodeURIComponent(path)}/${firstLine}/${lastLine ?? ''}`)))
    .then(responses => Promise.all(responses.map(response => response.json())))
  
  for (const { extension, code } of results) {
    if (!code.length) continue

    await message.channel.send(code.join('\n'), { code: extension ?? 'livecodeserver', split: true })
  }
}
