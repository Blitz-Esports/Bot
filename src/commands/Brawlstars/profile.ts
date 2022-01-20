import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import config from '../../config';
import { brawlstarsEmojis, getPlayer, APlayer } from '../../lib/api/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: 'profile',
    description: 'Check stats of any Brawl Stars profile.'
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

        const payload = await this.makeEmbed(apiResponse);
        return interaction.editReply(payload);
    }

    private async makeEmbed(apiResponse: APlayer): Promise<{ embeds: MessageEmbed[] }> {

        const embed = new MessageEmbed()
            .setColor(`#${apiResponse.nameColor.replace('0xff', '')}`)
            .setAuthor({ name: `${apiResponse.name} (${apiResponse.tag})`, iconURL: `https://cdn.brawlify.com/profile/${apiResponse.icon.id}.png`, url: `https://brawlify.com/stats/profile/${apiResponse.tag.replace("#", "")}` })
            .setImage(`https://share.brawlify.com/player-graph/${apiResponse.tag.replace('#', '')}?${Date.now()}`)
            .addFields([
                {
                    name: 'Trophies',
                    value: `${brawlstarsEmojis.icons.trophy_player} \`${apiResponse.trophies.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: 'Highest Trophies',
                    value: `${brawlstarsEmojis.icons.trophy_highest} \`${apiResponse.highestTrophies.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: 'Level',
                    value: `${brawlstarsEmojis.icons.exp} \`${apiResponse.expLevel}\``,
                    inline: true
                },
                {
                    name: 'Brawlers',
                    value: `${brawlstarsEmojis.icons.brawlers} \`${apiResponse.brawlers.length}\``,
                    inline: true
                },
                {
                    name: 'Star Powers',
                    value: `${brawlstarsEmojis.icons.star_powers} \`${apiResponse.brawlers
                        .map((blr) => blr.starPowers.length)
                        .reduce((a, b) => a + b)}\``,
                    inline: true
                },
                {
                    name: 'Gadgets',
                    value: `${brawlstarsEmojis.icons.gadgets} \`${apiResponse.brawlers.map((blr) => blr.gadgets.length).reduce((a, b) => a + b)}\``,
                    inline: true
                },
                {
                    name: '3v3 Victories',
                    value: `${brawlstarsEmojis.icons['3v3']} \`${apiResponse['3vs3Victories'].toLocaleString()}\``,
                    inline: true
                },
                {
                    name: 'Duo Victories',
                    value: `${brawlstarsEmojis.icons.duo} \`${apiResponse.duoVictories.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: 'Solo Victories',
                    value: `${brawlstarsEmojis.icons.solo} \`${apiResponse.soloVictories.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: 'Club Information',
                    value: `${brawlstarsEmojis.icons.club} [${apiResponse.club.tag ? `${apiResponse.club.name} (${apiResponse.club.tag})` : 'No Club'
                        }](https://brawlify.com/stats/club/${apiResponse.club.tag ? apiResponse.club.tag.replace('#', '') : 'No-Club'})`,
                    inline: true
                }
            ]);

        const discordAccounts = (await this.container.database.models.player.findAll({ where: { tag: apiResponse.tag } })).map((player) => player.toJSON());
        if (discordAccounts.length > 0) {
            embed.addField('Discord Account(s)', `${config.default.emojis.discord} ${discordAccounts.map((account) => `<@!${account.id}>`).join(', ')}`, true);
        }

        return { embeds: [embed] };
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