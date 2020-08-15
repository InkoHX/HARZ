'use strict'

const { searchCodeBlocks, searchGitHubHighlightedLineLinks } = require('./util')

describe('searchCodeBlocks', () => {
  const SEARCH_CODE_BLOCKS_TEST_CONTENT_1 = `
123
456
\`\`\`
Hello World
\`\`\`
E17
ABC
`

  const SEARCH_CODE_BLOCKS_TEST_CONTENT_2 = `
456
\`\`\`js
console.log('Hello World')
\`\`\`
123
\`\`\`ts
const str: string = 'ABC'
\`\`\`
123456789
`

  test('Does it match a single code block?', () => {
    const results = [...searchCodeBlocks(SEARCH_CODE_BLOCKS_TEST_CONTENT_1)]

    expect(results).toHaveLength(1)
    expect(results[0].groups).toEqual({ extension: undefined, code: 'Hello World' })
  })

  test('Does it match multiple code blocks?', () => {
    const results = [...searchCodeBlocks(SEARCH_CODE_BLOCKS_TEST_CONTENT_2)]

    expect(results).toHaveLength(2)
    expect(results[0].groups).toEqual({ extension: 'js', code: 'console.log(\'Hello World\')' })
    expect(results[1].groups).toEqual({ extension: 'ts', code: 'const str: string = \'ABC\'' })
  })
})

describe('searchGitHubHighlightedLineLinks', () => {
  const SEARCH_GH_HIGHLIGHTED_LINK_TEST_CONTENT_1 = `
https://github.com/InkoHX/codeblock-linter-discordbot/blob/master/.gitignore
https://github.com/InkoHX/codeblock-linter-discordbot/blob/master/src/index.js#L1-L6
https://github.com/InkoHX/codeblock-linter-discordbot/tree/master/src
`

  const SEARCH_GH_HIGHLIGHTED_LINK_TEST_CONTENT_2 = `
https://github.com/InkoHX/codeblock-linter-discordbot/blob/master/.dockerignore#L2
https://github.com/InkoHX/codeblock-linter-discordbot/blob/master/.dockerignore#L2-L5
https://github.com/InkoHX/highlight-discordbot/blob/master/Dockerfile#L1
https://github.com/InkoHX/highlight-discordbot/blob/master/Dockerfile
https://github.com/InkoHX/highlight-discordbot/blob/master/Dockerfile#L1-6
https://github.com/InkoHX/highlight-discordbot/blob/master/.eslintrc.json
https://github.com/InkoHX/highlight-discordbot/blob/master/.eslintrc.json#L3-L11
`

  test('Does it match the highlighted link?', () => {
    const results = [...searchGitHubHighlightedLineLinks(SEARCH_GH_HIGHLIGHTED_LINK_TEST_CONTENT_1)]

    expect(results).toHaveLength(1)
    expect(results[0].groups).toEqual({
      owner: 'InkoHX',
      repo: 'codeblock-linter-discordbot',
      branch: 'master',
      path: 'src/index.js',
      firstLine: '1',
      lastLine: '6'
    })
  })

  test('Does it match multiple highlighted links?', () => {
    const results = [...searchGitHubHighlightedLineLinks(SEARCH_GH_HIGHLIGHTED_LINK_TEST_CONTENT_2)]

    expect(results).toHaveLength(5)
    expect(results[0].groups).toEqual({
      owner: 'InkoHX',
      repo: 'codeblock-linter-discordbot',
      branch: 'master',
      path: '.dockerignore',
      firstLine: '2',
      lastLine: undefined
    })
    expect(results[1].groups).toEqual({
      owner: 'InkoHX',
      repo: 'codeblock-linter-discordbot',
      branch: 'master',
      path: '.dockerignore',
      firstLine: '2',
      lastLine: '5'
    })
    expect(results[2].groups).toEqual({
      owner: 'InkoHX',
      repo: 'highlight-discordbot',
      branch: 'master',
      path: 'Dockerfile',
      firstLine: '1',
      lastLine: undefined
    })
    expect(results[3].groups).toEqual({
      owner: 'InkoHX',
      repo: 'highlight-discordbot',
      branch: 'master',
      path: 'Dockerfile',
      firstLine: '1',
      lastLine: '6'
    })
    expect(results[4].groups).toEqual({
      owner: 'InkoHX',
      repo: 'highlight-discordbot',
      branch: 'master',
      path: '.eslintrc.json',
      firstLine: '3',
      lastLine: '11'
    })
  })
})
