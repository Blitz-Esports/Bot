"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentComponent = void 0;
const discord_markdown_1 = require("discord-markdown");
const contentComponent = (message) => {
    const { client } = message;
    const options = {
        discordCallback: {
            user: (u) => {
                const user = client.users.cache.get(u.id) ?? message.guild?.members.cache.get(u.id)?.user;
                if (user)
                    return `<discord-mention>${user.username}</discord-mention>`;
                else
                    return `@${u.id}`;
            },
            channel: (c) => {
                const channel = client.channels.cache.get(c.id);
                if (channel)
                    return `<discord-mention type="channel">${channel.name}</discord-mention>`;
                else
                    return `#${c.id}`;
            },
            role: (r) => {
                const role = message.guild?.roles.cache.get(r.id);
                if (role)
                    return `<discord-mention type="role" color="${role.hexColor}">${role.name}</discord-mention>`;
                else
                    return `@&${r.id}`;
            },
            everyone: () => `<discord-mention type="role" color="#FFFFFF">everyone</discord-mention>`,
            here: () => `<discord-mention type="role" color="#FFFFFF">here</discord-mention>`
        }
    };
    return (0, discord_markdown_1.toHTML)(message.content, options);
};
exports.contentComponent = contentComponent;
//# sourceMappingURL=content.js.map