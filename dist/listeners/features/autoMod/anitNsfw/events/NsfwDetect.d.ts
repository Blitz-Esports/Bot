import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import type { AntiNsfw } from '../../../../../lib/api/antiNsfw';
export declare class UserEvent extends Listener {
    run(message: Message, response: AntiNsfw[]): Promise<void>;
}
//# sourceMappingURL=NsfwDetect.d.ts.map