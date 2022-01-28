import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { ColorResolvable, CommandInteraction, MessageEmbed, TextChannel } from 'discord.js';
import {MessageLinkRegex} from "@sapphire/discord-utilities";
import moment from 'moment';
import { nanoid } from 'nanoid';
import { failEmbed, successEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "embedbuilder",
    description: "Build, manage and send embeds using the bot.",
    requiredUserPermissions: ["ADMINISTRATOR"]
})
export class DatabasePlayerCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        if (!(await this.checkPermissions(interaction))) return interaction.reply({ embeds: [failEmbed("You don't have the required permissions to use this command.")] });

        const subcommandName = interaction.options.getSubcommand();

        if (subcommandName === "create") {

            const token = nanoid();
            await this.container.database.models.token.create({
                id: token,
                userId: interaction.user.id,
                expires: moment().add(this.container.config.features.embedBuilder.tokenExpireTimeout, "milliseconds").toDate()
            });

            await interaction.user.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Embed Builder Session")
                        .addField(`Token (private)`, `||${token}||`)
                        .addField(`Session URL`, `[${this.container.config.server.host}/embed](${this.container.config.server.host}/embed?token=${token})`, true)
                        .addField(`Expiration`, `<t:${moment().add(this.container.config.features.embedBuilder.tokenExpireTimeout, "milliseconds").unix()}:R>`, true)
                        .setColor(this.container.config.default.colors.theme as ColorResolvable)
                ]
            })

            await interaction.reply({ embeds: [successEmbed(`Created a new session for ${interaction.user.toString()}. Kindly check your DM for url.`)] });

        }

        else if (subcommandName === "send") {

            const fetchData = await this.container.database.models.token.findAll({
                limit: 1,
                where: interaction.options.getString("token") ? { id: interaction.options.getString("token") } : { userId: interaction.user.id },
                order: [["createdAt", "DESC"]]
            });
            if (!fetchData[0]) return interaction.reply({ embeds: [failEmbed(`You don't have a session open. Run \`/${this.name} create\` to start a new embed builder session.`)] });
            const data = fetchData[0].toJSON().metaData;
            if (!data || data === {}) return interaction.reply({ embeds: [failEmbed(`You don't have a session open. Run \`/${this.name} create\` to start a new embed builder session.`)] });

            const destination = interaction.options.getChannel("channel") || interaction.channel;
            if (!destination) return interaction.reply({ embeds: [failEmbed("You need to specify a channel to send the embed to.")] });

            if (destination.type === "GUILD_TEXT" || destination.type === "GUILD_NEWS" || destination.type === "GUILD_PUBLIC_THREAD" || destination.type === "GUILD_PRIVATE_THREAD") {

                const msg = await destination.send({ content: data.content, embeds: Object.keys(data.embed ?? {}).length > 0 ? [new MessageEmbed(data.embed)] : undefined });
                await interaction.reply({ embeds: [successEmbed(`Sent the embed to ${destination.toString()}. [View sent message](${msg.url}).`)] });

            }
            else {
                return interaction.reply({ embeds: [failEmbed("You can only send embeds to text based channels.")] });
            }

        }

        else if (subcommandName === "update") {

            const fetchData = await this.container.database.models.token.findAll({
                limit: 1,
                where: interaction.options.getString("token") ? { id: interaction.options.getString("token") } : { userId: interaction.user.id },
                order: [["createdAt", "DESC"]]
            });
            if (!fetchData[0]) return interaction.reply({ embeds: [failEmbed(`You don't have a session open. Run \`/${this.name} create\` to start a new embed builder session.`)] });
            const data = fetchData[0].toJSON().metaData;
            if (!data || data === {}) return interaction.reply({ embeds: [failEmbed(`You don't have a session open. Run \`/${this.name} create\` to start a new embed builder session.`)] });

            const messageUrl = interaction.options.getString("message-url") ?? "null";
            if(!MessageLinkRegex.test(messageUrl))return interaction.reply({embeds: [failEmbed("You need to specify a valid message url.")]});

            const messageData = MessageLinkRegex.exec(messageUrl);
            if(!messageData?.groups) return interaction.reply({embeds: [failEmbed("You need to specify a valid message url.")]});

            const channel = await this.container.client.channels.fetch(messageData.groups.channelId) as TextChannel | null;
            if(!channel) return interaction.reply({embeds: [failEmbed("I don't have access to the message text channel.")]});

            const oldMessage = await channel.messages.fetch(messageData.groups.messageId);
            if(!oldMessage) return interaction.reply({embeds: [failEmbed("Unable to fetch the message.")]});
            else if(oldMessage.author.id !== oldMessage.guild?.me?.id)return interaction.reply({embeds: [failEmbed("That message is not sent by me.")]});

            await oldMessage.edit({ content: data.content, embeds: Object.keys(data.embed ?? {}).length > 0 ? [new MessageEmbed(data.embed)] : null });
            await interaction.reply({ embeds: [successEmbed(`Updated the embed in ${channel.toString()}. [View edited message](${oldMessage.url}).`)] });
        
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
                        name: "send",
                        description: "Send the embed to a channel.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "channel",
                                description: "The channel to send the embed to.",
                                type: "CHANNEL",
                                required: false
                            },
                            {
                                name: "token",
                                description: "The token used for the creation of the embed.",
                                type: "STRING",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "update",
                        description: "Update a existing message with a new embed.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "message-url",
                                description: "The message-url of the message to update.",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "token",
                                description: "The token used for the creation of the embed.",
                                type: "STRING",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "create",
                        description: "Creates a new embed builder session.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "new",
                                description: "Create a new embed builder session.",
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

}