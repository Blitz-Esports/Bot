import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { ThreadAutoArchiveDuration } from 'discord-api-types/v9';
import moment from 'moment';
import { Guild, MessageEmbed, TextChannel, ThreadChannel } from 'discord.js';
import type { Message } from 'discord.js';
import config from '../../../../config';

const { modmail } = config.features;

@ApplyOptions<ListenerOptions>({
    event: modmail.events.DmMessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message, { thread, modmailChannel }: EventEmittedOptions) {
        if (thread) {
            await thread.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        } else if (!thread) {
            const pingMessage = await modmailChannel.send({ content: modmail.pingRoles.map((roleId) => `<@&${roleId}>`).join(', ') });
            const newUserThread = await pingMessage.startThread({
                name: message.author.id,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                reason: `Modmail thread: ${message.author.id} | ${moment().format('DD/MM/YYYY')}`
            });
            this.container.client.emit(modmail.events.SessionStart, message.author, newUserThread);
            await newUserThread.send({ ...this.makeUserMessageEmbed(message) });
            await message.react(modmail.emojis.success);
        }
    }

    private makeUserMessageEmbed(message: Message) {
        let embeds: MessageEmbed[] = [];
        if (message.attachments.size > 0) {
            message.attachments.forEach((attachment) => {
                const userMessageEmbed = new MessageEmbed()
                    .setColor('BLURPLE')
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                if (message.content !== '') userMessageEmbed.setDescription(message.content);
                userMessageEmbed.setImage(attachment.proxyURL).setThumbnail(attachment.url);
                embeds.push(userMessageEmbed);
            });
        } else {
            const userMessageEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
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
    thread: ThreadChannel | null;
    modmailChannel: TextChannel;
    modmailGuild: Guild;
}