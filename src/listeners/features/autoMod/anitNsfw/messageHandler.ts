import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, PermissionResolvable } from 'discord.js';
import config from '../../../../config';
import { detectNsfw } from '../../../../lib/api/antiNsfw';
const { antiNsfw } = config.features.automod;

@ApplyOptions<ListenerOptions>({
    name: "antiNsfw:messageHandler",
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (!antiNsfw.enabled || message.system || message.author.bot || message.guildId !== antiNsfw.guildId || !message.attachments || message.attachments.size === 0) return;
        if (antiNsfw.excludedPermissions.length > 0 && message.member?.permissions.any([antiNsfw.excludedPermissions as PermissionResolvable])) return;

        const images = this.extractImages(message);
        if (images.length > 0) {
            const nsfwDetectedInImages = images.map(async (image) => { return await detectNsfw(image) });
            const resolvedResponse = await Promise.all(nsfwDetectedInImages);
            const nsfwResponse = resolvedResponse.filter((response) => response !== null);
            if (nsfwResponse.length > 0 && nsfwResponse.some((res) => res?.isPorn === true)) {
                this.container.client.emit(antiNsfw.events.NsfwDetect, message, nsfwResponse);
            }
        }

    }

    private extractImages(message: Message) {
        const imageRegex = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm);
        const contentMatches = message.content.match(imageRegex) ?? [];
        const attachments = message.attachments.filter((attachment) => attachment.height !== null && attachment.width !== null).map((attachment) => attachment.proxyURL);
        const embeds = message.embeds.filter((embed) => embed.type === 'image').map((embed) => embed.url);
        return [...new Set([...attachments, ...embeds, ...contentMatches])] as string[];
    }
}