'use strict'

const { CommandBuilder } = require("hardcord.js")
const fetch = require('node-fetch').default
const { ReactionController } = require('discord.js-reaction-controller')
const { MessageEmbed } = require("discord.js")

const SCRAPBOX_SEARCH_ROST_TYPES = [
  'updated',
  'created',
  'accessed',
  'linked',
  'views',
  'title'
]

const dateTimeFormat = Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  timeZone: 'Asia/Tokyo',
  timeStyle: 'medium',
  dateStyle: 'short'
}).format

module.exports = new CommandBuilder()
  .string('sort')
  .string('project')
  .default('sort', 'title')
  .default('project', 'discordjs-japan')
  .alias('sort', 's')
  .alias('project', 'p')
  .setCommandHandler(async ({
    message,
    args,
    flags: {
      project,
      sort
    }
  }) => {
    if (!SCRAPBOX_SEARCH_ROST_TYPES.includes(sort)) throw `\`sort\`オプションで指定できるのは、${SCRAPBOX_SEARCH_ROST_TYPES.map(type => `\`${type}\``).join(', ')} のみです。`

    const response = await fetch(`https://scrapbox.io/api/pages/${project}/search/query?skip=0&sort=${sort}&limit=30&q=${encodeURIComponent(args.join(' '))}`)

    if (response.status !== 200) {
      const { message: content } = await response.json()

      return message.reply(content, { code: true })
    }

    const { pages } = await response.json()
    const controller = new ReactionController(message.client, {
      time: 60000 * 3
    })

    for (const page of pages) {
      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(page.title)
        .setURL(`https://scrapbox.io/${project}/${encodeURIComponent(page.title)}`)
        .setThumbnail('https://i.gyazo.com/7057219f5b20ca8afd122945b72453d3.png')
        .addField('閲覧数', page.views, true)

      if (typeof page.image === 'string') embed.setImage(page.image)
      if (typeof page.created === 'number') embed.addField('作成日', dateTimeFormat(page.created * 1000), true)
      if (typeof page.updated === 'number') embed.addField('更新日', dateTimeFormat(page.updated * 1000), true)
      if (typeof page.accessed === 'number') embed.addField('最終アクセス日', dateTimeFormat(page.accessed * 1000), true)
      if (typeof page.snapshotCreated === 'number') embed.addField('スナップショット作成日', dateTimeFormat(page.snapshotCreated * 1000), true)

      controller.addPage(embed)
    }

    controller.send(message)
  })
