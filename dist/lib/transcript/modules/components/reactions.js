"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionComponent = void 0;
const twemoji_parser_1 = require("twemoji-parser");
const reactionComponent = (message) => {
    let reactionsArray = [];
    message.reactions.cache.forEach((reaction) => {
        const emojiName = reaction.emoji.name;
        reactionsArray.push({
            name: reaction.emoji.name ?? reaction.emoji.id,
            emoji: reaction.emoji.url ?? (0, twemoji_parser_1.parse)(emojiName)[0].url,
            count: reaction.count
        });
    });
    let reactionComponentArray = reactionsArray.map((v) => {
        return `<discord-reaction name="${v.name}" emoji="${v.emoji}" count="${v.count}"> \n</discord-reaction>`;
    });
    if (reactionsArray.length > 0)
        return `<discord-reactions slot="reactions">\n${reactionComponentArray.join('\n')}\n </discord-reactions>`;
    else
        return '';
};
exports.reactionComponent = reactionComponent;
//# sourceMappingURL=reactions.js.map