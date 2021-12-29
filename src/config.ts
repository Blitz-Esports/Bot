export default {
    database: {

    },
    server: {
        port: process.env.PORT || 3000
    },
    bot: {
        token: process.env.BOT_TOKEN || "",
        defaultPrefix: '-',
        caseInsensitiveCommands: true,
        intents: [
            'GUILDS',
            'GUILD_MEMBERS',
            'GUILD_BANS',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_VOICE_STATES',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS'
        ],
        partials: ['REACTION', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'USER']
    }
}