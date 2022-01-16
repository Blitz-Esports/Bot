"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
require("discord-api-types/v9");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const { modmail } = config_1.default.features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(message, { thread, modmailChannel }) {
        if (thread) {
            await thread.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        }
        else if (!thread) {
            const pingMessage = await modmailChannel.send({ content: modmail.pingRoles.map((roleId) => `<@&${roleId}>`).join(', ') });
            const newUserThread = await pingMessage.startThread({
                name: message.author.id,
                autoArchiveDuration: 1440 /* OneDay */,
                reason: `Modmail thread: ${message.author.id} | ${(0, moment_1.default)().format('DD/MM/YYYY')}`
            });
            this.container.client.emit(modmail.events.SessionStart, message.author, newUserThread);
            await newUserThread.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        }
    }
    makeUserMessageEmbed(message) {
        let embeds = [];
        if (message.attachments.size > 0) {
            message.attachments.forEach((attachment) => {
                const userMessageEmbed = new discord_js_1.MessageEmbed()
                    .setColor('BLURPLE')
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                if (message.content !== '')
                    userMessageEmbed.setDescription(message.content);
                userMessageEmbed.setImage(attachment.proxyURL).setThumbnail(attachment.url);
                embeds.push(userMessageEmbed);
            });
        }
        else {
            const userMessageEmbed = new discord_js_1.MessageEmbed()
                .setColor('BLURPLE')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
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
        event: modmail.events.DmMessageCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=DmMessageCreate.js.map