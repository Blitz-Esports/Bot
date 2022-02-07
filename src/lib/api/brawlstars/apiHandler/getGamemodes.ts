import { fetch, FetchResultTypes } from "@sapphire/fetch"

let gamemodesCache: AGamemode[] | null = null;
export const getGamemodes = async () => {
    if (gamemodesCache) return gamemodesCache;
    try {
        const res = await fetch<{ list: AGamemode[] }>("https://api.brawlapi.com/v1/gamemodes", FetchResultTypes.JSON);
        return res.list;
    } catch (e) {
        return null;
    }
}

export interface AGamemode {
    id: number;
    name: string;
    hash: string;
    scHash: string;
    disabled: boolean;
    color: string;
    version: number;
    title: string;
    tutorial: string;
    description: string;
    shortDescription: string;
    sort1: number;
    sort2: number;
    link: string;
    imageUrl: string;
    imageUrl2: string;
}