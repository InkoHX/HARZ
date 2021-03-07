'use strict'

const { CommandBuilder } = require("hardcord.js")
const fetch = require('node-fetch').default
const { ReactionController } = require('discord.js-reaction-controller')
const { MessageEmbed } = require("discord.js")

const SCRAPBOX_SEARCH_ROST_TYPES = [
  'updated',
  'pageRank'
]

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
    if (!SCRAPBOX_SEARCH_ROST_TYPES.includes(sort))
      return message.reply(`\`sort\`オプションで指定できるのは、${SCRAPBOX_SEARCH_ROST_TYPES.map(type => `\`${type}\``).join(', ')} のみです。`)

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
        .setURL(`https://scrapbox.io/${project}/${page.title}`)
        .setThumbnail('https://i.gyazo.com/7057219f5b20ca8afd122945b72453d3.png')
        .setDescription(page.lines
          .map(text => text.trim())
          .join('\n')
        )

      if (page.image) embed.setImage(page.image)

      controller.addPage(embed)
    }

    controller.send(message)
  })
