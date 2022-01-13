import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getClub } from '../../lib/api/brawlstars';
import { failEmbed, loadingEmbed, successEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "database-club",
    description: "This command is used to manage the database.",
    requiredUserPermissions: ["ADMINISTRATOR"]
})
export class DatabasePlayerCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();
        if (!(await this.checkPermissions(interaction))) return interaction.editReply({ embeds: [failEmbed("You don't have the required permissions to use this command.")] });

        const subcommandName = interaction.options.getSubcommand();

        if (subcommandName === "add") {
            const tag = interaction.options.getString("tag") as string;
            const role = interaction.options.getRole("role");

            const club = await getClub(tag);
            if (!club) return interaction.editReply({ embeds: [failEmbed(`Unable to fetch club with the tag: **${tag}**.`)] });

            const existingClub = await this.container.database.models.club.findOne({ where: { id: club.tag } });
            if (existingClub) return interaction.editReply({ embeds: [failEmbed(`The club **${club.name}** (${club.tag}) already exists in the database.`)] });

            await this.container.database.models.club.create({
                id: club.tag,
                name: club.name,
                rawData: club,
                roleId: role?.id ?? null,
            });

            return interaction.editReply({ embeds: [successEmbed(`Successfully added the club **${club.name}** (${club.tag}) with role: ${role?.toString() || "Unknown"} to the database.`)] });
        }

        else if (subcommandName === "remove") {
            const tag = interaction.options.getString("tag") as string;

            const existingClub = await this.container.database.models.club.findOne({ where: { id: `#${tag.toUpperCase().replace("#", "")}` } });
            if (!existingClub) return interaction.editReply({ embeds: [failEmbed(`The club with tag: **${tag}**, does not exist in the database.`)] });

            await existingClub.destroy();

            return interaction.editReply({ embeds: [successEmbed(`Successfully removed the club with name: **${existingClub.toJSON().name}** tag: **${existingClub.toJSON().id}** from the database.`)] });
        }

        else if (subcommandName === "list") {
            const apiMessage = await interaction.editReply({ embeds: [loadingEmbed("Please wait loading....")] });

            const message = await interaction.channel?.messages.fetch(apiMessage.id);
            if (!message) return interaction.editReply({ embeds: [failEmbed("Unable to resolve the message.")] });

            const allClubs = (await this.container.database.models.club.findAll()).map((club) => club.toJSON());

            const pagination = new PaginatedMessage();
            const embedPages = this.splitChunk(allClubs, 10).map((clubs) => {
                return new MessageEmbed()
                    .setDescription(clubs.map((club: any, i: number) => `\`${++i})\` **${club.name}** (${club.id})`).join("\n"))
                    .setColor("ORANGE");
            });

            pagination.addPageEmbeds(embedPages);
            await pagination.run(message);
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

            },
            {
                guildIds: [this.container.config.bot.guilds.dev],
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