"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const discord_js_1 = require("discord.js");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const embed_1 = require("../../../../lib/constants/embed");
const { features } = config_1.default;
const { modmail } = features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(buttonInteraction) {
        if (!buttonInteraction.channel?.isThread())
            return;
        else if (buttonInteraction.channel.parentId !== modmail.channelId)
            return;
        await buttonInteraction.deferReply({ ephemeral: true });
        const threadUser = await this.container.client.users.fetch(buttonInteraction.channel.name).catch(() => null);
        if (buttonInteraction.channel.editable) {
            await buttonInteraction.channel.edit({
                name: `${buttonInteraction.channel.name} | ${(0, moment_1.default)().toISOString()}`
            });
            await buttonInteraction.channel.send({ embeds: [(0, embed_1.successEmbed)(`${buttonInteraction.message.author.toString()} closed this thread.`)] });
            if (!buttonInteraction.channel.archived)
                buttonInteraction.channel.setArchived().catch();
            buttonInteraction.editReply({ content: 'Closed the thread.' });
        }
        else {
            buttonInteraction.channel.send({ embeds: [(0, embed_1.failEmbed)(`Unable to close this thread.`)] });
            buttonInteraction.editReply({ content: 'Unable to close the thread.' });
        }
        if (threadUser) {
            threadUser
                .send({
                embeds: [
                    new discord_js_1.MessageEmbed(modmail.defaultMessages.branding)
                        .setTitle('The Support Has Been Closed!')
                        .setDescription('Message again to open a new support session.\nThe conversation has been recorded and can be requested/viewed upon request.')
                        .setColor('NOT_QUITE_BLACK')
                ]
            })
                .catch();
        }
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        event: modmail.events.SessionEnd
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=SessionEnd.js.map