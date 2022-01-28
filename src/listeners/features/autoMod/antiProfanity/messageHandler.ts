import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../../config';
import { detectProfanity } from '../../../../lib/api/antiProfanity';
const { antiProfanity } = config.features.automod;

@ApplyOptions<ListenerOptions>({
    name: antiProfanity.events.ChannelMessageCreate,
    event: Events.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {

        if (!antiProfanity.enabled || message.system || message.author.bot || message.guildId !== antiProfanity.guildId || message.content === "") return;
       
        const apiResponse = await detectProfanity(message.content);
        
        if (apiResponse) {
            this.container.client.emit(antiProfanity.events.ProfanityDetect, message, apiResponse);
        }

    }
}