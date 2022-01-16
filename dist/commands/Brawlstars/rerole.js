"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReroleCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const brawlstars_1 = require("../../lib/api/brawlstars");
const embed_1 = require("../../lib/constants/embed");
const { verification } = config_1.default.features;
let ReroleCommand = class ReroleCommand extends framework_1.Command {
    async chatInputRun(interaction) {
        await interaction.deferReply();
        const member = await this.resolveMember(interaction);
        if (!member)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)("Unable to resolve member from the interaction.")] });
        const user = await this.container.database.models.player.findOne({ where: { id: member.user.id } });
        if (!user)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`${interaction.user.toString()}, you don't have a Brawl Stars tag saved in the database.\nTo save your tag run \`/save\` command.`)] });
        const player = await (0, brawlstars_1.getPlayer)(user.toJSON().tag);
        if (!player)
            return interaction.editReply({ embeds: [(0, embed_1.failEmbed)(`${interaction.user.toString()}, could not find a Brawl Stars profile with the tag: **${user.toJSON().tag}**.`)] });
        const clubData = await this.container.database.models.club.findOne({ where: { id: player.club.tag ?? "undefined" } });
        const allClubRoles = (await this.container.database.models.club.findAll({})).map((club) => club.toJSON().roleId).filter((roleId) => roleId !== null);
        const newNickname = await member.setNickname(player.name).catch(() => null);
        let rolesToSet = member.roles.cache.filter((role) => ![...Object.values(verification.roles), ...allClubRoles].includes(role.id)).map((role) => role.id);
        const successEmbed = new discord_js_1.MessageEmbed()
            .setAuthor({ name: `${member.user.tag} | 🏆 ${player.trophies.toLocaleString()}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: `https://brawlify.com/stats/profile/${player.tag.replace("#", "")}` })
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL({ dynamic: true }) ?? member.displayAvatarURL({ dynamic: true }));
        if (clubData) {
            const resolvedClubData = clubData.toJSON().rawData;
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
                `${newNickname?.displayName ? `Nickname changed to **${player.name}**.` : "Unable to change **Nickname**."}`,
                `Associated with club: **${player.club.name}**.`,
                `Club tag: **${player.club.tag}**.`,
                `Roles changed: ${[...new Set(roles)].map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"));
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
                `${newNickname?.displayName ? `Nickname changed to **${player.name}**.` : "Unable to change **Nickname**."}`,
                `Associated with club: **${player.club.name || "None"}**.`,
                `Club tag: **${player.club.tag || "None"}**.`,
                `Roles changed: ${roles.map((role) => `<@&${role}>`).join(", ")}.`,
            ].join("\n"));
            return interaction.editReply({ embeds: [successEmbed] });
        }
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
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
        }, {
            guildIds: [this.container.config.bot.guilds.main],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */
        });
    }
    async resolveMember(interaction) {
        const member = await interaction.guild?.members.fetch(interaction.options.get("user")?.user?.id || interaction.user.id);
        if (member?.user.bot)
            return undefined;
        else
            return member;
    }
};
ReroleCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "rerole",
        description: "Used to refresh the roles of a user.",
    })
], ReroleCommand);
exports.ReroleCommand = ReroleCommand;
//# sourceMappingURL=rerole.js.map