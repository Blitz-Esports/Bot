import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { AClub, brawlstarsEmojis, getClub, getPlayer } from '../../lib/api/brawlstars/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<CommandOptions>({
    name: "club",
    description: "Check stats of any club in Brawl Stars.",
})
export class clubCommand extends Command {

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
            if (!club) return interaction.editReply({ embeds: [failEmbed("Unable to find the stats of the club. The club's tag is invalid or the game is under maintenance.")] });
            return interaction.editReply({ embeds: this.makeEmbed(club) });
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

        return interaction.editReply({ embeds: this.makeEmbed(club) });
    }

    private makeEmbed(clubData: AClub) {

        const president = clubData.members.find(m => m.role === "president");

        const infoEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setThumbnail(`https://cdn.brawlify.com/club/${clubData.badgeId}.png`)
            .setAuthor({ name: `${clubData.name} (${clubData.tag})`, iconURL: `https://cdn.brawlify.com/club/${clubData.badgeId}.png`, url: `https://brawlify.com/stats/club/${clubData.tag.replace("#", "")}` })
            .addField("Trophies", `${brawlstarsEmojis.icons.trophy_club} ${clubData.trophies.toLocaleString()}`, true)
            .addField("Required Trophies", `${brawlstarsEmojis.icons.required_trophies} ${clubData.requiredTrophies.toLocaleString()}`, true)
            .addField("Entrance", `${brawlstarsEmojis.entrance[clubData.type] || brawlstarsEmojis.unknown} **${clubData.type}**`, true)
            .addField("Current Members", `${brawlstarsEmojis.role.member} \`${clubData.members.length}\``, true)
            .addField("Trophy Range", `${brawlstarsEmojis.icons.trophy_required} \`${clubData.members.sort((a, b) => b.trophies - a.trophies)[0].trophies.toLocaleString()}\` - \`${clubData.members.sort((a, b) => a.trophies - b.trophies)[0].trophies.toLocaleString()}\``, true)
            .addField("President", `${brawlstarsEmojis.icons.crown} [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`, true)
            .addField("Description", `${clubData.description || "No Description"}`, false)
            .addField(`Top Members (${this.list(clubData, "member").length})`, this.list(clubData, "member").join("\n"), true)
            .addField(`Top Seniors (${this.list(clubData, "senior").length})`, this.list(clubData, "senior").join("\n"), true)
            .addField(`Top Presidents (${this.list(clubData, "vicePresident").length} + 1)`, this.list(clubData, "vicePresident").join("\n"), true)

        const graphEmbed = new MessageEmbed()
            .setImage(`${this.container.config.server.host}/club/${clubData.tag.replace("#", "")}/graph?${Date.now()}`);

        return [infoEmbed, graphEmbed];
    }

    private list = (club: AClub, role: "member" | "senior" | "vicePresident" | "president") => {
        let r = [role];
        if (role === "vicePresident") r = ["president", role]
        const list = club.members.filter((x) => r.includes(x.role)).sort((a, b) => b.trophies - a.trophies).map((m) => `${brawlstarsEmojis.role[m.role] || brawlstarsEmojis.unknown}\`${m.trophies}\` [${m.name}](https://brawlify.com/stats/profile/${m.tag.replace("#", "")})`).slice(0, 5)
        return list.length === 0 ? ["- None -"] : list;
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [

                    {
                        name: 'me',
                        description: 'Shows your club stats.',
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
                        description: "Check someone else's club.",
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