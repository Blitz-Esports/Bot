declare const config: {
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        debug: boolean;
    };
    server: {
        host: string;
        port: string | number;
        api: {
            prefix: string;
            origin: string;
            listenOptions: {
                port: number;
            };
        };
    };
    bot: {
        token: string;
        developers: string[];
        defaultPrefix: string;
        caseInsensitiveCommands: boolean;
        intents: string[];
        partials: string[];
        guilds: {
            main: string;
            dev: string;
        };
    };
    default: {
        emojis: {
            success: string;
            fail: string;
            warn: string;
            loading: string;
            discord: string;
        };
        colors: {
            success: string;
            fail: string;
            warn: string;
            theme: string;
        };
    };
    api: {
        brawlstars: {
            url: string;
            token: string | undefined;
        };
    };
    features: {
        modmail: {
            enabled: boolean;
            guildId: string;
            channelId: string;
            pingRoles: string[];
            events: {
                DmMessageCreate: string;
                ChannelMessageCreate: string;
                SessionStart: string;
                SessionEnd: string;
            };
            defaultMessages: {
                branding: import("discord-api-types").APIEmbed;
            };
            emojis: {
                success: string;
                error: string;
            };
        };
        verification: {
            guildId: string;
            roles: {
                default: string;
                member: string;
                senior: string;
                vicePresident: string;
                president: string;
            };
            events: {
                memberJoin: string;
            };
        };
        clubOverview: {
            updateInterval: number;
            channelId: string;
            messages: string[];
            customId: string;
            embeds: {
                clubInfo: import("discord-api-types").APIEmbed;
                clubList: import("discord-api-types").APIEmbed;
            };
        };
        automod: {
            antiNsfw: {
                enabled: boolean;
                guildId: string;
                threshold: number;
                excludedPermissions: string[];
                deleteMessageOnDetect: boolean;
                events: {
                    ChannelMessageCreate: string;
                    nsfwDetect: string;
                };
            };
        };
        logging: {
            boostTracker: {
                enabled: boolean;
                guildId: string;
                channelId: string;
                events: {
                    guildMemberBoost: string;
                    guildMemberUnboost: string;
                };
            };
        };
    };
};
export default config;
declare module '@sapphire/pieces' {
    interface Container {
        config: typeof config;
    }
}
//# sourceMappingURL=config.d.ts.map