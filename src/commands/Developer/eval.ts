import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { Type } from '@sapphire/type';
import type { ContextMenuInteraction, Message } from 'discord.js';
import { inspect } from 'util';
import config from '../../config';
import { failEmbed } from '../../lib/constants/embed';

const { developers } = config.bot;

@ApplyOptions<CommandOptions>({
    name: "eval",
    description: "Evaluates arbitrary JavaScript code."
})
export class EvalCommand extends Command {

    public override async contextMenuRun(interaction: ContextMenuInteraction) {
        if (!developers.includes(interaction.user.id)) return interaction.reply({ embeds: [failEmbed("Only the bot developers can use this command.")], ephemeral: true });

        const message = await interaction.channel?.messages.fetch(interaction.targetId);
        if (!message) return interaction.reply({ embeds: [failEmbed("Unable to resolve the message.")], ephemeral: true });

        const code = message.content;
     
        const { result, success, type } = await this.eval(message, code, {
            async: true,
            depth: 0,
            showHidden: false
        });

        const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

        const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

        if (output.length > 2000) {
            return interaction.reply({
                content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
                files: [{ attachment: Buffer.from(output), name: 'output.js' }],
                ephemeral: true
            });
        }

        return interaction.reply({ content: `${output}\n${typeFooter}`, ephemeral: true });

    }

    private async eval(message: Message, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
        if (flags.async) code = `(async () => {\n${code}\n})();`;

        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const msg = message;

        let success = true;
        let result = null;

        try {
            // eslint-disable-next-line no-eval
            result = eval(code);
        } catch (error) {
            if (error && error instanceof Error && error.stack) {
                this.container.client.logger.error(error);
            }
            result = error;
            success = false;
        }

        const type = new Type(result).toString();
        if (isThenable(result)) result = await result;

        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: flags.depth,
                showHidden: flags.showHidden
            });
        }

        return { result, success, type };
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {

        registry.registerContextMenuCommand(
            {
                name: this.name,
                type: "MESSAGE"
            },
            {
                guildIds: ["926515822657142825"],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        )
    }
}