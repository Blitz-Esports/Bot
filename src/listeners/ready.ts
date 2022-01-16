import type { ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import DisTube from "distube";
import SpotifyPlugin from '@distube/spotify';
import SoundCloudPlugin from '@distube/soundcloud';
import type { Sequelize } from 'sequelize/dist';
import { initializeDatabase } from '../lib/database/main';
import { loadWorkers } from '../lib/workers/loadWorkers';
import discordLogs from "discord-logs";

const dev = process.env.NODE_ENV !== 'production';

export class ReadyEvent extends Listener {

    private readonly style = dev ? yellow : blue;

    public constructor(context: PieceContext, options?: ListenerOptions) {
        super(context, {
            ...options,
            once: true
        });
    }

    public async run() {
        this.printBanner();
        this.printStoreDebugInformation();

        //* Load modules
        await this.initializeDatabase();
        loadWorkers();
        discordLogs(this.container.client);
        await this.loadMusicModule();

        //* Unloads and loads the listeners again
        this.reloadListeners();
    }

    private printBanner() {
        const success = green('+');

        const llc = dev ? magentaBright : white;
        const blc = dev ? magenta : blue;

        const line01 = llc('');
        const line02 = llc('');
        const line03 = llc('');

        // Offset Pad
        const pad = ' '.repeat(7);

        console.log(String.raw`${line01} ${pad}${blc('1.0.0')} - ${line02} ${pad}[${success}] Gateway - ${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}`.trim());
    }

    private printStoreDebugInformation() {
        const { client, logger } = this.container;
        const stores = [...client.stores.values()];
        const last = stores.pop()!;

        for (const store of stores) logger.info(this.styleStore(store, false));
        logger.info(this.styleStore(last, true));
    }

    private styleStore(store: Store<any>, last: boolean) {
        return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
    }

    private reloadListeners() {
        this.container.stores.get('listeners').loadAll();
    }

    private async loadMusicModule() {

        if (this.container.config.features.music.enabled) {
            this.container.music = new DisTube(this.container.client, {
                leaveOnEmpty: true,
                leaveOnFinish: false,
                leaveOnStop: false,
                nsfw: false,
                plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin()]
            });
            this.container.client.emit(this.container.config.features.music.events.ready);
        } else this.container.logger.debug("Music module is disabled.");

    }

    private async initializeDatabase() {
        const database = await initializeDatabase();
        this.container.database = database;
    }

}

declare module '@sapphire/pieces' {
    interface Container {
        database: Sequelize;
        music: DisTube;
    }
}