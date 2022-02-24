import './lib/setup';
import type { BitFieldResolvable, IntentsString, PartialTypes } from 'discord.js';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import config from './config';

const client = new SapphireClient({
    defaultPrefix: config.bot.defaultPrefix,
    caseInsensitiveCommands: config.bot.caseInsensitiveCommands,
    logger: {
        level: LogLevel.Debug
    },
    shards: 'auto',
    intents: config.bot.intents as BitFieldResolvable<IntentsString, number>,
    partials: config.bot.partials as PartialTypes[],
    api: {
        ...config.server.api,
        auth: {
            cookie: process.env.DISCORD_AUTH_COOKIE,
            id: process.env.CLIENT_ID ?? "",
            secret: process.env.DISCORD_AUTH_SECRET ?? "",
            redirect: process.env.DISCORD_AUTH_REDIRECT ?? "",
        }
    }
});

const main = async () => {
    try {
        client.logger.info('Logging in');
        await client.login(config.bot.token);
        client.logger.info('logged in');

    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();