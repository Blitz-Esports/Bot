import { encodeTag } from "./encodeTag";
import config from "../../../../config";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
const { brawlstars } = config.api;

export const getBattlelog = async (tag: string): Promise<null | ABattlelog[]> => {
    try {
        const res = await fetch<RootObject>(`${brawlstars.url}/players/${encodeTag(tag)}/battlelog`, {
            headers: {
                "Authorization": `Bearer ${brawlstars.token}`
            }
        }, FetchResultTypes.JSON);
        return res.items;
    } catch (e) {
        return null;
    }
}

export type ABattlelog = Item;

interface Event {
    id: number;
    map: string;
    mode: string;
}

interface Brawler {
    id: number;
    name: string;
    power: number;
    trophies: number;
}

interface StarPlayer {
    tag: string;
    name: string;
    brawler: Brawler;
}

interface Battle {
    mode: string;
    type: string;
    result: string;
    duration: number;
    starPlayer: StarPlayer;
    teams: any[][];
    trophyChange?: number;
    players: any[];
}

interface Item {
    battleTime: string;
    event: Event;
    battle: Battle;
}

interface Cursors {
}

interface Paging {
    cursors: Cursors;
}

interface RootObject {
    items: Item[];
    paging: Paging;
}