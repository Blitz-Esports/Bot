import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener, ListenerOptions } from '@sapphire/framework';
import { nanoid } from 'nanoid';
import { failEmbed } from '../../lib/constants/embed';

@ApplyOptions<ListenerOptions>({
    name: "error:commandError",
    event: Events.ChatInputCommandError
})
export class ErrorEvent extends Listener {

    public async run(error: any, context: ChatInputCommandErrorPayload) {

        const uId = nanoid();

        await this.container.database.models.bin.create({
            id: uId,
            data: error.stack
        });

        context.interaction[context.interaction.replied ? "editReply" : "reply"]({
            embeds: [
                failEmbed(`Something went wrong during the execution of this command.\n**Code**: \`${uId}\``)
            ]
        });

    }

}