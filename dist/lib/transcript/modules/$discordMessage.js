"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$discordMessage = void 0;
const $discordMessage = (messageCollection) => {
    const messageArray = messageCollection.map((message) => {
        return {
            id: message.author.id,
            author: message.author.username,
            avatar: message.author.displayAvatarURL({ dynamic: true }),
            bot: message.author.bot,
            verified: message.author.bot ? message.author.flags?.has('VERIFIED_BOT') : null,
            roleColor: message.member?.displayHexColor ?? '#FFFFFF'
        };
    });
    let messageObject = {};
    messageArray.forEach((profile) => {
        messageObject[profile.id] = profile;
    });
    return `<script>\n\nwindow.$discordMessage = {\nprofiles:${JSON.stringify(messageObject)}}\n\n</script>`;
};
exports.$discordMessage = $discordMessage;
//# sourceMappingURL=$discordMessage.js.map