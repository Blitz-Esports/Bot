"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasePlayerCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const framework_1 = require("@sapphire/framework");
const brawlstars_1 = require("../../lib/api/brawlstars");
const embed_1 = require("../../lib/constants/embed");
let DatabasePlayerCommand = class DatabasePlayerCommand extends framework_1.Command {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "splitChunk", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (array, chunk) => {
                const inputArray = array;
                var perChunk = chunk || 15;
                var result = inputArray.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / perChunk);
                    if (!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                }, []);
                return result;
            }
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply();
        if (!(await this.checkPermissions(interaction)))
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("You don't have the required permissions to use this command.")] });
        const subcommandName = interaction.options.getSubcommand();
        if (subcommandName === "add") {
            const user = interaction.options.getUser("user");
            const tag = interaction.options.getString("tag");
            const existingPlayer = await this.container.database.models.player.findOne({ where: { id: user.id } });
            if (existingPlayer)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("The user already has a tag saved in the database.")] });
            const player = await (0, brawlstars_1.getPlayer)(tag);
            if (!player)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`Unable to fetch the player with the tag: **${tag}**.`)] });
            await this.container.database.models.player.create({
                id: user.id,
                tag: player.tag,
                name: player.name
            });
            return interaction.editReply({ embeds: [(0, embed_1.successEmbed)(`Added the ${user.toString()} to the database with name: **${player.name}** and tag: **${player.tag}**.`)] });
        }
        else if (subcommandName === "remove") {
            const user = interaction.options.getUser("user");
            const tag = interaction.options.getString("tag");
            if (!(user || tag))
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("You need to provide a user and a tag to remove the player from the database.")] });
            let existingPlayer = await this.container.database.models.player.findOne({ where: { id: user?.id } });
            if (!existingPlayer)
                existingPlayer = await this.container.database.models.player.findOne({ where: { tag } });
            if (!existingPlayer)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("The user or tag provided doesn't exist in the database.")] });
            await this.container.database.models.player.destroy({ where: { id: user?.id } });
            return interaction.editReply({ embeds: [(0, embed_1.successEmbed)(`Removed ${user?.toString()} from the database.`)] });
        }
        else if (subcommandName === "list") {
            const apiMessage = await interaction.editReply({ embeds: [(0, embed_1.loadingEmbed)("Please wait loading....")] });
            const message = await interaction.channel?.messages.fetch(apiMessage.id);
            if (!message)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to resolve the message.")] });
            const allPlayers = (await this.container.database.models.player.findAll()).map((player) => player.toJSON());
            const pagination = new discord_js_utilities_1.PaginatedMessage();
            this.splitChunk(allPlayers, 10).map((player) => {
                pagination.addPageEmbed((embed) => {
                    return embed
                        .setDescription(player.map((p, i) => `❯ ${++i}: <@!${p.id}>\n　└─ (${p.tag}) ${p.name}`).join("\n"))
                        .setColor("ORANGE");
                });
            });
            await pagination.run(message, interaction.user);
        }
        return;
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "add",
                    description: "Adds a player to the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "The user to add to the database.",
                            type: "USER",
                            required: true
                        },
                        {
                            name: "tag",
                            description: "The tag to add to the database.",
                            type: "STRING",
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Removes a player from the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "The user to remove from the database.",
                            type: "USER"
                        },
                        {
                            name: "tag",
                            description: "The tag to remove from the database.",
                            type: "STRING"
                        }
                    ]
                },
                {
                    name: "list",
                    description: "Lists all players in the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "show",
                            description: "Shows the list of players.",
                            type: "BOOLEAN",
                            required: false
                        }
                    ]
                }
            ]
        }, {
            guildIds: [this.container.config.bot.guilds.dev, this.container.config.bot.guilds.main],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */
        });
    }
    async resolveMember(interaction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        return member;
    }
    async checkPermissions(interaction) {
        const member = await this.resolveMember(interaction);
        if (member?.permissions.has("ADMINISTRATOR"))
            return true;
        else
            return false;
    }
};
DatabasePlayerCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "database-player",
        description: "This command is used to manage the database.",
        requiredUserPermissions: ["ADMINISTRATOR"]
    })
], DatabasePlayerCommand);
exports.DatabasePlayerCommand = DatabasePlayerCommand;
//# sourceMappingURL=database-player.js.map