import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import axios from 'axios';
import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { upload } from '../../lib/api/onlyfans';
import { failEmbed, successEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "onlyfans",
    description: "Manage your BLITZ OnlyFans account directly from discord!"
})
export class DatabasePlayerCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {

        const subcommandName = interaction.options.getSubcommand();

        if (subcommandName === "link") {

            const token = nanoid();
            await this.container.database.models.token.create({
                id: token,
                userId: interaction.user.id,
                expires: moment().add(this.container.config.features.embedBuilder.tokenExpireTimeout, "milliseconds").toDate()
            });

            await interaction.user.send({
                embeds: [
                    new MessageEmbed()
                        .addField("Click On The Link To Link Your BLITZ OnlyFans Account", `[${this.container.config.server.host}/onlyfans](${this.container.config.server.host}/onlyfans?token=${token})`)
                        .setColor(this.container.config.default.colors.theme as ColorResolvable)
                ]
            })

            await interaction.reply({ embeds: [successEmbed(`${interaction.user.toString()}, check your DMs for the auth link.`)] });

        }

        else if (subcommandName === "upload") {
            await interaction.deferReply({ ephemeral: true });

            const account = await this.fetchAccount(interaction.user.id);
            if (!account) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, you don't have the BLITZ OnlyFans account linked to your discord account.`)] });

            const url = interaction.options.getString("url") as string;
            if (!(await this.validateURL(url))) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, the url you provided is not valid.\nSupported file formats: ${this.validFormats.join(", ")}`)] });

            const uploadData = await upload(url, account);
            if (!uploadData || !uploadData.status) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, unable to post the data to the api. Please try again later.`)] });

            await interaction.editReply({ content: `Uploaded the file to your BLITZ Only Fans account.\nURL: ${uploadData.url}` });

        }

        return;
    }

    private async fetchAccount(userId: string) {
        const account = await this.container.database.models.onlyfan.findOne({
            where: {
                userId
            }
        });
        return account ? account.toJSON() : null;
    }

    readonly validFormats = ["jpg", "png", "gif", "jpeg"];

    private async validateURL(url: string) {
        try {
            const link = new URL(url);
            if (!this.validFormats.includes(link.pathname.split(".").pop() ?? "null")) return false;
            const file = await axios.get(url);
            if (file.status !== 200) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: "link",
                        description: "Link your discord account to BLITZ OnlyFans account.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "me",
                                description: "Your BLITZ OnlyFans account will be linked to your discord account.",
                                type: "BOOLEAN",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "upload",
                        description: "Upload file to your BLITZ Only Fans account.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "url",
                                description: "The url of the file to upload.",
                                type: "STRING",
                                required: true
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

}