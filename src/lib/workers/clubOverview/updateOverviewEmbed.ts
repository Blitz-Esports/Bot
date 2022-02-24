import { container } from "@sapphire/framework";
import { InteractionCollector, MessageEmbed, TextChannel } from "discord.js";
import config from "../../../config";
import { brawlstarsEmojis, getClub } from "../../api/brawlstars/brawlstars";
import { buildOverviewEmbed } from "./buildOverviewEmbed";
import { list } from "./modules";

const { clubOverview } = config.features;

export const updateOverviewEmbed = async () => {

    const channel = container.client.channels.cache.get(clubOverview.channelId) as TextChannel | undefined;
    if (!channel) return container.logger.debug("Could not find club overview channel");

    buildOverviewEmbed;
    setInterval(async () => {
        try {
            const payloads = await buildOverviewEmbed();
            payloads.forEach(async (payload, i) => {
                if (clubOverview.messages[i]) {
                    const message = await channel.messages.fetch(clubOverview.messages[i]);
                    if (message) await message.edit(payload);
                }
            });
        } catch (e) { }
    }, clubOverview.updateInterval);

    selectClubMenuCollector(channel);
}

const selectClubMenuCollector = async (channel: TextChannel) => {
    const collector = new InteractionCollector(container.client, { interactionType: "MESSAGE_COMPONENT", channel: channel, filter: (interaction) => interaction.isSelectMenu() && interaction.customId === clubOverview.customId });

    collector.on("collect", async (interaction) => {
        if (!interaction.isSelectMenu()) return;
        const club = await getClub(interaction.values[0]);
        if (!club) return interaction.reply({ content: "An unexpected error occurred while fetching the club data.", ephemeral: true });

        const president = club.members.find(m => m.role === "president");
        const infoEmbed = new MessageEmbed()
            .setThumbnail(`https://cdn.brawlify.com/club/${club.badgeId}.png`)
            .setAuthor({ name: `${club.name} (${club.tag})`, iconURL: `https://cdn.brawlify.com/club/${club.badgeId}.png`, url: `https://brawlify.com/stats/club/${club.tag.replace("#", "")}` })
            .addField("Trophies", `${brawlstarsEmojis.icons.trophy_club} ${club.trophies.toLocaleString()}`, true)
            .addField("Required Trophies", `${brawlstarsEmojis.icons.required_trophies} ${club.requiredTrophies.toLocaleString()}`, true)
            .addField("Entrance", `${brawlstarsEmojis.entrance[club.type] || brawlstarsEmojis.unknown} **${club.type}**`, true)
            .addField("Current Members", `${brawlstarsEmojis.role.member} \`${club.members.length}\``, true)
            .addField("Trophy Range", `${brawlstarsEmojis.icons.trophy_required} \`${club.members.sort((a, b) => b.trophies - a.trophies)[0].trophies.toLocaleString()}\` - \`${club.members.sort((a, b) => a.trophies - b.trophies)[0].trophies.toLocaleString()}\``, true)
            .addField("President", `${brawlstarsEmojis.icons.crown} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`, true)
            .addField("Description", `${club.description || "No Description"}`, false)
            .addField(`Top Members (${list(club, "member").length})`, list(club, "member").join("\n"), true)
            .addField(`Top Seniors (${list(club, "senior").length})`, list(club, "senior").join("\n"), true)
            .addField(`Top Presidents (${list(club, "vicePresident").length} + 1)`, list(club, "vicePresident").join("\n"), true)

        const graphEmbed = new MessageEmbed()
            .setImage(`${config.server.host}/club/${club.tag.replace("#", "")}/graph?${Date.now()}`);

        interaction.reply({ embeds: [infoEmbed, graphEmbed], ephemeral: true });
    });

}