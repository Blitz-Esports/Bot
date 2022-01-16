"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOverviewEmbed = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const brawlstars_1 = require("../../api/brawlstars");
const modules_1 = require("./modules");
const { clubOverview } = config_1.default.features;
const buildOverviewEmbed = async () => {
    const allClubs = (await framework_1.container.database.models.club.findAll({})).map((club) => club.toJSON().rawData);
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
    const clubInfoEmbed = new discord_js_1.MessageEmbed(clubOverview.embeds.clubInfo)
        .setTimestamp()
        .addFields({
        name: `Total Clubs`,
        value: `${brawlstars_1.brawlstarsEmojis.icons.club} ${totalClubs.toLocaleString()}`,
        inline: true
    }, {
        name: `Total Trophies`,
        value: `${brawlstars_1.brawlstarsEmojis.icons.trophy_club} ${totalTrophies.toLocaleString()}`,
        inline: true
    }, {
        name: `Average Trophies`,
        value: `${brawlstars_1.brawlstarsEmojis.icons.trophy_normal} ${averageTrophies.toLocaleString()}`,
        inline: true
    }, {
        name: `Average Required`,
        value: `${brawlstars_1.brawlstarsEmojis.icons.trophy_required} ${averageRequired.toLocaleString()}`,
        inline: true
    }, {
        name: `Average Members`,
        value: `${brawlstars_1.brawlstarsEmojis.icons.members} ${averageMembers.toLocaleString()}`,
        inline: true
    }, {
        name: `Members Information`,
        value: `${brawlstars_1.brawlstarsEmojis.role.member} **Members**: ${totalMemberRole.toLocaleString()}\n${brawlstars_1.brawlstarsEmojis.role.senior} **Seniors**: ${totalSeniorRole.toLocaleString()}\n${brawlstars_1.brawlstarsEmojis.role.vicePresident} **Vice-Presidents**: ${totalVicePresidentRole.toLocaleString()}\n${brawlstars_1.brawlstarsEmojis.role.president} **Presidents**: ${totalPresidentRole.toLocaleString()}\n\n${brawlstars_1.brawlstarsEmojis.icons.list} **Total Members**: ${totalMembers.toLocaleString()}`,
        inline: false
    });
    const clubListPayload = [];
    (0, modules_1.splitChunk)(allClubs.sort((a, b) => b.trophies - a.trophies), 12).forEach((clubs) => {
        const embed = new discord_js_1.MessageEmbed(clubOverview.embeds.clubList);
        clubs.forEach((club) => {
            const president = club.members.find((member) => member.role === "president");
            const field = [
                `🔗 [Link: \`${club.tag}\`](https://brawlify.com/stats/club/${club.tag.replace("#", "")})`,
                `${brawlstars_1.brawlstarsEmojis.entrance[club.type] || brawlstars_1.brawlstarsEmojis.unknown} **${club.type}**`,
                `${brawlstars_1.brawlstarsEmojis.icons.trophy_highest_crown} **${club.trophies.toLocaleString()}**`,
                `${brawlstars_1.brawlstarsEmojis.icons.required_trophies}  **Req: ${club.requiredTrophies.toLocaleString()}**`,
                `${brawlstars_1.brawlstarsEmojis.role.member} **Mem: ${club.members.length}**`,
                `${brawlstars_1.brawlstarsEmojis.role.president} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`,
            ];
            embed.addField(club.name, field.join("\n"), true);
        });
        const selectClubMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId(clubOverview.customId)
            .setPlaceholder("Select a club to view its stats!")
            .addOptions(clubs.sort((a, b) => b.trophies - a.trophies).map((club) => {
            return {
                label: club.name,
                description: `${club.tag}`,
                value: club.tag,
            };
        }));
        clubListPayload.push({ embeds: [embed], components: [new discord_js_1.MessageActionRow().setComponents(selectClubMenu)] });
    });
    return [
        { embeds: [clubInfoEmbed], content: null },
        ...clubListPayload
    ];
};
exports.buildOverviewEmbed = buildOverviewEmbed;
//# sourceMappingURL=buildOverviewEmbed.js.map