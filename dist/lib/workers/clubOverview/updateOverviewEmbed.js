"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOverviewEmbed = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const brawlstars_1 = require("../../api/brawlstars");
const buildOverviewEmbed_1 = require("./buildOverviewEmbed");
const modules_1 = require("./modules");
const { clubOverview } = config_1.default.features;
const updateOverviewEmbed = async () => {
    const channel = framework_1.container.client.channels.cache.get(clubOverview.channelId);
    if (!channel)
        return framework_1.container.logger.debug("Could not find club overview channel");
    buildOverviewEmbed_1.buildOverviewEmbed;
    setInterval(async () => {
        try {
            const payloads = await (0, buildOverviewEmbed_1.buildOverviewEmbed)();
            payloads.forEach(async (payload, i) => {
                if (clubOverview.messages[i]) {
                    const message = await channel.messages.fetch(clubOverview.messages[i]);
                    if (message)
                        await message.edit(payload);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }, clubOverview.updateInterval);
    selectClubMenuCollector(channel);
};
exports.updateOverviewEmbed = updateOverviewEmbed;
const selectClubMenuCollector = async (channel) => {
    const collector = new discord_js_1.InteractionCollector(framework_1.container.client, { interactionType: "MESSAGE_COMPONENT", channel: channel, filter: (interaction) => interaction.isSelectMenu() && interaction.customId === clubOverview.customId });
    collector.on("collect", async (interaction) => {
        if (!interaction.isSelectMenu())
            return;
        const club = await (0, brawlstars_1.getClub)(interaction.values[0]);
        if (!club)
            return interaction.reply({ content: "An unexpected error occurred while fetching the club data.", ephemeral: true });
        const president = club.members.find(m => m.role === "president");
        const infoEmbed = new discord_js_1.MessageEmbed()
            .setThumbnail(`https://cdn.brawlify.com/club/${club.badgeId}.png`)
            .setAuthor({ name: `${club.name} (${club.tag})`, iconURL: `https://cdn.brawlify.com/club/${club.badgeId}.png`, url: `https://brawlify.com/stats/club/${club.tag.replace("#", "")}` })
            .addField("Trophies", `${brawlstars_1.brawlstarsEmojis.icons.trophy_club} ${club.trophies.toLocaleString()}`, true)
            .addField("Required Trophies", `${brawlstars_1.brawlstarsEmojis.icons.required_trophies} ${club.requiredTrophies.toLocaleString()}`, true)
            .addField("Entrance", `${brawlstars_1.brawlstarsEmojis.entrance[club.type] || brawlstars_1.brawlstarsEmojis.unknown} **${club.type}**`, true)
            .addField("Current Members", `${brawlstars_1.brawlstarsEmojis.role.member} \`${club.members.length}\``, true)
            .addField("Trophy Range", `${brawlstars_1.brawlstarsEmojis.icons.trophy_required} \`${club.members.sort((a, b) => b.trophies - a.trophies)[0].trophies.toLocaleString()}\` - \`${club.members.sort((a, b) => a.trophies - b.trophies)[0].trophies.toLocaleString()}\``, true)
            .addField("President", `${brawlstars_1.brawlstarsEmojis.icons.crown} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`, true)
            .addField("Description", `${club.description || "No Description"}`, false)
            .addField(`Top Members (${(0, modules_1.list)(club, "member").length})`, (0, modules_1.list)(club, "member").join("\n"), true)
            .addField(`Top Seniors (${(0, modules_1.list)(club, "senior").length})`, (0, modules_1.list)(club, "senior").join("\n"), true)
            .addField(`Top Presidents (${(0, modules_1.list)(club, "vicePresident").length} + 1)`, (0, modules_1.list)(club, "vicePresident").join("\n"), true);
        const graphEmbed = new discord_js_1.MessageEmbed()
            .setImage(`https://share.brawlify.com/club-graph/${club.tag.replace("#", "")}?${Date.now()}`)
            .setFooter({ text: "Graph Data Provided by BrawlAPI", iconURL: `https://cdn.brawlify.com/front/Star.png` })
            .setTimestamp();
        interaction.reply({ embeds: [infoEmbed, graphEmbed], ephemeral: true });
    });
};
//# sourceMappingURL=updateOverviewEmbed.js.map