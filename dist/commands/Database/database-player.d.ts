import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export declare class DatabasePlayerCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean> | undefined>;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    private resolveMember;
    private checkPermissions;
    private splitChunk;
}
//# sourceMappingURL=database-player.d.ts.map