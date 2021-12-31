import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../config';
const { modmail } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "modmail:channelMessageHandler",
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (!modmail.enabled || message.author.bot || !message.channel.isThread() || message.system) return;
        if (message.channel.parentId !== modmail.channelId) return;
        const threadAuthor = await this.container.client.users.fetch(message.channel.name).catch(() => null);
        if (threadAuthor) this.container.client.emit(modmail.events.ChannelMessageCreate, message, { receiver: threadAuthor });
    }
}