import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { nanoid } from 'nanoid';
import config from '../../../../../config';
import type { AntiNsfw } from '../../../../../lib/api/antiNsfw';
import { warnEmbed } from '../../../../../lib/constants/embed';
import { createWarn } from '../../../../../lib/modules/warn';

const { antiNsfw } = config.features.automod;

@ApplyOptions<ListenerOptions>({
    name: "antiNsfw:nsfwDetect",
    event: antiNsfw.events.NsfwDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, response: AntiNsfw[]) {

        const data = await this.container.database.models.bin.create({
            id: nanoid(),
            data: JSON.stringify(response)
        });

        await createWarn(message.author.id, message.guild?.me?.id || "unknown", `[AutoMod] NSFW detected`);

        await message.reply({
            embeds: [warnEmbed(`${message.author.toString()} has been warned. **Reason**: [AutoMod] Posting NSFW content.`)],
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