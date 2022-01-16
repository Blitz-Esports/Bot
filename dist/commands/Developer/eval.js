"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalCommand = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const utilities_1 = require("@sapphire/utilities");
const type_1 = require("@sapphire/type");
const util_1 = require("util");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const embed_1 = require("../../lib/constants/embed");
const { developers } = config_1.default.bot;
let EvalCommand = class EvalCommand extends framework_1.Command {
    async contextMenuRun(interaction) {
        if (!developers.includes(interaction.user.id))
            return interaction.reply({ embeds: [(0, embed_1.failEmbed)("Only the bot developers can use this command.")], ephemeral: true });
        const message = await interaction.channel?.messages.fetch(interaction.targetId);
        if (!message)
            return interaction.reply({ embeds: [(0, embed_1.failEmbed)("Unable to resolve the message.")], ephemeral: true });
        const code = message.content;
        const { result, success, type } = await this.eval(message, code, {
            async: true,
            depth: 0,
            showHidden: false
        });
        const output = success ? (0, utilities_1.codeBlock)('js', result) : `**ERROR**: ${(0, utilities_1.codeBlock)('bash', result)}`;
        const typeFooter = `**Type**: ${(0, utilities_1.codeBlock)('typescript', type)}`;
        if (output.length > 2000) {
            return interaction.reply({
                content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
                files: [{ attachment: Buffer.from(output), name: 'output.js' }],
                ephemeral: true
            });
        }
        return interaction.reply({ content: `${output}\n${typeFooter}`, ephemeral: true });
    }
    async eval(message, code, flags) {
        if (flags.async)
            code = `(async () => {\n${code}\n})();`;
        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const msg = message;
        let success = true;
        let result = null;
        try {
            // eslint-disable-next-line no-eval
            result = eval(code);
        }
        catch (error) {
            if (error && error instanceof Error && error.stack) {
                this.container.client.logger.error(error);
            }
            result = error;
            success = false;
        }
        const type = new type_1.Type(result).toString();
        if ((0, utilities_1.isThenable)(result))
            result = await result;
        if (typeof result !== 'string') {
            result = (0, util_1.inspect)(result, {
                depth: flags.depth,
                showHidden: flags.showHidden
            });
        }
        return { result, success, type };
    }
    registerApplicationCommands(registry) {
        registry.registerContextMenuCommand({
            name: this.name,
            type: "MESSAGE"
        }, {
            guildIds: [this.container.config.bot.guilds.dev],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */
        });
    }
};
EvalCommand = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "eval",
        description: "Evaluates arbitrary JavaScript code."
    })
], EvalCommand);
exports.EvalCommand = EvalCommand;
//# sourceMappingURL=eval.js.map