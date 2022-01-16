import type { AClub } from "../../../api/brawlstars";
export declare const clubLogHandler: (dbClub: IClub, apiClub: AClub) => Promise<ClubLogs[]>;
interface IClub {
    id: string;
    name: string;
    rawData: AClub;
    clubLogs: ClubLogs[];
}
export interface ClubLogs {
    type: 'members' | 'settings' | 'roles';
    data: ClubLogsData;
    timestamp: string;
}
interface ClubLogsData {
    joined?: boolean;
    player?: {
        name: string;
        tag: string;
        club: {
            tag: string;
            name: string;
        } | {};
    };
    data?: {
        type: 'status' | 'description' | 'badge' | 'requirement' | 'role';
        old: string;
        new: string;
    };
}
export {};
//# sourceMappingURL=clubLogHandler.d.ts.map