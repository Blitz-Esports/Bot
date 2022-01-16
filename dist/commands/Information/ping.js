"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const ms_1 = (0, tslib_1.__importDefault)(require("ms"));
let PingCommand = class PingCommand extends framework_1.Command {
    async chatInputRun(interaction) {
        if (!this.container.client.user)
            return;
        const dbConnection = await this.container.database.authenticate().catch(() => null);
        interaction.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setAuthor({ name: this.container.client.user.tag, iconURL: this.container.client.user.displayAvatarURL() })
                    .setColor("NOT_QUITE_BLACK")
                    .setThumbnail(this.container.client.user.displayAvatarURL())
                    .setDescription("Source Code: [GitHub](https://github.com/Blitz-Esports/Bot)")
                    .addField("Statistics", this.formatMessage([
                    `WS Latency: ${this.container.client.ws.ping}ms`,
                    `Database: ${dbConnection === null ? "not connected" : "connected"}`,
                    `Discord.js: ${discord_js_1.version}`,
                    `Sapphire Framework: ${framework_1.version}`,
                    `Node.js: ${process.version}`
                ]))
                    .addField("Uptime", this.formatMessage([
                    `Host: ${(0, ms_1.default)(process.uptime())}`,
                    `Client: ${(0, ms_1.default)(this.container.client.uptime ?? 0)}`
                ]))
            ]
        });
    }
    formatMessage(array) {
        return array.map((desc) => `● ${desc}`).join("\n");
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        }, {
            guildIds: [this.container.config.bot.guilds.main],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */
        });
    }
};
PingCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "ping",
        description: "Shows the bot's latency.",
    })
], PingCommand);
exports.PingCommand = PingCommand;
//# sourceMappingURL=ping.js.map