import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { ContextMenuInteraction } from 'discord.js';
export declare class EvalCommand extends Command {
    contextMenuRun(interaction: ContextMenuInteraction): Promise<void>;
    private eval;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=eval.d.ts.map