/// <reference types="node" />
export declare const brawlstarsEmojis: {
    unknown: string;
    role: {
        member: string;
        senior: string;
        vicePresident: string;
        president: string;
    };
    entrance: {
        open: string;
        closed: string;
        inviteOnly: string;
    };
    icons: {
        trophy_player: string;
        trophy_highest: string;
        trophy_club: string;
        trophy_normal: string;
        trophy_required: string;
        trophy_highest_crown: string;
        required_trophies: string;
        exp: string;
        power_play_points: string;
        highest_power_play_points: string;
        champion_ship: string;
        brawlers: string;
        star_powers: string;
        gadgets: string;
        star_points: string;
        "3v3": string;
        duo: string;
        solo: string;
        robo_rumble: string;
        club: string;
        members: string;
        list: string;
        crown: string;
    };
};
export declare const encodeTag: (tag: string) => string;
export declare const getClub: (tag: string) => Promise<AClub | null>;
export declare const getPlayer: (tag: string) => Promise<APlayer | null>;
export declare const getBrawlerInfo: () => Promise<ABrawlerInfo[] | null>;
export interface APlayer {
    name: string;
    tag: string;
    nameColor: string;
    icon: {
        id: number;
    };
    trophies: number;
    highestTrophies: number;
    highestPowerPlayPoints: number;
    expLevel: number;
    expPoints: number;
    isQualifiedFromChampionshipChallenge: boolean;
    "3vs3Victories": number;
    soloVictories: number;
    duoVictories: number;
    bestRoboRumbleTime: number;
    bestTimeAsBigBrawler: number;
    club: {
        tag?: string;
        name?: string;
    };
    brawlers: {
        id: number;
        name: string;
        power: number;
        rank: number;
        trophies: number;
        highestTrophies: number;
        starPowers: {
            id: number;
            name: string;
        }[];
        gadgets: {
            id: number;
            name: string;
        }[];
    }[];
}
export interface AClub {
    name: string;
    tag: string;
    description: string;
    type: "open" | "inviteOnly" | "closed";
    badgeId: number;
    requiredTrophies: number;
    trophies: number;
    members: AClubMember[];
}
export interface AClubMember {
    tag: string;
    name: string;
    nameColor: string;
    role: 'member' | 'senior' | 'vicePresident' | 'president';
    trophies: number;
    icon: {
        id: string;
    };
}
export interface ABrawlerInfo {
    id: number;
    avatarId: number;
    name: string;
    hash: string;
    path: string;
    released: boolean;
    version: number;
    link: string;
    imageUrl: string;
    imageUrl2: string;
    imageUrl3: string;
    class: {
        id: number;
        name: string;
    };
    rarity: {
        id: number;
        name: string;
        color: string;
    };
    unlock: number | null;
    description: string;
    starPowers: {
        id: number;
        name: string;
        path: string;
        version: number;
        description: string;
        imageUrl: string;
        released: boolean;
    }[];
    gadgets: {
        id: number;
        name: string;
        path: string;
        version: number;
        description: string;
        imageUrl: string;
        released: boolean;
    }[];
}
export declare const generateBrawlerCard: (brawlerId: number, powerLevel: number, rank: number, trophies: number, brawlerStarPowers: BrawlerCardStarPowers[], brawlerGadgets: BrawlerCardGadgets[]) => Promise<Buffer | null>;
interface BrawlerCardGadgets {
    id: number;
    name: string;
}
interface BrawlerCardStarPowers {
    id: number;
    name: string;
}
export declare const generateBrawlerListCard: (player: APlayer) => Promise<Buffer[]>;
export {};
//# sourceMappingURL=brawlstars.d.ts.map