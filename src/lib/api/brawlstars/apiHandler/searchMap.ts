import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { filter } from "smart-array-filter";

let mapsCache: null | AMap[] = null;
export const searchMap = async (query: string) => {
    try {
        if (!mapsCache) {
            const res = await fetch<{ list: AMap[] }>("https://api.brawlapi.com/v1/maps", FetchResultTypes.JSON);
            mapsCache = res.list;
        }

        const searchedMaps = filter(mapsCache, {
            caseSensitive: false,
            keywords: `name:${query}`
        });

        return searchedMaps;
    } catch (e) {
        return null;
    }
}

export interface AMap {
    id: number;
    name: string;
    hash: string;
    imageUrl: string;
}