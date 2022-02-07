import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import config from '../../config';
import { getPlayer, AClub, encodeTag } from '../../lib/api/brawlstars/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

const { verification } = config.features;

@ApplyOptions<CommandOptions>({
    name: "rerole",
    description: "Used to refresh the roles of a user.",
})
export class ReroleCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const member = await this.resolveMember(interaction);
        if (!member) return interaction.editReply({ embeds: [failEmbed("Unable to resolve member from the interaction.")] });

        const user = await this.container.database.models.player.findOne({ where: { id: member.user.id } });
        if (!user) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, you don't have a Brawl Stars tag saved in the database.\nTo save your tag run \`/save\` command.`)] });

        const player = await getPlayer(user.toJSON().tag);
        if (!player) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, could not find a Brawl Stars profile with the tag: **${user.toJSON().tag}**.`)] });

        const clubData = await this.container.database.models.club.findOne({ where: { id: encodeTag(player.club.tag , "STRING") ?? "undefined" } });
        const allClubRoles = (await this.container.database.models.club.findAll({})).map((club) => club.toJSON().roleId).filter((roleId) => roleId !== null);

        let rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles), ...allClubRoles].includes(role.id)).map((role) => role.id);

        const successEmbed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} | 🏆 ${player.trophies.toLocaleString()}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: `https://brawlify.com/stats/profile/${player.tag.replace("#", "")}` })
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }));

        if (clubData) {
            const resolvedClubData: AClub = clubData.toJSON().rawData;
            const clubMember = resolvedClubData.members.find((member) => member.tag === player.tag);

            const roles = [
                verification.roles.default,
                verification.roles.member,
                verification.roles[clubMember?.role ?? "member"],
                clubData.toJSON().roleId ?? verification.roles.default
            ];
            rolesToSet.push(...roles);
            rolesToSet = [...new Set(rolesToSet)];

            await member.roles.set(rolesToSet);

            successEmbed.setDescription([
                `Associated with club: **${player.club.name}**.`,
                `Club tag: **${player.club.tag}**.`,
                `Roles changed: ${[...new Set(roles)].map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"))

            return interaction.editReply({ embeds: [successEmbed] });
        }
        else {
            const roles = [
                verification.roles.default
            ];
            rolesToSet.push(...roles);
            rolesToSet = [...new Set(rolesToSet)];

            await member.roles.set(rolesToSet);

            successEmbed.setDescription([
                `Associated with club: **${player.club.name || "None"}**.`,
                `Club tag: **${player.club.tag || "None"}**.`,
                `Roles changed: ${roles.map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"))

            return interaction.editReply({ embeds: [successEmbed] });
        }
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: 'user',
                        description: 'Optional user to refresh the roles.',
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

    private async resolveMember(interaction: CommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.options.get("user")?.user?.id || interaction.user.id);
        if (member?.user.bot) return undefined;
        else return member;
    }
}