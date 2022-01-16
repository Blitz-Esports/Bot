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
            const tag = interaction.options.getString("tag");
            const role = interaction.options.getRole("role");
            const club = await (0, brawlstars_1.getClub)(tag);
            if (!club)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`Unable to fetch club with the tag: **${tag}**.`)] });
            const existingClub = await this.container.database.models.club.findOne({ where: { id: club.tag } });
            if (existingClub)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`The club **${club.name}** (${club.tag}) already exists in the database.`)] });
            await this.container.database.models.club.create({
                id: club.tag,
                name: club.name,
                rawData: club,
                roleId: role?.id ?? null,
            });
            return interaction.editReply({ embeds: [(0, embed_1.successEmbed)(`Successfully added the club **${club.name}** (${club.tag}) with role: ${role?.toString() || "Unknown"} to the database.`)] });
        }
        else if (subcommandName === "remove") {
            const tag = interaction.options.getString("tag");
            const existingClub = await this.container.database.models.club.findOne({ where: { id: `#${tag.toUpperCase().replace("#", "")}` } });
            if (!existingClub)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`The club with tag: **${tag}**, does not exist in the database.`)] });
            await existingClub.destroy();
            return interaction.editReply({ embeds: [(0, embed_1.successEmbed)(`Successfully removed the club with name: **${existingClub.toJSON().name}** tag: **${existingClub.toJSON().id}** from the database.`)] });
        }
        else if (subcommandName === "list") {
            const apiMessage = await interaction.editReply({ embeds: [(0, embed_1.loadingEmbed)("Please wait loading....")] });
            const message = await interaction.channel?.messages.fetch(apiMessage.id);
            if (!message)
                return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to resolve the message.")] });
            const allClubs = (await this.container.database.models.club.findAll()).map((club) => club.toJSON());
            const pagination = new discord_js_utilities_1.PaginatedMessage();
            let i = 0;
            this.splitChunk(allClubs, 10).map((clubs) => {
                pagination.addPageEmbed((embed) => {
                    return embed
                        .setDescription(clubs.map((club) => `❯ ${++i}: ${club.roleId ? `<@&${club.roleId}>` : "No Role"}\n　└─ (${club.id}) ${club.name}`).join("\n"))
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
                    description: "Adds a club to the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "tag",
                            description: "The tag to add to the database.",
                            type: "STRING",
                            required: true
                        },
                        {
                            name: "role",
                            description: "The club role that will be assigned to the club members.",
                            type: "ROLE",
                            required: false
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Removes a club from the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "tag",
                            description: "[# Case Sensitive] The tag to remove from the database.",
                            type: "STRING",
                            required: true
                        }
                    ]
                },
                {
                    name: "list",
                    description: "Lists all clubs in the database.",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "show",
                            description: "Shows the list of clubs.",
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
        name: "database-club",
        description: "This command is used to manage the database.",
        requiredUserPermissions: ["ADMINISTRATOR"]
    })
], DatabasePlayerCommand);
exports.DatabasePlayerCommand = DatabasePlayerCommand;
//# sourceMappingURL=database-club.js.map