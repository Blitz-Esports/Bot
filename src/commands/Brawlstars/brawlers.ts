import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction, MessageOptions } from 'discord.js';
import { getPlayer, APlayer, generateBrawlerListCard } from '../../lib/api/brawlstars/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: 'brawlers',
    description: 'Check brawler progression of any Brawl Stars profile.'
})
export class UserCommand extends Command {
    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        let tag: null | string = null;
        if (interaction.options.get("me", false)) {
            const user = await this.container.database.models.player.findOne({ where: { id: interaction.user.id } });
            if (!user) return interaction.editReply({ embeds: [failEmbed("You don't have any profile saved in the database.\nTo save your profile use `/save` command.")] });
            tag = user.toJSON().tag;
        }
        else if (interaction.options.get("tag", false)) {
            tag = interaction.options.getString("tag");
        }
        else if (interaction.options.get("user", false)) {
            const target = interaction.options.getUser("user", true);
            const user = await this.container.database.models.player.findOne({ where: { id: target.id } });
            if (!user) return interaction.editReply({ embeds: [failEmbed(`${target.toString()}, don't have any tag saved in the database.`)] });
            tag = user.toJSON().tag;
        }
        else {
            const me = await this.container.database.models.player.findOne({ where: { id: interaction.user.id } });
            if (!me) return interaction.editReply({ embeds: [failEmbed("You don't have any profile saved in the database.\nTo save your profile use `/save` command.")] });
            tag = me.toJSON().tag;
        }

        if (!tag) return interaction.editReply({ embeds: [failEmbed("Unable to resolve tag.")] });

        const apiResponse = await getPlayer(tag);
        if (!apiResponse)
            return {
                embeds: [failEmbed("Unable to find the stats of the player. The user's tag is invalid or the game is under maintenance.")]
            };

        const payload = await this.makeResponse(apiResponse);
        if (!payload) return interaction.editReply({ embeds: [failEmbed("An error occurred while making the brawler list card.")] });
        return interaction.editReply(payload);
    }

    private async makeResponse(apiResponse: APlayer): Promise<MessageOptions | null> {
        const imageCards = await generateBrawlerListCard(apiResponse);
        return { files: imageCards };
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
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
            },
            {
                guildIds: [this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }
}