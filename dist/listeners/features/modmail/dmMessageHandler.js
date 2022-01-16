"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const { modmail } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(message) {
        if (!modmail.enabled || message.channel.type !== 'DM' || message.author.bot)
            return;
        else if (!modmail.channelId || !modmail.guildId)
            return this.container.logger.warn('Unable to resolve modmail config.');
        const modmailGuild = this.container.client.guilds.cache.get(modmail.guildId);
        if (!modmailGuild)
            return this.container.logger.warn('Modmail guild not found.');
        const modmailChannel = modmailGuild.channels.cache.get(modmail.channelId);
        if (!modmailChannel || modmailChannel.type !== 'GUILD_TEXT' || !modmailChannel.isText())
            return this.container.logger.warn('Modmail channel not found or the channel is not a text channel.');
        await modmailChannel.threads.fetch();
        const userThread = modmailChannel.threads.cache.find((c) => c.name === message.author.id);
        if (userThread) {
            this.container.client.emit(modmail.events.DmMessageCreate, message, { thread: userThread, modmailChannel, modmailGuild });
        }
        else if (!userThread) {
            this.container.client.emit(modmail.events.DmMessageCreate, message, { thread: null, modmailChannel, modmailGuild });
        }
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "modmail:dmMessageHandler",
        event: framework_1.Events.MessageCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=dmMessageHandler.js.map