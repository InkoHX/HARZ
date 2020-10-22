'use strict'

const { Client } = require('hardcord.js')
const { Intents } = require('discord.js')

const client = new Client({
  ws: {
    intents: Intents.NON_PRIVILEGED
  },
  http: {
    api: 'https://discord.com/api'
  },
  presence: {
    activity: {
      type: 'COMPETING',
      name: '大乱闘スマッシュブラザーズ'
    }
  },
  restTimeOffset: 0
})

Object.entries(require('./command'))
  .forEach(([commandName, builder]) => client.addCommand(commandName, builder))

client
  .on('ready', () => console.log('READY!'))
  .on('message', message => require('./handler').forEach(handler => handler(message)))
  .login()
    .catch(console.error)
