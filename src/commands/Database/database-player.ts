import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction, User } from 'discord.js';
import { getPlayer } from '../../lib/api/brawlstars';
import { failEmbed, loadingEmbed, successEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "database-player",
    description: "This command is used to manage the database.",
    requiredUserPermissions: ["ADMINISTRATOR"]
})
export class DatabasePlayerCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();
        if (!(await this.checkPermissions(interaction))) return interaction.editReply({ embeds: [failEmbed("You don't have the required permissions to use this command.")] });

        const subcommandName = interaction.options.getSubcommand();

        if (subcommandName === "add") {
            const user = interaction.options.getUser("user") as User;
            const tag = interaction.options.getString("tag") as string;

            const existingPlayer = await this.container.database.models.player.findOne({ where: { id: user.id } });
            if (existingPlayer) return interaction.editReply({ embeds: [failEmbed("The user already has a tag saved in the database.")] });

            const player = await getPlayer(tag);
            if (!player) return interaction.editReply({ embeds: [failEmbed(`Unable to fetch the player with the tag: **${tag}**.`)] });

            await this.container.database.models.player.create({
                id: user.id,
                tag: player.tag,
                name: player.name
            });

            return interaction.editReply({ embeds: [successEmbed(`Added the ${user.toString()} to the database with name: **${player.name}** and tag: **${player.tag}**.`)] });
        }

        else if (subcommandName === "remove") {
            const user = interaction.options.getUser("user");
            const tag = interaction.options.getString("tag");

            if (!(user || tag)) return interaction.editReply({ embeds: [failEmbed("You need to provide a user and a tag to remove the player from the database.")] });

            let existingPlayer = await this.container.database.models.player.findOne({ where: { id: user?.id } });
            if (!existingPlayer) existingPlayer = await this.container.database.models.player.findOne({ where: { tag } });

            if (!existingPlayer) return interaction.editReply({ embeds: [failEmbed("The user or tag provided doesn't exist in the database.")] });

            await this.container.database.models.player.destroy({ where: { id: user?.id } });

            return interaction.editReply({ embeds: [successEmbed(`Removed ${user?.toString()} from the database.`)] });
        }

        else if (subcommandName === "list") {
            const apiMessage = await interaction.editReply({ embeds: [loadingEmbed("Please wait loading....")] });

            const message = await interaction.channel?.messages.fetch(apiMessage.id);
            if (!message) return interaction.editReply({ embeds: [failEmbed("Unable to resolve the message.")] });

            const allPlayers = (await this.container.database.models.player.findAll()).map((player) => player.toJSON());

            const pagination = new PaginatedMessage();
            this.splitChunk(allPlayers, 10).map((player) => {
                pagination.addPageEmbed((embed) => {
                    return embed
                        .setDescription(player.map((p: any, i: number) => `❯ ${++i}: <@!${p.id}>\n　└─ (${p.tag}) ${p.name}`).join("\n"))
                        .setColor("ORANGE");
                });
            });

            await pagination.run(message, interaction.user);
        }

        return;
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
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

            },
            {
                guildIds: [this.container.config.bot.guilds.dev, this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }

    private async resolveMember(interaction: CommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        return member;
    }

    private async checkPermissions(interaction: CommandInteraction) {
        const member = await this.resolveMember(interaction);
        if (member?.permissions.has("ADMINISTRATOR")) return true;
        else return false;
    }

    private splitChunk = (array: any[], chunk?: number) => {
        const inputArray = array;
        var perChunk = chunk || 15;
        var result = inputArray.reduce((resultArray: any[], item: any, index: number) => {
            const chunkIndex = Math.floor(index / perChunk)
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []
            }
            resultArray[chunkIndex].push(item)
            return resultArray
        }, [])
        return result;
    }

}