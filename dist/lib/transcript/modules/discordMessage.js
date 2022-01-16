"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordMessage = void 0;
const tslib_1 = require("tslib");
const embeds_1 = require("./components/embeds");
const buttons_1 = require("./components/buttons");
const reactions_1 = require("./components/reactions");
const content_1 = require("./components/content");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const attachment_1 = require("./components/attachment");
const discordMessage = (message) => {
    if (message.system)
        return ''; // TODO: Add system message support
    return `<discord-message profile="${message.author.id}" timestamp="${(0, moment_1.default)(message.createdAt).format('DD/MM/YYYY')}">${(0, content_1.contentComponent)(message)}\n${(0, embeds_1.embedComponent)(message)}\n${(0, attachment_1.attachmentComponent)(message)}\n${(0, reactions_1.reactionComponent)(message)}\n${(0, buttons_1.buttonComponent)(message)}\n</discord-message>`;
};
exports.discordMessage = discordMessage;
//# sourceMappingURL=discordMessage.js.map