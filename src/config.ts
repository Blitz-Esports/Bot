import { MessageEmbed } from "discord.js";

export default {
    database: {
        host: process.env.DATABASE_HOST || "localhost",
        port: parseInt(process.env.DATABASE_PORT || "3306"),
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "password",
        database: process.env.DATABASE_NAME || "myDB"
    },
    server: {
        host: `http://localhost:${process.env.PORT || 3000}`,
        port: process.env.PORT || 3000,
        api: {
            prefix: '',
            origin: '*',
            listenOptions: {
                port: parseInt(process.env.PORT || "3000")
            }
        }
    },
    bot: {
        token: process.env.BOT_TOKEN || "xyz",
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
    },
    default: {
        emojis: {
            success: "<:Yes:925796984227512421>",
            fail: "<:No:925796938379579482>",
            warn: "<:Warn:926126855076077618>"
        },
        colors: {
            success: '#43B581',
            fail: '#E72E2B',
            warn: '#FFCD00',
            theme: '#0099ff',
        }
    },
    features: {
        modmail: {
            enabled: true,
            guildId: "925729579723800626",
            channelId: "925789470052188170",
            pingRoles: ["925959421459325019"],
            events: {
                DmMessageCreate: "modmail:dmMessageCreate",
                ChannelMessageCreate: "modmail:channelMessageCreate",
                SessionStart: "modmail:SessionCreate",
                SessionEnd: "modmail:SessionEnd"
            },
            defaultMessages: {
                branding: new MessageEmbed().setAuthor({ name: "BLITZ™ Esports | Support Team", iconURL: "https://iili.io/Ycyml4.gif" }).toJSON()
            },
            emojis: {
                success: "✅",
                error: "❌"
            }
        },
        antiNsfw: {
            enabled: true,
            guildId: "925729579723800626",
            threshold: 0.7,
            excludedPermissions: [],
            deleteMessageOnDetect: true,
            events: {
                ChannelMessageCreate: "antinsfw:channelMessageCreate",
                nsfwDetect: "antinsfw:nsfwDetect"
            }
        }
    }
}