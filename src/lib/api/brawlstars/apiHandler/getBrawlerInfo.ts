import { fetch, FetchResultTypes } from "@sapphire/fetch";

let brawlerInfoCache: ABrawlerInfo[] | null = null;
export const getBrawlerInfo = async () => {
    if (brawlerInfoCache) return brawlerInfoCache;
    try {
        const res = await fetch<{ list: ABrawlerInfo[] }>("https://api.brawlapi.com/v1/brawlers", FetchResultTypes.JSON);
        brawlerInfoCache = res.list;
        return res.list;
    } catch (e) {
        return null;
    }
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