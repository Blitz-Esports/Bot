import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export declare class PingCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<void>;
    private formatMessage;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=ping.d.ts.map