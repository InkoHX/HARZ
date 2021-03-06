'use strict'

/**
 * Find code blocks in the string.
 * @param {string} str
 * @returns {IterableIterator<RegExpMatchArray>}
 */
module.exports.searchCodeBlocks = str => str.matchAll(/`{3}(?<extension>[\w]+)?\n(?<code>[\s\S]+?)\n`{3}/gu)

/**
 * Find links to GitHub's highlighted code in the string.
 * @param {string} str
 * @returns {IterableIterator<RegExpMatchArray>}
 */
module.exports.searchGitHubHighlightedLineLinks = str => str.matchAll(/https?:\/\/github\.com\/(?<owner>.+?)\/(?<repo>.+?)\/blob\/(?<branch>.+?)\/(?<path>.+?)#L(?<firstLine>\d+)-?L?(?<lastLine>\d+)?/gu)

/**
 * Discord Message Link Pattern
 */
module.exports.MESSAGE_LINK_PATTERN = /https?:\/\/.*?discord(?:app)?\.com\/channels\/\d{17,19}\/(?<channelID>\d{17,19})\/(?<messageID>\d{17,19})/u
