import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export declare class clubCommand extends Command {
    chatInputRun(interaction: CommandInteraction): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean>>;
    private makeEmbed;
    private list;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=club.d.ts.map