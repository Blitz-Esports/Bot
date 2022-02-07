import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import config from '../../../../config';
import { getPlayer, AClub } from '../../../../lib/api/brawlstars/brawlstars';
import type { OCRResponse } from '../../../../lib/api/ocr';
import { failEmbed } from '../../../../lib/constants/embed';

const { verification } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "autoVerify:tagDetect",
    event: verification.events.TagDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, ocrResponse: OCRResponse[]) {
        const { member } = message;
        if (!ocrResponse[0] || !member) return message.reactions.removeAll();

        const user = await this.container.database.models.player.findOne({ where: { id: message.author.id } });
        if (user) {
            message.reply({ embeds: [failEmbed(`${member.toString()}, you already have a tag saved in the database with name: **${user.toJSON().name}** and tag: **${user.toJSON().tag}**.\nIf you want to refresh your roles run \`/rerole\` command.`)] });
            return message.reactions.removeAll();
        }

        const tag = ocrResponse[0].document.inference.prediction.ocr.values.map((value) => value.content).join("");
        const player = await getPlayer(tag);
        if (!player) {
            message.reply({ embeds: [failEmbed(`${member.toString()}, Unable to fetch the profile with the detected tag: **${tag}**.`)] });
            return message.reactions.removeAll();
        }

        const clubData = await this.container.database.models.club.findOne({ where: { id: player.club.tag ?? "unknown" } });

        let rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles)].includes(role.id)).map((role) => role.id);

        const successEmbed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} | 🏆 ${player.trophies.toLocaleString()}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: `https://brawlify.com/stats/profile/${player.tag.replace("#", "")}` })
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }));

        await this.container.database.models.player.create({
            id: member.user.id,
            tag: player.tag,
            name: player.name
        });

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
            rolesToSet = [...new Set(rolesToSet)];

            await member.roles.set(rolesToSet);

            successEmbed.setDescription([
                `Account linked: ${member.toString()} with **${player.name} | ${player.tag}**.`,
                `Associated with club: **${player.club.name ?? "None"}**.`,
                `Club tag: **${player.club.tag ?? "None"}**.`,
                `Roles changed: ${[...new Set(roles)].map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"))

            await message.reactions.removeAll();
            return message.reply({ embeds: [successEmbed] });
        }
        else {
            const roles = [
                verification.roles.default
            ];
            rolesToSet.push(...roles);
            rolesToSet = [...new Set(rolesToSet)];

            await member.roles.set(rolesToSet);

            successEmbed.setDescription([
                `Account linked: ${member.toString()} with **${player.name} | ${player.tag}**.`,
                `Associated with club: **${player.club.name ?? "None"}**.`,
                `Club tag: **${player.club.tag ?? "None"}**.`,
                `Roles changed: ${[...new Set(roles)].map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"))

            await message.reactions.removeAll();
            return message.reply({ embeds: [successEmbed] });
        }

    }
}