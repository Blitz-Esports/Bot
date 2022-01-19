import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../config';
import { ocr } from '../../../lib/api/ocr';
const { verification } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "autoVerify:guildMessageCreate",
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (message.author.bot || message.system || message.guildId !== verification.guildId || message.channelId !== verification.channelId) return;

        const images = this.extractImages(message);
        if (images.length === 0) return;

        await message.react(config.default.emojis.loading);

        const ocrResponse = (await Promise.all(images.map((image) => ocr(image)))).filter((response) => response !== null);
        if (ocrResponse.length === 0) return message.reactions.removeAll();

        return this.container.client.emit(verification.events.TagDetect, message, ocrResponse);

    }

    private extractImages(message: Message) {
        const imageRegex = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm);
        const contentMatches = message.content.match(imageRegex) ?? [];
        const attachments = message.attachments.filter((attachment) => attachment.height !== null && attachment.width !== null).map((attachment) => attachment.proxyURL);
        const embeds = message.embeds.filter((embed) => embed.type === 'image').map((embed) => embed.url);
        return [...new Set([...attachments, ...embeds, ...contentMatches])] as string[];
    }
}