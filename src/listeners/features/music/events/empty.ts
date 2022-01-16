import { Listener, ListenerOptions, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Queue } from 'distube';
import { editMessage } from '../../../../lib/modules/music';

@ApplyOptions<ListenerOptions>({
    name: "music:empty",
    event: "empty",
	emitter: container.music
})
export class UserEvent extends Listener {
	public run(_queue: Queue) {
		editMessage(this.container.client);
	}
}
