/** Package for environment variables usage in local testing, uncomment when running locally */
// require('dotenv').config()

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

/** Constants */
const LISTEN_TO_CHANNEL_IDS = [
    "202312233856925697", // Memes channel
    // "619747193653297152", // Bot channel
]
const HALL_OF_FAME_CHANNEL_ID = "952356642941435945"
const ASCENDED_MESSAGE_IDS = [] // Messages that have already ascended to godhood (Posted in HoF channel)

/** Events */
client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    const HALL_OF_FAME_CHANNEL = await client.channels.fetch(HALL_OF_FAME_CHANNEL_ID)

    // Populate ASCENDED_MESSAGE_IDS
    await HALL_OF_FAME_CHANNEL.messages.fetch().then(messages => {
        console.log(`Fetched ${messages.size} existing godly memes from HoF channel.`)

        messages.forEach(message => {
            const originalMessageId = message.content.match(/(?<=\{)(.*?)(?=\})/)[0]
            ASCENDED_MESSAGE_IDS.push(originalMessageId)
        })
    })

    console.log(`Bot listening for message reactions...`)

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

        // Ignore reactions to messages from non-included channels or messages that have already ascended
        if (
            !LISTEN_TO_CHANNEL_IDS.includes(msg.channelId) ||
            ASCENDED_MESSAGE_IDS.includes(msg.id)
        ) return

        const reactions = msg.reactions.cache.reduce((prev, current) => {
            const userWhoReactedId = current.client.user.id
            return !prev.userIds.includes(userWhoReactedId)
                ? { userIds: [...prev.userIds, userWhoReactedId], total: prev.total + 1, totalNonUnique: prev.totalNonUnique + 1 }
                : { ...prev, totalNonUnique: prev.totalNonUnique + 1 }
        }, { userIds: [], totalUnique: 0, totalNonUnique: 0 })

        if (reactions.totalUnique >= 5) {
            HALL_OF_FAME_CHANNEL.send({
                content: `<@${msg.author.id}>'s meme was worthy! {${msg.id}}`,
                files: Array.from(msg.attachments.values()),
            })
        }
    })
})

/** Startup */
client.login(process.env.TOKEN)