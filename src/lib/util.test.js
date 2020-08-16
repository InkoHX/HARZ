'use strict'

const { searchCodeBlocks, searchGitHubHighlightedLineLinks } = require('./util')

describe('searchCodeBlocks', () => {
  test('matching', () => {
    const content = [
      '`'.repeat(3) + 'js',
      'console.log(\'Hello World\')',
      '`'.repeat(3),
      '123456',
      '`'.repeat(3),
      'Hello World',
      '`'.repeat(4),
      '`'.repeat(3) + 'ts',
      'console.log(\'1\' as number)',
      '`'.repeat(6)
    ]
    const results = [...searchCodeBlocks(content.join('\n'))]
      .map(matchArray => matchArray.groups)
    
    expect(results).toHaveLength(3)
    expect(results).toEqual([
      {
        extension: expect.stringContaining('js'),
        code: expect.stringContaining('console.log(\'Hello World\')')
      },
      {
        extension: undefined,
        code: expect.stringContaining('Hello World')
      },
      {
        extension: expect.stringContaining('ts'),
        code: expect.stringContaining('console.log(\'1\' as number)')
      }
    ])
  })
  
  test('not matching', () => {
    const content = [
      '`'.repeat(2),
      '456',
      '`'.repeat(6),
      '\''.repeat(3),
      '789',
      '\''.repeat(3)
    ]
    
    expect([...searchCodeBlocks(content.join('\n'))]).toHaveLength(0)
  })
})

describe('searchGitHubHighlightedLineLinks', () => {
  test('matching', () => {
    const content = [
      'https://github.com/InkoHX/StarryKnight/blob/master/docker-compose.yml#L1-L24',
      'http://github.com/InkoHX/StarryKnight/blob/master/docker-compose.yml#L1',
      'https://github.com/InkoHX/StarryKnight/blob/master/docker-compose.yml',
      'https://github.com/InkoHX/HARZ/blob/master/src/lib/util.js#L10-L15',
      'http://github.com/InkoHX/HARZ/blob/master/src/lib/util.js#L10',
      'https://github.com/InkoHX/HARZ/blob/master/src/lib/util.js'
    ]
    const results = [...searchGitHubHighlightedLineLinks(content.join('\n'))]
      .map(matchArray => matchArray.groups)
    
    expect(results).toHaveLength(4)
    expect(results).toEqual([
      {
        owner: expect.stringContaining('InkoHX'),
        repo: expect.stringContaining('StarryKnight'),
        branch: expect.stringContaining('master'),
        path: expect.stringContaining('docker-compose.yml'),
        firstLine: expect.stringContaining('1'),
        lastLine: expect.stringContaining('24')
      },
      {
        owner: expect.stringContaining('InkoHX'),
        repo: expect.stringContaining('StarryKnight'),
        branch: expect.stringContaining('master'),
        path: expect.stringContaining('docker-compose.yml'),
        firstLine: expect.stringContaining('1'),
        lastLine: undefined
      },
      {
        owner: expect.stringContaining('InkoHX'),
        repo: expect.stringContaining('HARZ'),
        branch: expect.stringContaining('master'),
        path: expect.stringContaining('src/lib/util.js'),
        firstLine: expect.stringContaining('10'),
        lastLine: expect.stringContaining('15')
      },
      {
        owner: expect.stringContaining('InkoHX'),
        repo: expect.stringContaining('HARZ'),
        branch: expect.stringContaining('master'),
        path: expect.stringContaining('src/lib/util.js'),
        firstLine: expect.stringContaining('10'),
        lastLine: undefined
      }
    ])
  })

  test('not matching', () => {
    const content = [
      'https://github.com/InkoHX/Hypie',
      'https://github.com/InkoHX/Hypie/blo/master/tsconfig.json#6',
      'https://github.comm/InkoHX/Hypie/blob/master/tsconfig.json',
      'https://github.com/InkoHX/Hypie/blob/master#L456789745'
    ]
    const results = [...searchGitHubHighlightedLineLinks(content.join('\n'))]
      .map(matchArray => matchArray.groups)
    
    expect(results).toHaveLength(0)
  })
})
