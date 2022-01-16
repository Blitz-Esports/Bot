"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const { boostTracker } = config_1.default.features.logging;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(member) {
        if (member.guild.id !== boostTracker.guildId)
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .addField(`${member.user.username} __unboosted__ <a:catCrying:830734544205512705> the server!!?`, `> ${member}, Thank you for boosting **${member.guild.name}** before!`)
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('BLUE');
        const channel = await this.container.client.channels.fetch(boostTracker.channelId);
        if (channel)
            channel.send({ embeds: [embed] });
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: boostTracker.events.guildMemberUnboost,
        event: "guildMemberUnboost"
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=guildMemberUnboost.js.map