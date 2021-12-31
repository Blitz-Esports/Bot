import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../config';
const { modmail } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "modmail:dmMessageHandler",
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {

        if (!modmail.enabled || message.channel.type !== 'DM' || message.author.bot) return;
        else if (!modmail.channelId || !modmail.guildId) return this.container.logger.warn('Unable to resolve modmail config.');
        const modmailGuild = this.container.client.guilds.cache.get(modmail.guildId);
        if (!modmailGuild) return this.container.logger.warn('Modmail guild not found.');
        const modmailChannel = modmailGuild.channels.cache.get(modmail.channelId);
        if (!modmailChannel || modmailChannel.type !== 'GUILD_TEXT' || !modmailChannel.isText())
            return this.container.logger.warn('Modmail channel not found or the channel is not a text channel.');

        await modmailChannel.threads.fetch();
        const userThread = modmailChannel.threads.cache.find((c) => c.name === message.author.id);

        if (userThread) {
            this.container.client.emit(modmail.events.DmMessageCreate, message, { thread: userThread, modmailChannel, modmailGuild });
        } else if (!userThread) {
            this.container.client.emit(modmail.events.DmMessageCreate, message, { thread: null, modmailChannel, modmailGuild });
        }
    }
}