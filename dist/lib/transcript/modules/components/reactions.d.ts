import type { Message } from 'discord.js';
export declare const reactionComponent: (message: Message) => string;
export interface ReactionArray extends Array<ReactionArrayObject> {
}
export interface ReactionArrayObject {
    name: string | null;
    emoji: string;
    count: number;
}
//# sourceMappingURL=reactions.d.ts.map