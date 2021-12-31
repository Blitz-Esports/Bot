import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageEmbed, User } from 'discord.js';
import type { Message } from 'discord.js';
import config from '../../../../config';

const { modmail } = config.features;

@ApplyOptions<ListenerOptions>({
    event: modmail.events.ChannelMessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message, { receiver }: EventEmittedOptions) {
        try {
            await receiver.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        } catch (_) {
            await message.react(modmail.emojis.error);
        }
    }

    private makeUserMessageEmbed(message: Message) {
        let embeds: MessageEmbed[] = [];
        if (message.attachments.size > 0) {
            message.attachments.forEach((attachment) => {
                const userMessageEmbed = new MessageEmbed({ ...modmail.defaultMessages.branding }).setColor('BLURPLE');
                if (message.content !== '') userMessageEmbed.setDescription(message.content);
                userMessageEmbed.setImage(attachment.proxyURL);
                embeds.push(userMessageEmbed);
            });
        } else {
            const userMessageEmbed = new MessageEmbed({ ...modmail.defaultMessages.branding }).setColor('BLURPLE');
            if (message.content !== '') userMessageEmbed.setDescription(message.content);
            embeds.push(userMessageEmbed);
        }
        return {
            embeds: embeds.length === 0 ? undefined : embeds,
            stickers: message.stickers.map((sticker) => sticker).length === 0 ? undefined : message.stickers.map((sticker) => sticker)
        };
    }
}

interface EventEmittedOptions {
    receiver: User;
}