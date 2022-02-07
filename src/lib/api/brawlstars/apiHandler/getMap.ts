import { fetch, FetchResultTypes } from "@sapphire/fetch";

export const getMap = async (mapId: string) => {
    try {
        const res = await fetch<AMapInfo>(`https://api.brawlapi.com/v1/maps/${mapId}`, FetchResultTypes.JSON);
        return res;
    } catch (e) {
        return null;
    }
}

export interface AMapInfo {
    id: number;
    new: boolean;
    disabled: boolean;
    name: string;
    hash: string;
    link: string;
    imageUrl: string;
    credit: string;
    gameMode: {
        id: number;
        name: string;
        hash: string;
        version: number;
        color: string;
        link: string;
        imageUrl: string;
    };
    lastActive: number;
    stats: {
        brawler: number;
        winRate: number;
        useRate: number;
        starRate: number;
    }[];
    teamStats: {
        name: string;
        hash: string;
        brawler1: number;
        brawler2: number;
        brawler3: number;
        data: {
            winRate: number;
            useRate: number;
            wins: number;
            losses: number;
            draws: number;
            total: number;
        }
    }[];
}