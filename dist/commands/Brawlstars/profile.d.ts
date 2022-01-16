import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
export declare class UserCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean> | {
        embeds: MessageEmbed[];
    }>;
    private makeEmbed;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=profile.d.ts.map