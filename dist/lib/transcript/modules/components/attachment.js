"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentComponent = void 0;
const attachmentComponent = (message) => {
    let discordAttachmentArray = [];
    message.attachments.forEach((attachment) => {
        discordAttachmentArray.push(`<discord-attachment slot="attachments" url="${attachment.proxyURL}" height="${attachment.height}" width="${attachment.width}" alt="${attachment.name}"/>`);
    });
    return discordAttachmentArray.join('\n') ?? '';
};
exports.attachmentComponent = attachmentComponent;
//# sourceMappingURL=attachment.js.map