import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { nanoid } from 'nanoid';

@ApplyOptions<ListenerOptions>({
    name: "error:uncaughtException",
    event: "uncaughtException",
    emitter: process
})
export class ErrorEvent extends Listener {

    public async run(error: any) {

        const uId = nanoid();

        await this.container.database.models.bin.create({
            id: uId,
            data: error.stack
        });

        this.container.logger.error(`Uncaught exception: ${error.stack}`);

    }
}