import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../../config';
const { levelling } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "levelling:levelUp",
    event: levelling.events.LevelUp
})
export class UserEvent extends Listener {
    public async run(_userId: string, newLevel: number, message: Message) {

        this.container.logger.debug(`${message.author.tag} has leveled up to level: ${newLevel}`);

    }

}