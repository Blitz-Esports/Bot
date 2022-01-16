"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
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
        const payload = await this.makeResponse(apiResponse);
        if (!payload)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("An error occurred while making the brawler list card.")] });
        return interaction.editReply(payload);
    }
    async makeResponse(apiResponse) {
        const imageCards = await (0, brawlstars_1.generateBrawlerListCard)(apiResponse);
        return { files: imageCards };
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
        name: 'brawlers',
        description: 'Check brawler progression of any Brawl Stars profile.'
    })
], UserCommand);
exports.UserCommand = UserCommand;
//# sourceMappingURL=brawlers.js.map