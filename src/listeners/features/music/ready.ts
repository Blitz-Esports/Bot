import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { editMessage } from '../../../lib/modules/music';
import { failEmbed } from '../../../lib/constants/embed';
import config from '../../../config';
import { Message, MessageCollector, ReactionCollector, TextChannel, VoiceChannel } from 'discord.js';

const { emojis } = config.default;
const { music: musicConfig } = config.features;

@ApplyOptions<ListenerOptions>({
    name: "music:ready",
    event: musicConfig.events.Ready
})
export class UserEvent extends Listener {
    public async run() {

        const { client, logger, music } = this.container;

        const MUSIC_CHANNEL = (await client.channels.fetch(musicConfig.channelId ?? 'undefined').catch(() => { return undefined })) as TextChannel | undefined;
        const MUSIC_MESSAGE = await MUSIC_CHANNEL?.messages.fetch(musicConfig.messageId ?? 'undefined').catch(() => { return undefined });
        if (!MUSIC_CHANNEL || !MUSIC_MESSAGE || MUSIC_MESSAGE.author.id !== client.user?.id) return logger.error('Unable to load music board');

        const messageCollector = new MessageCollector(MUSIC_CHANNEL, { filter: (msg) => msg.content !== '' && !msg.system && !msg.author.bot });
        editMessage(client);
        messageCollector.on('collect', async (message) => {
            if (message.author.bot && message.author.id !== client.user?.id && message.deletable) message.delete().catch();
            else if (message.member?.voice && message.member.voice.channelId === musicConfig.voiceChannelId) {
                try {
                    message.react(emojis.loading);
                    await music.play(message.member.voice.channel as VoiceChannel, message.content, {
                        message: message,
                        textChannel: message.channel as TextChannel,
                        member: message.member
                    });
                    if (message.deletable) message.delete();
                } catch (e) {
                    logger.warn(e);
                    const msg = await message.channel.send({ embeds: [failEmbed('An unexpected error has ocurred.')] });
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 6);
                    if (message.deletable) message.delete();
                }
            } else {
                const msg = await message.channel.send({
                    embeds: [failEmbed(`${message.member?.toString()} you need to be connected to <#${musicConfig.voiceChannelId}> in order to play songs.`)]
                });
                setTimeout(() => {
                    msg.delete();
                }, 1000 * 6);
                if (message.deletable) message.delete().catch();
            }
        });

        const reactionCollector = new ReactionCollector(MUSIC_MESSAGE, {
            filter: (msgReaction, user) => Object.values(musicConfig.emojis).includes(msgReaction.emoji.toString()) && !user.bot
        });
        reactionCollector.on('collect', async (messageReaction, user) => {
            messageReaction.users.remove(user);
            const queue = music.getQueue(messageReaction.message as Message);
            if (!queue || queue.songs.length === 0) {
                return;
            }
            switch (messageReaction.emoji.name) {
                case 'Rewind':
                    queue.seek(queue.currentTime - 10 <= 0 ? 0 : queue.currentTime - 10);
                    break;

                case 'PlayPause':
                    if (queue.paused) queue.resume();
                    else if (queue.playing) queue.pause();
                    editMessage(client, queue, queue.songs[0]);
                    break;

                case 'Stop':
                    await queue.stop();
                    editMessage(client, queue);
                    break;

                case 'FastForward':
                    queue.seek(queue.currentTime + 10);
                    break;

                case 'Skip':
                    try {
                        const newSong = await queue.skip();
                        editMessage(client, queue, newSong);
                    } catch (_) { }
                    break;

                case 'VolumeDown':
                    queue.setVolume(queue.volume - 10 <= 1 ? 1 : queue.volume - 10);
                    break;

                case 'VolumeUp':
                    queue.setVolume(queue.volume + 10 >= 100 ? 100 : queue.volume + 10);
                    break;

                case 'Repeat':
                    queue.setRepeatMode(1);
                    editMessage(client, queue, queue.songs[0]);
                    break;

                case 'Shuffle':
                    try {
                        const newQueue = await queue.shuffle();
                        editMessage(client, newQueue, queue.songs[0]);
                    } catch (_) { }
                    break;

                default:
                    break;
            }
            editMessage(client, queue, queue.songs[0]);
        });

    }
}