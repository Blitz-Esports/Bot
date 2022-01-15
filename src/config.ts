import { container } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

const guilds = {
    main: "723146775262658571",
    dev: "925729579723800626"
}

const config = {
    database: {
        host: process.env.DATABASE_HOST || "localhost",
        port: parseInt(process.env.DATABASE_PORT || "3306"),
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "password",
        database: process.env.DATABASE_NAME || "myDB",
        debug: false
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
        developers: ["477649356191825920"],
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
        partials: ['REACTION', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'USER'],
        guilds
    },
    default: {
        emojis: {
            success: "<:Yes:925796984227512421>",
            fail: "<:No:925796938379579482>",
            warn: "<:Warn:926126855076077618>",
            loading: "<a:loading:926892235189018714>",
            discord: "<:discord:927916682746413157>"
        },
        colors: {
            success: '#43B581',
            fail: '#E72E2B',
            warn: '#FFCD00',
            theme: '#0099ff',
        }
    },
    api: {
        brawlstars: {
            url: "https://bsproxy.royaleapi.dev/v1",
            token: process.env.BRAWL_STARS_API
        }
    },
    features: {
        modmail: {
            enabled: true,
            guildId: guilds.main,
            channelId: "931505920549199932",
            pingRoles: ["931506574621552660"],
            events: {
                DmMessageCreate: "modmail:dmMessageCreate",
                ChannelMessageCreate: "modmail:channelMessageCreate",
                SessionStart: "modmail:SessionCreate",
                SessionEnd: "modmail:SessionEnd"
            },
            defaultMessages: {
                branding: new MessageEmbed().setAuthor({ name: "Blitz Esports | Support Team", iconURL: "https://iili.io/Ycyml4.gif" }).toJSON()
            },
            emojis: {
                success: "✅",
                error: "❌"
            }
        },
        verification: {
            guildId: guilds.main,
            roles: {
                default: "743940338611257385",
                member: "723432950141812776",
                senior: "723440871424524308",
                vicePresident: "723440961002405929",
                president: "910509673336176690"
            },
            events: {
                memberJoin: "verification:memberJoin"
            }
        },
        clubOverview: {
            updateInterval: 1000 * 60 * 1,
            channelId: "931520486922387456",
            messages: ["931520695379296316", "931523960716283944", "931526448823537665"],
            customId: "club-overview",
            embeds: {
                clubInfo: new MessageEmbed()
                    .setTitle("Blitz™ Esports Club Stats | Overview")
                    .setFooter({ text: "BLITZ™ Esports | Club Statistics | Last Updated", iconURL: "https://iili.io/caCYXf.jpg" })
                    .setThumbnail("https://iili.io/caCYXf.jpg")
                    .setColor("ORANGE")
                    .toJSON(),
                clubList: new MessageEmbed()
                    .setThumbnail("https://iili.io/caCYXf.jpg")
                    .setColor("ORANGE")
                    .toJSON()
            }
        },
        automod: {
            antiNsfw: {
                enabled: true,
                guildId: guilds.main,
                threshold: 0.7,
                excludedPermissions: ["ADMINISTRATOR"],
                deleteMessageOnDetect: true,
                events: {
                    ChannelMessageCreate: "antinsfw:channelMessageCreate",
                    nsfwDetect: "antinsfw:nsfwDetect"
                }
            }
        },
        logging: {
            boostTracker: {
                enabled: true,
                guildId: guilds.main,
                channelId: "849830448011542588",
                events: {
                    guildMemberBoost: "logging:guildMemberBoost",
                    guildMemberUnboost: "logging:guildMemberUnboost"
                }
            }
        }
    }
};

container.config = config;
export default config;

declare module '@sapphire/pieces' {
    interface Container {
        config: typeof config
    }
}