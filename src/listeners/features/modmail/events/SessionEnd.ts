import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { ButtonInteraction, MessageEmbed } from 'discord.js';
import moment from 'moment';
import config from '../../../../config';
import { failEmbed, successEmbed } from '../../../../lib/constants/embed';

const { features } = config;
const { modmail } = features;

@ApplyOptions<ListenerOptions>({
    event: modmail.events.SessionEnd
})
export class UserEvent extends Listener {
    public async run(buttonInteraction: ButtonInteraction) {
        if (!buttonInteraction.channel?.isThread()) return;
        else if (buttonInteraction.channel.parentId !== modmail.channelId) return;
        await buttonInteraction.deferReply({ ephemeral: true });
        const threadUser = await this.container.client.users.fetch(buttonInteraction.channel.name).catch(() => null);

        if (buttonInteraction.channel.editable) {
            await buttonInteraction.channel.edit({
                name: `${buttonInteraction.channel.name} | ${moment().toISOString()}`
            });
            await buttonInteraction.channel.send({ embeds: [successEmbed(`${buttonInteraction.message.author.toString()} closed this thread.`)] });
            if (!buttonInteraction.channel.archived) buttonInteraction.channel.setArchived().catch();
            buttonInteraction.editReply({ content: 'Closed the thread.' });
        } else {
            buttonInteraction.channel.send({ embeds: [failEmbed(`Unable to close this thread.`)] });
            buttonInteraction.editReply({ content: 'Unable to close the thread.' });
        }

        if (threadUser) {
            threadUser
                .send({
                    embeds: [
                        new MessageEmbed(modmail.defaultMessages.branding)
                            .setTitle('The Support Has Been Closed!')
                            .setDescription(
                                'Message again to open a new support session.\nThe conversation has been recorded and can be requested/viewed upon request.'
                            )
                            .setColor('NOT_QUITE_BLACK')
                    ]
                })
                .catch();
        }
    }
}