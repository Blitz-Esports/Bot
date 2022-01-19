import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import config from '../../../config';
const { verification } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "autoVerify:guildMemberAddManager",
    event: Events.GuildMemberAdd
})
export class UserEvent extends Listener {
    public async run(member: GuildMember) {
        if (member.guild.id !== verification.guildId) return;
        const user = await this.container.database.models.player.findOne({ where: { id: member.id } });
        if (!user) return;
        else {
            this.container.client.emit(verification.events.GiveRoles, member, user);
        }
    }
}