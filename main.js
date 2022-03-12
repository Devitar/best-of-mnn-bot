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

client.on("message", async msg => {
    if (msg.content === "ping") {
        msg.reply("pong")
    }
})

/** Startup */
client.login(process.env.TOKEN)