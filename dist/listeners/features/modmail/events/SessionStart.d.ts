import { Listener } from '@sapphire/framework';
import { ThreadChannel, User } from 'discord.js';
export declare class UserEvent extends Listener {
    run(author: User, thread: ThreadChannel): Promise<void>;
    sendUserInfoMessage(author: User, thread: ThreadChannel): Promise<void>;
    sendUserWelcomeMessage(author: User): void;
}
//# sourceMappingURL=SessionStart.d.ts.map