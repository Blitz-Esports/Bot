import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import config from '../../../../../config';
import type { PerspectiveAPIResponse } from '../../../../../lib/api/antiProfanity';
import { createWarn } from '../../../../../lib/modules/warn';

const { antiProfanity } = config.features.automod;

@ApplyOptions<ListenerOptions>({
    name: "antiProfanity:ProfanityDetect",
    event: antiProfanity.events.ProfanityDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, _response: PerspectiveAPIResponse) {

        await createWarn(message.author.id, message.guild?.me?.id || "unknown", `[AutoMod] Inappropriate language`);
        await message.react(antiProfanity.emojis.detect);

    }

}