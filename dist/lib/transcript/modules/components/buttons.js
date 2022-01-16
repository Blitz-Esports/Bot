"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonComponent = void 0;
const twemoji_parser_1 = require("twemoji-parser");
const buttonComponent = (message) => {
    const messageActionRowComponent = message.components
        .map((component) => component.components)
        .map((components) => components.filter((cmp) => cmp.type === 'BUTTON'));
    let actionRows = [];
    messageActionRowComponent.forEach((messageActionRow) => {
        let components = [];
        messageActionRow.forEach((button) => {
            const emoji = button.emoji
                ? button.emoji.id
                    ? `https://cdn.discordapp.com/emojis/${button.emoji.id}.png`
                    : (0, twemoji_parser_1.parse)(button.emoji.name)[0].url
                : null;
            components.push(`<discord-button type="${getButtonType(button.style)}" ${button.url ? `url="${button.url}"` : ''} ${emoji ? `emoji="${emoji}"` : ''} ${button.emoji?.name ? `emoji-name="${button.emoji.name}"` : ''}> ${button.label} </discord-button>`);
        });
        actionRows.push(components.length > 0 ? `<discord-action-row>\n${components.join('\n')}\n</discord-action-row>` : '');
    });
    return actionRows.join('\n');
};
exports.buttonComponent = buttonComponent;
function getButtonType(type) {
    if (type === 'DANGER')
        return 'destructive';
    else
        return type.toLowerCase();
}
//# sourceMappingURL=buttons.js.map