import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import config from '../../config';
import { getPlayer, AClub } from '../../lib/api/brawlstars';
import { failEmbed } from '../../lib/constants/embed';

const { verification } = config.features;

@ApplyOptions<CommandOptions>({
    name: "save",
    description: "Save your Brawl Stars profile to your Discord account.",
})
export class SaveCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const member = await this.resolveMember(interaction);
        if (!member) return interaction.editReply({ embeds: [failEmbed("Unable to resolve member from the interaction.")] });

        const user = await this.container.database.models.player.findOne({ where: { id: member.user.id } });
        if (user) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, you already has a Brawl Stars tag saved with name: **${user.toJSON().name}** (${user.toJSON().tag}).\nIf you want to refresh your roles run \`/rerole\` command.`)] });

        const player = await getPlayer(interaction.options.get("tag")?.value as string);
        if (!player) return interaction.editReply({ embeds: [failEmbed(`${interaction.user.toString()}, could not find a Brawl Stars profile with the tag: **${interaction.options.get("tag")?.value}**.`)] });

        const clubData = await this.container.database.models.club.findOne({ where: { id: player.club.tag ?? "unknown" } });

        const newNickname = await member.setNickname(player.name).catch((_) => { return null });

        let rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles)].includes(role.id)).map((role) => role.id);

        const successEmbed = new MessageEmbed()
            .setAuthor({ name: `${interaction.user.tag} | 🏆 ${player.trophies.toLocaleString()}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }), url: `https://brawlify.com/stats/profile/${player.tag.replace("#", "")}` })
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }));

        await this.container.database.models.player.create({
            id: member.user.id,
            tag: player.tag,
            name: player.name
        });

        if (clubData) {
            const resolvedClubData: AClub = clubData.toJSON().rawData;
            const clubMember = resolvedClubData.members.find((member) => member.tag === player.tag);

            const roles = [
                verification.roles.default,
                verification.roles.member,
                verification.roles[clubMember?.role ?? "member"],
                clubData.toJSON().roleId
            ];
            rolesToSet.push(...roles);
            rolesToSet = [...new Set(rolesToSet)];

            await member.roles.set(rolesToSet);

            successEmbed.setDescription([
                `Account linked: ${member.toString()} with **${player.name} | ${player.tag}**.`,
                `${newNickname?.displayName ? "Unable to change **Nickname**." : `Nickname changed to **${player.name}**.`}`,
                `Associated with club: **${player.club.name ?? "None"}**.`,
                `Club tag: **${player.club.tag ?? "None"}**.`,
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
                `Account linked: ${member.toString()} with **${player.name} | ${player.tag}**.`,
                `${newNickname?.displayName ? "Unable to change **Nickname**" : `Nickname changed to **${player.name}**`}.`,
                `Associated with club: **${player.club.name ?? "None"}**.`,
                `Club tag: **${player.club.tag ?? "None"}**.`,
                `Roles changed: ${[...new Set(roles)].map((role) => `<@&${role}>`).join(", ")}.`,
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
                        name: 'tag',
                        description: 'Your profile TAG in Brawl Stars.',
                        type: 'STRING',
                        required: true
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
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        return member;
    }
}