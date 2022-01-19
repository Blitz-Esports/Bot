import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import config from '../../../config';

const { boostTracker } = config.features.logging;

@ApplyOptions<ListenerOptions>({
    name: boostTracker.events.GuildMemberUnboost,
    event: "guildMemberUnboost"
})
export class UserEvent extends Listener {
    public async run(member: GuildMember) {
        if (member.guild.id !== boostTracker.guildId) return;

        const embed = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .addField(`${member.user.username} __unboosted__ <a:catCrying:830734544205512705> the server!!?`, `> ${member}, Thank you for boosting **${member.guild.name}** before!`)
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('BLUE');

        const channel = await this.container.client.channels.fetch(boostTracker.channelId) as TextChannel;
        if (channel) channel.send({ embeds: [embed] });
    }
}