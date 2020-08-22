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
module.exports.searchGitHubHighlightedLineLinks = str => str.matchAll(/https?:\/\/github\.com\/(?<owner>[\w\W]{1,39})\/(?<repo>[\w\W]{1,100})\/blob\/(?<branch>[\w\W]{1,248}?)\/(?<path>.+)#L(?<firstLine>[0-9]+)-?L?(?<lastLine>[0-9]+)?/gu)
