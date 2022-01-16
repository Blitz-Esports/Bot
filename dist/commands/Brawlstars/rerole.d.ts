import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export declare class ReroleCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean>>;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    private resolveMember;
}
//# sourceMappingURL=rerole.d.ts.map