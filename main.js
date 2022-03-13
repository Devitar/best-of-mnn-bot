/** Enables environment variables usage */
require('dotenv').config()

/** Discord client */
const { Client, Intents } = require("discord.js")
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

/** Events */
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageReactionAdd', async reaction => {
    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error)

            return
        }
    }

    const msg = reaction.message
    const cache = msg.reactions.cache
    const uniqueReactions = cache.reduce((prev, current) => {
        const userWhoReactedId = current.client.user.id
        return !prev.userIds.includes(userWhoReactedId)
            ? { userIds: [...prev.userIds, userWhoReactedId], total: prev.total + 1 }
            : prev
    }, { userIds: [], total: 0 })

    if (uniqueReactions.total >= 5) {
        // Copy msg.attachments and move them to "best of" channel
    }
})

/** Startup */
client.login(process.env.TOKEN)