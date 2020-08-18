'use strict'

const { Client, Intents } = require('discord.js')

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

const handlers = Object.values(require('./handler'))

client.on('message', message => {
  if (message.author.bot || message.system) return

  Promise.all(handlers.map(fnc => fnc(message)))
    .catch(error => message.reply(error, { code: 'js' }))
})

client.login()
  .catch(console.error)
