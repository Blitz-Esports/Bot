import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { encodeTag } from "./encodeTag";
import config from "../../../../config";
const { brawlstars } = config.api;

export const getPlayer = async (tag: string) => {
    try {
        const response = await fetch<APlayer>(`${brawlstars.url}/players/${encodeTag(tag)}`, {
            headers: {
                "Authorization": `Bearer ${brawlstars.token}`
            }
        }, FetchResultTypes.JSON);
        return response;
    } catch (e) {
        return null;
    }
}

export interface APlayer {
    name: string;
    tag: string;
    nameColor: string;
    icon: {
        id: number;
    }
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
        tag?: string,
        name?: string
    }
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
        }[]
    }[]
}