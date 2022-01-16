"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("./lib/setup");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("./config"));
const client = new framework_1.SapphireClient({
    defaultPrefix: config_1.default.bot.defaultPrefix,
    caseInsensitiveCommands: config_1.default.bot.caseInsensitiveCommands,
    logger: {
        level: 20 /* Debug */
    },
    shards: 'auto',
    intents: config_1.default.bot.intents,
    partials: config_1.default.bot.partials,
    api: config_1.default.server.api
});
const main = async () => {
    try {
        client.logger.info('Logging in');
        await client.login(config_1.default.bot.token);
        client.logger.info('logged in');
    }
    catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};
main();
//# sourceMappingURL=index.js.map