import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import config from '../../../config';

const { modmail } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "modmail:interactionHandler",
    event: Events.InteractionCreate
})
export class UserEvent extends Listener {
    public async run(interaction: Interaction) {
        if (!interaction.isButton() || !interaction.channel?.isThread()) return;

        if (interaction.customId.endsWith('modmail-close')) {
            this.container.client.emit(modmail.events.SessionEnd, interaction);
        }
    }
}