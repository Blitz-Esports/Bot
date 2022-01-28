import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { APIEmbed } from "discord-api-types";
import { MessageActionRow, MessageButton, User } from "discord.js";
import { successEmbed } from "../../../lib/constants/embed";
import config from '../../../config';

const { embedBuilder } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "embedBuilder:embedCreate",
    event: embedBuilder.events.EmbedCreate
})
export class UserEvent extends Listener {
    public async run(body: Body, user: User) {

        return await user.send({
            embeds: [successEmbed(`Embed successfully created. Run: \`/embedbuilder send\` command in the server to send the embed.`)],
            components: [
                new MessageActionRow()
                    .setComponents(
                        new MessageButton()
                            .setCustomId(`embedBuilder:preview=${body.token}`)
                            .setLabel("Preview Embed")
                            .setStyle("SUCCESS")
                    )
            ]
        });

    }
}

interface Body {
    token: string;
    data: {
        content?: string;
        embed?: APIEmbed | {};
    }
}