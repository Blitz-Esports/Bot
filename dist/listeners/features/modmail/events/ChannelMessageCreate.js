"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const { modmail } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(message, { receiver }) {
        try {
            await receiver.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        }
        catch (_) {
            await message.react(modmail.emojis.error);
        }
    }
    makeUserMessageEmbed(message) {
        let embeds = [];
        if (message.attachments.size > 0) {
            message.attachments.forEach((attachment) => {
                const userMessageEmbed = new discord_js_1.MessageEmbed({ ...modmail.defaultMessages.branding }).setColor('BLURPLE');
                if (message.content !== '')
                    userMessageEmbed.setDescription(message.content);
                userMessageEmbed.setImage(attachment.proxyURL);
                embeds.push(userMessageEmbed);
            });
        }
        else {
            const userMessageEmbed = new discord_js_1.MessageEmbed({ ...modmail.defaultMessages.branding }).setColor('BLURPLE');
            if (message.content !== '')
                userMessageEmbed.setDescription(message.content);
            embeds.push(userMessageEmbed);
        }
        return {
            embeds: embeds.length === 0 ? undefined : embeds,
            stickers: message.stickers.map((sticker) => sticker).length === 0 ? undefined : message.stickers.map((sticker) => sticker)
        };
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        event: modmail.events.ChannelMessageCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=ChannelMessageCreate.js.map