"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyEvent = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const colorette_1 = require("colorette");
const main_1 = require("../lib/database/main");
const loadWorkers_1 = require("../lib/workers/loadWorkers");
const discord_logs_1 = (0, tslib_1.__importDefault)(require("discord-logs"));
const dev = process.env.NODE_ENV !== 'production';
class ReadyEvent extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true
        });
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dev ? colorette_1.yellow : colorette_1.blue
        });
    }
    async run() {
        this.printBanner();
        this.printStoreDebugInformation();
        //* Load modules
        await this.initializeDatabase();
        (0, loadWorkers_1.loadWorkers)();
        (0, discord_logs_1.default)(this.container.client);
        //* Unloads and loads the listeners again
        this.reloadListeners();
    }
    printBanner() {
        const success = (0, colorette_1.green)('+');
        const llc = dev ? colorette_1.magentaBright : colorette_1.white;
        const blc = dev ? colorette_1.magenta : colorette_1.blue;
        const line01 = llc('');
        const line02 = llc('');
        const line03 = llc('');
        // Offset Pad
        const pad = ' '.repeat(7);
        console.log(String.raw `${line01} ${pad}${blc('1.0.0')} - ${line02} ${pad}[${success}] Gateway - ${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}`.trim());
    }
    printStoreDebugInformation() {
        const { client, logger } = this.container;
        const stores = [...client.stores.values()];
        const last = stores.pop();
        for (const store of stores)
            logger.info(this.styleStore(store, false));
        logger.info(this.styleStore(last, true));
    }
    styleStore(store, last) {
        return (0, colorette_1.gray)(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
    }
    reloadListeners() {
        this.container.stores.get('listeners').loadAll();
    }
    async initializeDatabase() {
        const database = await (0, main_1.initializeDatabase)();
        this.container.database = database;
    }
}
exports.ReadyEvent = ReadyEvent;
//# sourceMappingURL=ready.js.map