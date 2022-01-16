"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const brawlstars_1 = require("../../lib/api/brawlstars");
const embed_1 = require("../../lib/constants/embed");
let UserCommand = class UserCommand extends framework_1.Command {
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
            tag = interaction.options.getString("tag");
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
        const apiResponse = await (0, brawlstars_1.getPlayer)(tag);
        if (!apiResponse)
            return {
                embeds: [(0, embed_1.failEmbed)("Unable to find the stats of the player. The user's tag is invalid or the game is under maintainance.")]
            };
        const payload = await this.makeEmbed(apiResponse);
        return interaction.editReply(payload);
    }
    async makeEmbed(apiResponse) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor(`#${apiResponse.nameColor.replace('0xff', '')}`)
            .setAuthor({ name: `${apiResponse.name} (${apiResponse.tag})`, iconURL: `https://cdn.brawlify.com/profile/${apiResponse.icon.id}.png`, url: `https://brawlify.com/stats/profile/${apiResponse.tag.replace("#", "")}` })
            .setImage(`https://share.brawlify.com/player-graph/${apiResponse.tag.replace('#', '')}?${Date.now()}`)
            .addFields([
            {
                name: 'Trophies',
                value: `${brawlstars_1.brawlstarsEmojis.icons.trophy_player} \`${apiResponse.trophies.toLocaleString()}\``,
                inline: true
            },
            {
                name: 'Highest Trophies',
                value: `${brawlstars_1.brawlstarsEmojis.icons.trophy_highest} \`${apiResponse.highestTrophies.toLocaleString()}\``,
                inline: true
            },
            {
                name: 'Level',
                value: `${brawlstars_1.brawlstarsEmojis.icons.exp} \`${apiResponse.expLevel}\``,
                inline: true
            },
            {
                name: 'Brawlers',
                value: `${brawlstars_1.brawlstarsEmojis.icons.brawlers} \`${apiResponse.brawlers.length}\``,
                inline: true
            },
            {
                name: 'Star Powers',
                value: `${brawlstars_1.brawlstarsEmojis.icons.star_powers} \`${apiResponse.brawlers
                    .map((blr) => blr.starPowers.length)
                    .reduce((a, b) => a + b)}\``,
                inline: true
            },
            {
                name: 'Gadgets',
                value: `${brawlstars_1.brawlstarsEmojis.icons.gadgets} \`${apiResponse.brawlers.map((blr) => blr.gadgets.length).reduce((a, b) => a + b)}\``,
                inline: true
            },
            {
                name: '3v3 Victories',
                value: `${brawlstars_1.brawlstarsEmojis.icons['3v3']} \`${apiResponse['3vs3Victories'].toLocaleString()}\``,
                inline: true
            },
            {
                name: 'Duo Victories',
                value: `${brawlstars_1.brawlstarsEmojis.icons.duo} \`${apiResponse.duoVictories.toLocaleString()}\``,
                inline: true
            },
            {
                name: 'Solo Victories',
                value: `${brawlstars_1.brawlstarsEmojis.icons.solo} \`${apiResponse.soloVictories.toLocaleString()}\``,
                inline: true
            },
            {
                name: 'Club Information',
                value: `${brawlstars_1.brawlstarsEmojis.icons.club} [${apiResponse.club.tag ? `${apiResponse.club.name}\n(${apiResponse.club.tag})` : 'No Club'}](https://brawlify.com/stats/club/${apiResponse.club.tag ? apiResponse.club.tag.replace('#', '') : 'No-Club'})`,
                inline: true
            }
        ]);
        const discordAccounts = (await this.container.database.models.player.findAll({ where: { tag: apiResponse.tag } })).map((player) => player.toJSON());
        if (discordAccounts.length > 0) {
            embed.addField('Discord Account(s)', `${config_1.default.default.emojis.discord} ${discordAccounts.map((account) => `<@!${account.id}>`).join(', ')}`, false);
        }
        return { embeds: [embed] };
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: 'me',
                    description: 'Shows your account stats.',
                    type: 'BOOLEAN',
                    required: false
                },
                {
                    name: 'tag',
                    description: 'Any Brawl Stars player tag.',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'user',
                    description: "Check someone else's stats.",
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
UserCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: 'profile',
        description: 'Check stats of any Brawl Stars profile.'
    })
], UserCommand);
exports.UserCommand = UserCommand;
//# sourceMappingURL=profile.js.map