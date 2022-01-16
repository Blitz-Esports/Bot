import type { Message, Collection } from 'discord.js';
export declare const $discordMessage: (messageCollection: Collection<string, Message>) => string;
export interface Profiles {
    [id: string]: MessageObject;
}
export interface MessageObject {
    id: string;
    author: string;
    avatar: string;
    bot: boolean;
    verified: boolean | null;
    roleColor: string;
}
//# sourceMappingURL=$discordMessage.d.ts.map