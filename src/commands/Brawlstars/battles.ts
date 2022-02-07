import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import { getPlayer, getBattlelog, capitlizeString } from '../../lib/api/brawlstars/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: 'battles',
    description: 'Check battlelog of any Brawl Stars profile.'
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

        const battleLog = await getBattlelog(tag);
        if (!battleLog) return interaction.editReply({ embeds: [failEmbed("Unable to find the battles of the player. The user's tag is invalid or the game is under maintenance.")] });

        const pagination = new PaginatedMessage();
        battleLog.forEach((battle) => {
            const embed = new MessageEmbed()
                .setColor(apiResponse.nameColor.replace("0xff", "") as ColorResolvable)
                .setAuthor({ name: `${apiResponse.name} 's BattleLog`, iconURL: `https://cdn.brawlify.com/profile/${apiResponse.icon.id}.png`, url: `https://brawlify.com/stats/profile/${apiResponse.tag.replace("#", "")}` })
                .setImage(`${this.container.config.server.host}/player/${apiResponse.tag.replace("#", "")}/battlelog?battleTime=${battle.battleTime}`);
            pagination.addPageEmbed(embed);
        });

        pagination.setSelectMenuOptions((pageIndex) => {
            return { label: `${pageIndex} – ${capitlizeString(battleLog[pageIndex - 1].battle.mode)}`, description: capitlizeString(battleLog[pageIndex - 1].event.map ?? "Unknown") };
        });

        return pagination.run(interaction);
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [

                    {
                        name: 'me',
                        description: "Shows your account's battle log.",
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
                        description: "Check someone else's battle log.",
                        type: 'USER',
                        required: false
                    }
                ]
            },
            {
                guildIds: [this.container.config.bot.guilds.dev, this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }
}