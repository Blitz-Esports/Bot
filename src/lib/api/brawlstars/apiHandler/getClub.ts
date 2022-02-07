import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { encodeTag } from "./encodeTag";
import config from "../../../../config";
const { brawlstars } = config.api;

export const getClub = async (tag: string) => {
    try {
        const response = await fetch<AClub>(`${brawlstars.url}/clubs/${encodeTag(tag)}`, {
            headers: {
                "Authorization": `Bearer ${brawlstars.token}`
            }
        }, FetchResultTypes.JSON);
        return response;
    } catch (e) {
        return null;
    }
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