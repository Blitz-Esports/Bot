"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const brawlstars_1 = require("../../lib/api/brawlstars");
const embed_1 = require("../../lib/constants/embed");
let clubCommand = class clubCommand extends framework_1.Command {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "list", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (club, role) => {
                let r = [role];
                if (role === "vicePresident")
                    r = ["president", role];
                const list = club.members.filter((x) => r.includes(x.role)).sort((a, b) => b.trophies - a.trophies).map((m) => `${brawlstars_1.brawlstarsEmojis.role[m.role] || brawlstars_1.brawlstarsEmojis.unknown}\`${m.trophies}\` [${m.name}](https://brawlify.com/stats/profile/${m.tag.replace("#", "")})`).slice(0, 5);
                return list.length === 0 ? ["- None -"] : list;
            }
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply();
        let tag = null;
        if (interaction.options.get("me", false)) {
            const user = await this.container.database.models.player.findOne({ where: { id: interaction.user.id } });
            if (!user)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("You don't have any profile saved in the database.\nTo save your profile use `/save` command.")] });
            tag = user.toJSON().tag;
        }
        else if (interaction.options.get("tag", false)) {
            const club = await (0, brawlstars_1.getClub)(interaction.options.getString("tag"));
            if (!club)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to find the stats of the club. The club's tag is invalid or the game is under maintainance.")] });
            console.log(club);
            return interaction.editReply({ embeds: this.makeEmbed(club) });
        }
        else if (interaction.options.get("user", false)) {
            const target = interaction.options.getUser("user", true);
            const user = await this.container.database.models.player.findOne({ where: { id: target.id } });
            if (!user)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`${target.toString()}, don't have any tag saved in the database.`)] });
            tag = user.toJSON().tag;
        }
        else {
            const me = await this.container.database.models.player.findOne({ where: { id: interaction.user.id } });
            if (!me)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("You don't have any profile saved in the database.\nTo save your profile use `/save` command.")] });
            tag = me.toJSON().tag;
        }
        if (!tag)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to resolve tag.")] });
        const player = await (0, brawlstars_1.getPlayer)(tag);
        if (!player)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to fetch the club of the player. The player's tag is invalid or the game is under maintainance.")] });
        if (!player.club.tag)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("The player is not in any club.")] });
        const club = await (0, brawlstars_1.getClub)(player.club.tag);
        if (!club)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to fetch the club stats. The club's tag is invalid or the game is under maintainance.")] });
        return interaction.editReply({ embeds: this.makeEmbed(club) });
    }
    makeEmbed(clubData) {
        const president = clubData.members.find(m => m.role === "president");
        const infoEmbed = new discord_js_1.MessageEmbed()
            .setColor("ORANGE")
            .setThumbnail(`https://cdn.brawlify.com/club/${clubData.badgeId}.png`)
            .setAuthor({ name: `${clubData.name} (${clubData.tag})`, iconURL: `https://cdn.brawlify.com/club/${clubData.badgeId}.png`, url: `https://brawlify.com/stats/club/${clubData.tag.replace("#", "")}` })
            .addField("Trophies", `${brawlstars_1.brawlstarsEmojis.icons.trophy_club} ${clubData.trophies.toLocaleString()}`, true)
            .addField("Required Trophies", `${brawlstars_1.brawlstarsEmojis.icons.required_trophies} ${clubData.requiredTrophies.toLocaleString()}`, true)
            .addField("Entrance", `${brawlstars_1.brawlstarsEmojis.entrance[clubData.type] || brawlstars_1.brawlstarsEmojis.unknown} **${clubData.type}**`, true)
            .addField("Current Members", `${brawlstars_1.brawlstarsEmojis.role.member} \`${clubData.members.length}\``, true)
            .addField("Trophy Range", `${brawlstars_1.brawlstarsEmojis.icons.trophy_required} \`${clubData.members.sort((a, b) => b.trophies - a.trophies)[0].trophies.toLocaleString()}\` - \`${clubData.members.sort((a, b) => a.trophies - b.trophies)[0].trophies.toLocaleString()}\``, true)
            .addField("President", `${brawlstars_1.brawlstarsEmojis.icons.crown} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`, true)
            .addField("Description", `${clubData.description || "No Description"}`, false)
            .addField(`Top Members (${this.list(clubData, "member").length})`, this.list(clubData, "member").join("\n"), true)
            .addField(`Top Seniors (${this.list(clubData, "senior").length})`, this.list(clubData, "senior").join("\n"), true)
            .addField(`Top Presidents (${this.list(clubData, "vicePresident").length} + 1)`, this.list(clubData, "vicePresident").join("\n"), true);
        const graphEmbed = new discord_js_1.MessageEmbed()
            .setImage(`https://share.brawlify.com/club-graph/${clubData.tag.replace("#", "")}?${Date.now()}`)
            .setFooter({ text: "Graph Data Provided by BrawlAPI", iconURL: `https://cdn.brawlify.com/front/Star.png` })
            .setTimestamp();
        return [infoEmbed, graphEmbed];
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: 'me',
                    description: 'Shows your club stats.',
                    type: 'BOOLEAN',
                    required: false
                },
                {
                    name: 'tag',
                    description: 'Any club TAG from Brawl Stars.',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'user',
                    description: "Check someone else's club.",
                    type: 'USER',
                    required: false
                }
            ]
        }, {
            guildIds: [this.container.config.bot.guilds.main],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */
        });
    }
};
clubCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "club",
        description: "Check stats of any club in Brawl Stars.",
    })
], clubCommand);
exports.clubCommand = clubCommand;
//# sourceMappingURL=club.js.map