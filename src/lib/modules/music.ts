import type { Queue, Song } from 'distube';
import { Client, Message, MessageEmbed, TextChannel } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import config from "../../config";

const { music } = config.features;

export const queueEmbed = (queue: Queue) => {
    if (queue.songs.length === 0) return null;
    const formatQueue = queue?.songs.map((song, i) => {
        return `\`${i + 1 <= 9 ? `0${i + 1}` : i + 1})\` ${song.name ?? 'Unknown Song'} [${song.formattedDuration}]`;
    });
    const queueArray = [...splitArray(formatQueue, 15)];
    const embeds = queueArray.map((arr: string[], i: number) => {
        const em = new MessageEmbed().setColor('BLURPLE').setDescription(arr.join('\n') ?? 'The queue is empty.');
        if (i === 0) em.setAuthor({ name: `Queue list | Total ${queue?.songs.length} tracks` });
        if (i === 2 && queueArray.length > 3) em.addField('\u200B', `*+ **${queue?.songs.length - 45}** tracks.*`);
        return em;
    });
    return embeds.slice(0, 3) ?? null;
};

export const playerEmbed = (queue: Queue, song: Song) => {
    if (queue.songs.length === 0) return null;
    let playerStatus = '⏹ - Stopped';
    if (queue.playing) playerStatus = '▶ - Playing';
    if (queue.paused) playerStatus = '⏸ - Paused';
    const embed = new MessageEmbed()
        .setColor('#DE3047')
        .setThumbnail(`https://cdn.airshift.ml/image/author/${song.id}.png`)
        .setImage(`https://cdn.airshift.ml/image/thumbnail/${song.id}.png`)
        .setTitle(song.name ?? 'Unknown Title')
        .setURL(song.url)
        .addField('Status', playerStatus ?? 'Unknown', true)
        .addField('Author', `[${song.uploader.name ?? 'Unknown'}](${song.uploader.url})`, true)
        .addField('Duration', song.formattedDuration ?? prettyMilliseconds(song.duration), true);
    if (queue.filters.length > 0) embed.addField('Filters', queue.filters.length > 0 ? queue.filters.join(', ') : 'No Filters');
    return embed;
};

export const filters = {
    '3d': 'apulsator=hz=0.125',
    bassboost: 'bass=g=10',
    echo: 'aecho=0.8:0.9:1000:0.3',
    flanger: 'flanger',
    gate: 'agate',
    haas: 'haas',
    karaoke: 'stereotools=mlev=0.1',
    nightcore: 'asetrate=48000*1.25,aresample=48000,bass=g=5',
    reverse: 'areverse',
    vaporwave: 'asetrate=48000*0.8,aresample=48000,atempo=1.1',
    mcompand: 'mcompand',
    phaser: 'aphaser',
    tremolo: 'tremolo',
    surround: 'surround',
    earwax: 'earwax'
};

export const guideEmbed = new MessageEmbed()
    .setColor(11124783)
    .setTitle('Guide')
    .setDescription('Enter the song name or URL to play a song.')
    .addFields(
        {
            name: 'Reaction',
            value: `${music.emojis.rewind} Rewind 10 seconds\n${music.emojis.playpause} Pause\/Resume\n${music.emojis.stop} Stop`,
            inline: true
        },
        {
            name: '\u200b',
            value: `${music.emojis.fastforward} Forward 10 seconds\n${music.emojis.skip} Skip\/Next\n${music.emojis.volumedown} Volume -10%`,
            inline: true
        },
        {
            name: '\u200b',
            value: `${music.emojis.volumeup} Volume +10%\n${music.emojis.repeat} Change repeat mode\n${music.emojis.shuffle} Shuffle the queue`,
            inline: true
        }
    );

function* splitArray(arr: string[], n: number) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export const editMessage = async (client: Client, queue?: Queue, song?: Song): Promise<void> => {
    const MUSIC_CHANNEL = (await client.channels.fetch(music.channelId ?? 'undefined')) as TextChannel | undefined;
    const MUSIC_MESSAGE = await MUSIC_CHANNEL?.messages.fetch(music.messageId ?? 'undefined');
    if (!MUSIC_CHANNEL || !MUSIC_MESSAGE) return;
    const embeds: MessageEmbed[] = [guideEmbed];
    if (queue && queueEmbed(queue)) embeds.push(...(queueEmbed(queue) as MessageEmbed[]));
    if (queue && song && playerEmbed(queue, song)) embeds.push(playerEmbed(queue, song) as MessageEmbed);
    MUSIC_MESSAGE.edit({ embeds, content: null, components: undefined });
    addReactions(MUSIC_MESSAGE);
};

const addReactions = async function (message: Message) {
    const reactions = Object.values(music.emojis);
    if (message.reactions.cache.size !== reactions.length) {
        await message.reactions.removeAll();
        reactions.forEach(async (reaction) => {
            await message.react(reaction);
        });
    }
};