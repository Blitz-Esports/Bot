import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import config from '../../../config';

const { boostTracker } = config.features.logging;

@ApplyOptions<ListenerOptions>({
    name: boostTracker.events.guildMemberBoost,
    event: "guildMemberBoost"
})
export class UserEvent extends Listener {
    public async run(member: GuildMember) {
        if (member.guild.id !== boostTracker.guildId) return;

        const embed = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .addField(`${member.user.username} just __boosted__ <a:boost:830735911099564063> the server!`, `> <a:catHeart:830734262058745858> Thank you, ${member} for boosting **${member.guild.name}**.\n> <a:redBadge:771681960414281740> You have unlocked the booster __perks__!`)
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('#EF2A4D');

        const channel = await this.container.client.channels.fetch(boostTracker.channelId) as TextChannel;
        if (channel) channel.send({ embeds: [embed] });
    }
}