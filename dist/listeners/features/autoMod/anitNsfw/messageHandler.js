"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const config_1 = (0, tslib_1.__importDefault)(require("../../../../config"));
const antiNsfw_1 = require("../../../../lib/api/antiNsfw");
const { antiNsfw } = config_1.default.features.automod;
let UserEvent = class UserEvent extends framework_1.Listener {
    async run(message) {
        if (!antiNsfw.enabled || message.system || message.author.bot || message.guildId !== antiNsfw.guildId)
            return;
        if (antiNsfw.excludedPermissions.length > 0 && message.member?.permissions.any([antiNsfw.excludedPermissions]))
            return;
        const images = this.extractImages(message);
        if (images.length > 0) {
            const nsfwDetectedInImages = images.map(async (image) => { return await (0, antiNsfw_1.detectNsfw)(image); });
            const resolvedResponse = await Promise.all(nsfwDetectedInImages);
            const nsfwResponse = resolvedResponse.filter((response) => response !== null);
            if (nsfwResponse.length > 0 && nsfwResponse.some((res) => res?.isHentai || res?.isPorn === true)) {
                this.container.client.emit(antiNsfw.events.nsfwDetect, message, nsfwResponse);
            }
        }
    }
    extractImages(message) {
        const imageRegex = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm);
        const contentMatches = message.content.match(imageRegex) ?? [];
        const attachments = message.attachments.filter((attachment) => attachment.height !== null && attachment.width !== null).map((attachment) => attachment.proxyURL);
        const embeds = message.embeds.filter((embed) => embed.type === 'image').map((embed) => embed.url);
        return [...new Set([...attachments, ...embeds, ...contentMatches])];
    }
};
UserEvent = (0, tslib_1.__decorate)([
    (0, decorators_1.ApplyOptions)({
        name: "antiNsfw:messageHandler",
        event: framework_1.Events.MessageCreate
    })
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=messageHandler.js.map