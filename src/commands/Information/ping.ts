import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior, version as frameworkVersion } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, version } from 'discord.js';
import ms from 'ms';
import os from "os";

@ApplyOptions<CommandOptions>({
    name: "ping",
    description: "Shows the bot's stats.",
})
export class PingCommand extends Command {

    public override async chatInputRun(interaction: CommandInteraction) {
        if (!this.container.client.user) return;

        const dbConnection = await this.container.database.authenticate().catch(() => null);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setAuthor({ name: this.container.client.user.tag, iconURL: this.container.client.user.displayAvatarURL() })
                    .setColor("NOT_QUITE_BLACK")
                    .setThumbnail(this.container.client.user.displayAvatarURL())
                    .setDescription("BLITZ™ Esports © [Blitz](https://github.com/Blitz-Esports).\nAuthored and maintained by [Jordaar](https://github.com/Jordaar) & [contributors](https://github.com/Blitz-Esports/Bot).")
                    .addField("Statistics", this.formatMessage([
                        `WS Latency: ${this.container.client.ws.ping}ms`,
                        `Database: ${dbConnection === null ? "not connected" : "connected"}`,
                        `Discord.js: ${version}`,
                        `Sapphire Framework: ${frameworkVersion}`,
                        `Node.js: ${process.version}`
                    ]))
                    .addField("Uptime", this.formatMessage([
                        `Host: ${ms(Math.round(os.uptime()))}`,
                        `Client: ${ms(this.container.client.uptime ?? 0)}`
                    ]))
            ]
        });

    }

    private formatMessage(array: string[]) {
        return array.map((desc) => `● ${desc}`).join("\n");
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description
            },
            {
                guildIds: [this.container.config.bot.guilds.main],
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite
            }
        );
    }
}