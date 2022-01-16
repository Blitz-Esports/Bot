import { Listener, ListenerOptions, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Queue } from 'distube';
import { editMessage } from '../../../../lib/modules/music';

@ApplyOptions<ListenerOptions>({
    name: "music:addSong",
    event: "addSong",
    emitter: container.music
})
export class UserEvent extends Listener {
    public run(queue: Queue) {
        editMessage(this.container.client, queue, queue.songs[0]);
    }
}
