import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageActionRow, MessageButton, MessageEmbed, ThreadChannel, User } from 'discord.js';
import moment from 'moment';
import config from '../../../../config';

const { features, server } = config;
const { modmail } = features;

@ApplyOptions<ListenerOptions>({
    event: modmail.events.SessionStart
})
export class UserEvent extends Listener {
    public async run(author: User, thread: ThreadChannel) {
        this.sendUserInfoMessage(author, thread);
        this.sendUserWelcomeMessage(author);
    }

    public async sendUserInfoMessage(author: User, thread: ThreadChannel) {
        const msg = await thread.send({
            embeds: [
                new MessageEmbed()
                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                    .setAuthor({ name: `${author.tag} (${author.id})`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                    .addField('Created At', `${moment(author.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`)
                    .setFooter({ text: `${author.tag}`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            components: [
                new MessageActionRow().setComponents([
                    new MessageButton().setCustomId(`${author.id}-modmail-close`).setStyle('DANGER').setLabel('Close'),
                    new MessageButton().setStyle('LINK').setLabel('Transcript').setURL(`${server.host}/modmail/${thread.id}`)
                ])
            ]
        });
        msg.pin().catch();
    }

    public sendUserWelcomeMessage(author: User) {
        author.send({
            embeds: [
                new MessageEmbed(modmail.defaultMessages.branding)
                    .setTitle('Thank You For Contacting The Support')
                    .setDescription('The support team will get back to you as soon as possible.')
                    .setColor('NOT_QUITE_BLACK')
            ]
        });
    }
}