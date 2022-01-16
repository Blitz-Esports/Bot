import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
export declare class UserEvent extends Listener {
    run(member: GuildMember, user: {
        id: string;
        tag: string;
        name: string;
    }): Promise<void>;
}
//# sourceMappingURL=MemberJoin.d.ts.map