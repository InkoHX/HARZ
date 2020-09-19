'use strict'

const SCRAPBOX_UPDATE_CHANNEL_ID = '681352484530552862'
const AUTHOR_WEBHOOK_ID = '681352569540575244'

/**
 * @param {import('discord.js').Message} message
 */
module.exports = message => {
  if (message.channel.id !== SCRAPBOX_UPDATE_CHANNEL_ID) return
  if (message.webhookID !== AUTHOR_WEBHOOK_ID) return

  message.crosspost()
    .catch(reason => message.channel.send(reason, { code: 'js' }))
}
