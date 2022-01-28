import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Interaction, MessageEmbed } from 'discord.js';
import { failEmbed } from '../../../lib/constants/embed';

@ApplyOptions<ListenerOptions>({
    name: "embedBuilder:preview",
    event: Events.InteractionCreate
})
export class UserEvent extends Listener {
    public async run(interaction: Interaction) {
        if (!interaction.isButton() || !interaction.customId.startsWith("embedBuilder:preview")) return;
        await interaction.deferReply({ ephemeral: true });

        let data: any = await this.container.database.models.token.findOne({ where: { id: interaction.customId.split("=")[1] ?? "null" } });
        if (!data) return interaction.editReply({ embeds: [failEmbed(`Unable to fetch the embed data.`)] });

        data = data.toJSON().metaData;

        const response = await interaction.editReply({ content: data.content, embeds: Object.keys(data.embed ?? {}).length > 0 ? [new MessageEmbed(data.embed)] : undefined }).catch(() => null);
        if (!response) return interaction.editReply({ embeds: [failEmbed("An error occurred while sending the preview embed. The embed json might be invalid.")] });
        return;
    }
}