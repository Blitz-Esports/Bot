import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import config from '../../../../config';
import { getPlayer, AClub } from '../../../../lib/api/brawlstars';
const { verification } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "autoVerify:giveRoles",
    event: verification.events.GiveRoles
})
export class UserEvent extends Listener {
    public async run(member: GuildMember, user: { id: string, tag: string, name: string }) {
        const player = await getPlayer(user.tag);
        if (!player) return;

        const clubData = await this.container.database.models.club.findOne({ where: { id: player.club.tag } });
        const allClubRoles = (await this.container.database.models.club.findAll({})).map((club) => club.toJSON().roleId).filter((roleId) => roleId !== null);

        const rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles), ...allClubRoles].includes(role.id)).map((role) => role.id);

        if (clubData) {
            const resolvedClubData: AClub = clubData.toJSON().rawData;
            const clubMember = resolvedClubData.members.find((member) => member.tag === player.tag);

            const roles = [
                verification.roles.default,
                verification.roles.member,
                verification.roles[clubMember?.role ?? "member"],
                clubData.toJSON().roleId ?? verification.roles.default
            ];
            rolesToSet.push(...roles);
            await member.roles.set(rolesToSet);
        }
        else {
            const roles = [
                verification.roles.default
            ];
            rolesToSet.push(...roles);
            await member.roles.set(rolesToSet);
        }

    }
}