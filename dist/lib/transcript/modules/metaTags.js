"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaTagComponent = void 0;
const tslib_1 = require("tslib");
const config_1 = (0, tslib_1.__importDefault)(require("../../../config"));
const metaTagComponent = (messageCollection, id) => {
    const message = messageCollection.first() ?? messageCollection.last();
    const channel = message.channel;
    const user = message.client.users.cache.get(channel.name) ?? message.client.users.cache.get(channel.name.split(' | ')[0]);
    const tags = [
        `<meta property="og:type" content="website">`,
        `<meta property="og:site_name" content="TKE - Server">`,
        `<meta property="og:title" content="Transcript - ${id ?? message.channelId}">`,
        `<meta property="og:description" content="${user ? `This transcript is owned by ${user.tag} (${user.id}).` : ''}\nThere are ${messageCollection.size} messages in this transcript.">`,
        `<meta property="og:image" content="${channel.guild.iconURL({ dynamic: true })}">`,
        `<meta name="theme-color" content="${config_1.default.default.colors.theme}">`
    ];
    return tags.join('\n');
};
exports.metaTagComponent = metaTagComponent;
//# sourceMappingURL=metaTags.js.map