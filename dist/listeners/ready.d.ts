import type { ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Sequelize } from 'sequelize/dist';
export declare class ReadyEvent extends Listener {
    private readonly style;
    constructor(context: PieceContext, options?: ListenerOptions);
    run(): Promise<void>;
    private printBanner;
    private printStoreDebugInformation;
    private styleStore;
    private reloadListeners;
    private initializeDatabase;
}
declare module '@sapphire/pieces' {
    interface Container {
        database: Sequelize;
    }
}
//# sourceMappingURL=ready.d.ts.map