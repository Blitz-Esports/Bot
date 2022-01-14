import { container } from "@sapphire/framework"
import { MessageActionRow, MessageEmbed, MessageOptions, MessageSelectMenu } from "discord.js";
import config from "../../../config";
import { AClub, brawlstarsEmojis } from "../../api/brawlstars";
import { splitChunk } from "./modules";

const { clubOverview } = config.features;

export const buildOverviewEmbed = async () => {
    const allClubs: AClub[] = (await container.database.models.club.findAll({})).map((club) => club.toJSON().rawData);

    const totalClubs = allClubs.length;
    const totalTrophies = allClubs.reduce((acc, club) => acc + club.trophies, 0);
    const totalMembers = allClubs.reduce((acc, club) => acc + club.members.length, 0);

    const averageTrophies = Math.round(totalTrophies / totalClubs);
    const averageRequired = Math.round(allClubs.reduce((acc, club) => acc + club.requiredTrophies, 0) / totalClubs);
    const averageMembers = Math.round(allClubs.reduce((acc, club) => acc + club.members.length, 0) / totalClubs);

    const totalMemberRole = allClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "member").length, 0);
    const totalSeniorRole = allClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "senior").length, 0);
    const totalVicePresidentRole = allClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "vicePresident").length, 0);
    const totalPresidentRole = allClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "president").length, 0);

    const clubInfoEmbed = new MessageEmbed(clubOverview.embeds.clubInfo)
        .setTimestamp()
        .addFields(
            {
                name: `Total Clubs`,
                value: `${brawlstarsEmojis.icons.club} ${totalClubs.toLocaleString()}`,
                inline: true
            },
            {
                name: `Total Trophies`,
                value: `${brawlstarsEmojis.icons.trophy_club} ${totalTrophies.toLocaleString()}`,
                inline: true
            },
            {
                name: `Average Trophies`,
                value: `${brawlstarsEmojis.icons.trophy_normal} ${averageTrophies.toLocaleString()}`,
                inline: true
            },
            {
                name: `Average Required`,
                value: `${brawlstarsEmojis.icons.trophy_required} ${averageRequired.toLocaleString()}`,
                inline: true
            },
            {
                name: `Average Members`,
                value: `${brawlstarsEmojis.icons.members} ${averageMembers.toLocaleString()}`,
                inline: true
            },
            {
                name: `Members Information`,
                value: `${brawlstarsEmojis.role.member} **Members**: ${totalMemberRole.toLocaleString()}\n${brawlstarsEmojis.role.senior} **Seniors**: ${totalSeniorRole.toLocaleString()}\n${brawlstarsEmojis.role.vicePresident} **Vice-Presidents**: ${totalVicePresidentRole.toLocaleString()}\n${brawlstarsEmojis.role.president} **Presidents**: ${totalPresidentRole.toLocaleString()}\n\n${brawlstarsEmojis.icons.list} **Total Members**: ${totalMembers.toLocaleString()}`,
                inline: false
            }
        );

    const clubListEmbeds: MessageEmbed[] = [];

    splitChunk(allClubs.sort((a, b) => b.trophies - a.trophies), 12).forEach((clubs: AClub[]) => {
        const embed = new MessageEmbed(clubOverview.embeds.clubList);
        clubs.forEach((club) => {
            const president = club.members.find((member) => member.role === "president");
            const field = [
                `🔗 [Link: \`${club.tag}\`](https://brawlify.com/stats/club/${club.tag.replace("#", "")})`,
                `${brawlstarsEmojis.entrance[club.type] || brawlstarsEmojis.unknown} **${club.type}**`,
                `${brawlstarsEmojis.icons.trophy_highest_crown} **${club.trophies.toLocaleString()}**`,
                `${brawlstarsEmojis.icons.required_trophies}  **Req: ${club.requiredTrophies.toLocaleString()}**`,
                `${brawlstarsEmojis.role.member} **Mem: ${club.members.length}**`,
                `${brawlstarsEmojis.role.president} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`,
            ]
            embed.addField(club.name, field.join("\n"), true);
        });
        clubListEmbeds.push(embed);
    });

    const selectClubMenu = new MessageSelectMenu()
        .setCustomId(clubOverview.customId)
        .setPlaceholder("Select a club to view its stats!")
        .addOptions(allClubs.sort((a, b) => b.trophies - a.trophies).map((club) => {
            return {
                label: club.name,
                description: `${club.tag}`,
                value: club.tag,
            }
        }));

    return [
        { embeds: [clubInfoEmbed], content: null },
        ...clubListEmbeds.map((embed, index) => {
            if (index === clubListEmbeds.length - 1) return { embeds: [embed], content: null, components: [new MessageActionRow().setComponents(selectClubMenu)] };
            else return { embeds: [embed], content: null };
        })
    ] as MessageOptions[];
}