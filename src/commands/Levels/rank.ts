import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import axios from 'axios';
import { CommandInteraction, MessageAttachment, ColorResolvable, MessageEmbed } from 'discord.js';
import { CDNOptions, uploadFileWithUrl } from '../../lib/api/cdn';
import { failEmbed } from '../../lib/constants/embed';
import { fetchLevels, generateRankCard, getUserLevel, RankCardData } from '../../lib/modules/levelling/levelling';

@ApplyOptions<CommandOptions>({
    name: "rank",
    description: "View/edit your or someone else's rank.",
})
export class RankCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const subcommandName = interaction.options.getSubcommand();

        if (subcommandName === "show") {
            const user = interaction.options.getUser("member")?.id || interaction.user.id;

            const rankCard = await generateRankCard(user);
            if (!rankCard) return interaction.editReply({ embeds: [failEmbed(`<@!${user}>, does not have any rank.`)] });

            await interaction.editReply({ files: [new MessageAttachment(rankCard.data, `rankCard.${rankCard.extension}`)] });
        }
        else if (subcommandName === "edit") {
            const commandOptions = {
                "theme-color": interaction.options.getString("theme-color"),
                "background-image": interaction.options.getString("background-image"),
                "card-opacity": interaction.options.getInteger("card-opacity")
            }

            const DbUserData = await getUserLevel(interaction.user.id);
            if (!DbUserData) return interaction.editReply({ embeds: [failEmbed(`<@!${interaction.user.id}>, does not have any data saved in the database.`)] });

            let userData = {
                "theme-color": DbUserData.card_color,
                "background-image": DbUserData.card_background,
                "card-opacity": DbUserData.card_opacity
            }

            if (commandOptions['theme-color']) {
                userData['theme-color'] = commandOptions['theme-color'];
            }
            if (commandOptions['card-opacity']) {
                if (commandOptions['card-opacity'] >= 0 && commandOptions['card-opacity'] <= 100) {
                    userData['card-opacity'] = commandOptions['card-opacity'];
                }
                else {
                    interaction.editReply({ embeds: [failEmbed(`<@!${interaction.user.id}>, the card-opacity must be between 0 and 100.`)] });
                }
            }
            if (commandOptions['background-image']) {

                const uploadedImage = await this.uploadImage(commandOptions['background-image'], {
                    file_path: "rank-card-background",
                    file_name: interaction.user.id
                });
                if (!uploadedImage || !uploadedImage.status) return interaction.editReply({ embeds: [failEmbed(`<@!${interaction.user.id}>, failed to upload the background image.`)] });

                userData['background-image'] = uploadedImage.data.url;
            }

            const responseEmbed = new MessageEmbed()
                .setColor("NOT_QUITE_BLACK")
                .setDescription([
                    `Your rank card settings have been updated.`,
                    `Want to resize the image? Use these online tools to resize the images: for [static images](https://pixlr.com/e) & [GIFs](https://ezgif.com/resize). The dimension of the rank card should be \`900x250\` pixels.`,
                    `Common issues while rendering GIFs: GIFs with first frame static aren't rendered properly i.e. the transparent frames are rendered with black background.`,
                    `Takes a lot of time? GIFs with 50 or more frames take some time to render. Consider resizing the GIF using the tools listed above.`,
                    `Sometimes the CDN may be offline and the image could be rendered with default black background.`
                ].join("\n"))
                .addField("Your rank card settings", [
                    `**Theme color:** ${userData['theme-color']}`,
                    `**Background image:** [BG Image](${userData['background-image']})`,
                    `**Card opacity:** ${userData['card-opacity']}%`
                ].join("\n"));

            const dataToUpdate = await this.container.database.models.level.findOne({ where: { id: interaction.user.id } });
            if (!dataToUpdate) return interaction.editReply({ embeds: [failEmbed(`<@!${interaction.user.id}>, does not have any data saved in the database.`)] });
            await dataToUpdate.update({
                card_color: userData['theme-color'],
                card_background: userData['background-image'],
                card_opacity: userData['card-opacity']
            });

            interaction.editReply({ embeds: [responseEmbed] });
        }
        else if (subcommandName === "leaderboard") {
            const allLevels = await fetchLevels();
            const levelsChunk = this.splitChunk(allLevels, 10);

            const pagination = new PaginatedMessage();
            levelsChunk.forEach((chunk: RankCardData[]) => {
                pagination.addPageEmbed((embed) => {
                    return embed
                        .setThumbnail(interaction.guild?.iconURL({ dynamic: true }) ?? "")
                        .setColor(this.container.config.default.colors.theme as ColorResolvable)
                        .setTitle(`${interaction.guild?.name}'s Level Leaderboard`)
                        .setDescription(chunk.map((user) => {
                            return `❯ \`${user.rank}\`: ${user.username}\n　└─ ${user.xp.toLocaleString()}`
                        }).join('\n'))
                        .setFooter({ text: `Ranked ${allLevels.find((u) => u.id === interaction.user.id)?.rank ?? "None"} out of ${allLevels.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                });
            });

            pagination.run(interaction);
        }
        return;
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

    private uploadImage = async (imageUrl: string, options: CDNOptions) => {
        const validFormats = ["png", "jpg", "jpeg", "gif"];
        try {
            const url = new URL(imageUrl);
            const res = await axios.get(url.toString(), { responseType: "arraybuffer" });
            if (!validFormats.includes(res.headers["content-type"].split("/")[1])) return false;
            const image = await uploadFileWithUrl(url.toString(), options);
            return image;
        } catch (e) {
            return null;
        }
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: 'show',
                        description: "Shows your or someone else's rank.",
                        type: 'SUB_COMMAND',
                        options: [
                            {
                                name: "member",
                                description: "The member to show the rank of.",
                                type: "USER",
                                required: false
                            }
                        ]
                    },
                    {
                        name: 'edit',
                        description: "Edit your rank card looks.",
                        type: 'SUB_COMMAND',
                        options: [
                            {
                                name: "theme-color",
                                description: "The theme color of the rank card [HEX Color].",
                                type: "STRING",
                                required: false
                            },
                            {
                                name: "background-image",
                                description: "The background image of the rank card [URL (GIF/PNG/JPG)].",
                                type: "STRING",
                                required: false
                            },
                            {
                                name: "card-opacity",
                                description: "The opacity of the black box [0-100].",
                                type: "INTEGER",
                                required: false
                            }
                        ]
                    },
                    {
                        name: 'leaderboard',
                        description: "Shows the server's leaderboard.",
                        type: 'SUB_COMMAND',
                        options: [
                            {
                                name: "show",
                                description: "Shows the server's leaderboard.",
                                type: "BOOLEAN",
                                required: false
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
    }
}