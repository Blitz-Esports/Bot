import { Collection, Message } from 'discord.js';
export declare const generateTranscript: (_messageCollection: Collection<string, Message>, options?: Options | undefined) => string;
export declare const saveTranscript: (transcript: string) => Promise<Transcript>;
export declare const createAndSaveTranscript: (messageCollection: Collection<string, Message>) => Promise<Transcript>;
interface Transcript {
    id: string;
    value: string;
}
interface Options {
    id?: string;
}
export {};
//# sourceMappingURL=index.d.ts.map