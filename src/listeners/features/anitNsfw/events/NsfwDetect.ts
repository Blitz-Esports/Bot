import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { nanoid } from 'nanoid';
import config from '../../../../config';
import type { AntiNsfw } from '../../../../lib/api/antiNsfw';
import { warnEmbed } from '../../../../lib/constants/embed';

const { antiNsfw } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "antiNsfw:nsfwDetect",
    event: antiNsfw.events.nsfwDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, response: AntiNsfw[]) {

        const data = await this.container.database.models.bin.create({
            id: nanoid(),
            data: JSON.stringify(response)
        });

        await message.reply({
            embeds: [warnEmbed(`${message.author.toString()} has been warned. **Reason**: Posting NSFW content.`)],
            components: [
                new MessageActionRow().setComponents(new MessageButton()
                    .setStyle("LINK")
                    .setURL(`${config.server.host}/bin/${data.toJSON().id}`)
                    .setLabel("View Raw")
                )]
        });

        if (antiNsfw.deleteMessageOnDetect && message.deletable) message.delete();
    }
}