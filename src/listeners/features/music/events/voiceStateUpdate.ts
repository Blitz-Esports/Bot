import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { VoiceState } from 'discord.js';
import config from '../../../../config';
import { editMessage } from '../../../../lib/modules/music';

const { music } = config.features;

@ApplyOptions<ListenerOptions>({
    name: 'music:voiceStateUpdate',
    event: 'voiceStateUpdate',
})
export class UserEvent extends Listener {
    public run(oldState: VoiceState, newState: VoiceState) {
        if (newState.member?.user.bot || newState.channelId === oldState.channelId || !music.enabled) return;
        const queue = this.container.music.getQueue(newState);
        if (!queue) return;

        if (
            newState.channelId !== music.voiceChannelId &&
            oldState.channelId === music.voiceChannelId &&
            oldState.channel?.members.filter((m) => !m.user.bot).size === 0 &&
            queue.playing &&
            !queue.paused
        ) {
            queue.pause();
            editMessage(this.container.client, queue, queue.songs[0]);
        }

        if (newState.channelId === music.voiceChannelId && queue.paused) {
            queue.resume();
            editMessage(this.container.client, queue, queue.songs[0]);
        }
    }
}
