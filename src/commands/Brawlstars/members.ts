import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { AClub, generateClubMemberListCard, getClub, getPlayer } from '../../lib/api/brawlstars/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "members",
    description: "Shows the list of club members in Brawl Stars.",
})
export class MembersCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        let tag: null | string = null;

        if (interaction.options.get("me", false)) {
            const user = await this.container.database.models.player.findOne({ where: { id: interaction.user.id } });
            if (!user) return interaction.editReply({ embeds: [failEmbed("You don't have any profile saved in the database.\nTo save your profile use `/save` command.")] });
            tag = user.toJSON().tag;
        }
        else if (interaction.options.get("tag", false)) {

            const club = await getClub(interaction.options.getString("tag") as string);
            if (!club) return interaction.editReply({ embeds: [failEmbed("Unable to find the members of the club. The club's tag is invalid or the game is under maintenance.")] });
            const images = await this.makeResponse(club);
            return interaction.editReply({ files: images });
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

        const player = await getPlayer(tag);
        if (!player) return interaction.editReply({ embeds: [failEmbed("Unable to fetch the club of the player. The player's tag is invalid or the game is under maintenance.")] });
        if (!player.club.tag) return interaction.editReply({ embeds: [failEmbed("The player is not in any club.")] });

        const club = await getClub(player.club.tag);
        if (!club) return interaction.editReply({ embeds: [failEmbed("Unable to fetch the club stats. The club's tag is invalid or the game is under maintenance.")] });
        const images = await this.makeResponse(club);
        return interaction.editReply({ files: images });
    }

    private async makeResponse(clubData: AClub) {

        const clubMemberCards = await generateClubMemberListCard(clubData);
        return clubMemberCards;

    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [

                    {
                        name: 'me',
                        description: 'Shows your club members.',
                        type: 'BOOLEAN',
                        required: false
                    },
                    {
                        name: 'tag',
                        description: 'Any club TAG from Brawl Stars.',
                        type: 'STRING',
                        required: false
                    },
                    {
                        name: 'user',
                        description: "Check someone else's club members.",
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