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
    status: 'idle',
    activity: {
      type: 'STREAMING',
      name: 'D1F-ALPHA'
    }
  }
})

client.on('ready', () => console.log('READY!'))

Object.entries(require('./handler'))
  .forEach(([commandName, builder]) => client.addCommand(commandName, builder))

client.login()
  .catch(console.error)
