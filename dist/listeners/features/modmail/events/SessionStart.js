"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const discord_js_1 = require("discord.js");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const { features, server } = config_1.default;
const { modmail } = features;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(author, thread) {
        this.sendUserInfoMessage(author, thread);
        this.sendUserWelcomeMessage(author);
    }
    async sendUserInfoMessage(author, thread) {
        const msg = await thread.send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                    .setAuthor({ name: `${author.tag} (${author.id})`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                    .addField('Created At', `${(0, moment_1.default)(author.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`)
                    .setFooter({ text: `${author.tag}`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            components: [
                new discord_js_1.MessageActionRow().setComponents([
                    new discord_js_1.MessageButton().setCustomId(`${author.id}-modmail-close`).setStyle('DANGER').setLabel('Close'),
                    new discord_js_1.MessageButton().setStyle('LINK').setLabel('Transcript').setURL(`${server.host}/modmail/${thread.id}`)
                ])
            ]
        });
        msg.pin().catch();
    }
    sendUserWelcomeMessage(author) {
        author.send({
            embeds: [
                new discord_js_1.MessageEmbed(modmail.defaultMessages.branding)
                    .setTitle('Thank You For Contacting The Support')
                    .setDescription('The support team will get back to you as soon as possible.')
                    .setColor('NOT_QUITE_BLACK')
            ]
        });
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        event: modmail.events.SessionStart
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=SessionStart.js.map