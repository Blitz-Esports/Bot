import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export declare class UserCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean> | {
        embeds: import("discord.js").MessageEmbed[];
    }>;
    private makeResponse;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=brawlers.d.ts.map