import { Listener } from '@sapphire/framework';
import { User } from 'discord.js';
import type { Message } from 'discord.js';
export declare class UserEvent extends Listener {
    run(message: Message, { receiver }: EventEmittedOptions): Promise<void>;
    private makeUserMessageEmbed;
}
interface EventEmittedOptions {
    receiver: User;
}
export {};
//# sourceMappingURL=ChannelMessageCreate.d.ts.map