import { ApplyOptions } from '@sapphire/decorators';
import { container, Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Collection, Message } from 'discord.js';
import config from '../../../config';
const { levelling } = config.features;

const messageCache = new Collection<string, { messageCount: number; lastMessage: Message }>();

setInterval(() => {

    messageCache.forEach((data, userId) => {
        container.client.emit(levelling.events.XpAdd, userId, data.messageCount, data.lastMessage);
    });

    messageCache.clear();

}, levelling.threshold);

@ApplyOptions<ListenerOptions>({
    name: "levelling:guildMessageHandler",
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (!levelling.enabled) return;
        if (message.author.bot || message.system || message.channel.type === "DM" || levelling.guildId !== message.guildId || message.channel.isThread()) return;

        messageCache.set(message.author.id, {
            messageCount: ((messageCache.get(message.author.id)?.messageCount ?? 0) + 1),
            lastMessage: message
        });

    }
}