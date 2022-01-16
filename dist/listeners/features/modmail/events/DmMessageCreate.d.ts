import { Listener } from '@sapphire/framework';
import { Guild, TextChannel, ThreadChannel } from 'discord.js';
import type { Message } from 'discord.js';
export declare class UserEvent extends Listener {
    run(message: Message, { thread, modmailChannel }: EventEmittedOptions): Promise<void>;
    private makeUserMessageEmbed;
}
interface EventEmittedOptions {
    thread: ThreadChannel | null;
    modmailChannel: TextChannel;
    modmailGuild: Guild;
}
export {};
//# sourceMappingURL=DmMessageCreate.d.ts.map