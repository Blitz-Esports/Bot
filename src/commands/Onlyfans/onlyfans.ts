import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import axios from 'axios';
import { ColorResolvable, CommandInteraction, Message, MessageContextMenuInteraction, MessageEmbed } from 'discord.js';
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

            const url = interaction.options.getString("image-url") as string;
            if (!(await this.validateURL(url))) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, the url you provided is not valid.\nSupported file formats: ${this.validFormats.join(", ")}`)] });

            const uploadData = await upload(url, account);
            if (!uploadData || !uploadData.status) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, unable to post the data to the api. Please try again later.`)] });

            await interaction.editReply({ content: `Uploaded the file to your BLITZ Only Fans account.\nURL: ${uploadData.share}` });

        }

        return;
    }

    public override async contextMenuRun(interaction: MessageContextMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const account = await this.fetchAccount(interaction.user.id);
        if (!account) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, you don't have the BLITZ OnlyFans account linked to your discord account.`)] });

        const imageUrls = await this.extractImages(interaction.targetMessage as Message);
        if (imageUrls.length === 0) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, no images were found in the message.`)] });

        const uploadData = (await Promise.all(imageUrls.map((url) => upload(url, account)))).filter((data) => data !== null && data.status);
        if (uploadData.length === 0) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, unable to post the data to the api. Please try again later.`)] });

        return interaction.editReply({
            content: `Uploaded the file to your BLITZ Only Fans account.\nURL: ${uploadData.filter((data) => data !== null).map((data) => data?.share).join("\n")}`
        })
    }

    private async fetchAccount(userId: string) {
        const account = await this.container.database.models.onlyfan.findOne({
            where: {
                userId
            }
        });
        return account ? account.toJSON() : null;
    }

    private readonly validFormats = ["jpg", "png", "gif", "jpeg"];

    private async validateURL(url: string) {
        try {
            const link = new URL(url);
            const res = await axios.get(link.toString());
            if (res.status !== 200) return false;
            const contentType = res.headers["content-type"];
            if (!contentType) return false;
            if (!contentType.startsWith("image/")) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    private async extractImages(message: Message) {
        const imageRegex = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm);
        const contentMatches = message.content.match(imageRegex) ?? [];
        const attachments = message.attachments.filter((attachment) => attachment.height !== null && attachment.width !== null).map((attachment) => attachment.proxyURL);
        const embeds = message.embeds.filter((embed) => embed.type === 'image').map((embed) => embed.url);
        const urls = [...new Set([...attachments, ...embeds, ...contentMatches])] as string[];
        return await Promise.all(urls.filter((url) => this.validateURL(url)));
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
                                name: "image-url",
                                description: "The url of the image to upload.",
                                type: "STRING",
                                required: true
                            }
                        ]
                    }
                ]

            },
            {
                guildIds: [this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );

        registry.registerContextMenuCommand(
            {
                name: `${this.name} upload`,
                type: "MESSAGE"
            },
            {
                guildIds: [this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }

}