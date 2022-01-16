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
        if (!modmail.enabled || message.author.bot || !message.channel.isThread() || message.system)
            return;
        if (message.channel.parentId !== modmail.channelId)
            return;
        const threadAuthor = await this.container.client.users.fetch(message.channel.name).catch(() => null);
        if (threadAuthor)
            this.container.client.emit(modmail.events.ChannelMessageCreate, message, { receiver: threadAuthor });
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "modmail:channelMessageHandler",
        event: framework_1.Events.MessageCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=channelMessageHandler.js.map