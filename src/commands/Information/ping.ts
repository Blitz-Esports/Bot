import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "ping",
    description: "Shows the bot's latency.",
})
export class PingCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {

        interaction.reply({
            content: `Pong! Latency is ${this.container.client.ws.ping}ms.`
        });

    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description
            },
            {
                guildIds: ['926515822657142825'],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }
}