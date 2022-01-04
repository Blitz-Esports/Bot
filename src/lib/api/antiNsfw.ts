import axios from "axios";
import config from "../../config";
const { antiNsfw } = config.features.automod;

const API_URL = "https://api.tke-esports.tk/api/nsfw/classify";

export const detectNsfw = async (url: string) => {
    try {
        const rawRequest = await axios.get(`${API_URL}?image=${url}`);
        const response: APIResponse = rawRequest.data;
        if (!response.status) return null;

        const isPorn = (response.data.find((data) => data.className === "Porn")?.probability || 0) > antiNsfw.threshold;
        const isHentai = (response.data.find((data) => data.className === "Hentai")?.probability || 0) > antiNsfw.threshold;

        const output = {
            image: url,
            data: response.data,
            isPorn,
            isHentai
        }
        return output;
    } catch (e) {
        return null;
    }
}

export interface AntiNsfw {
    data: APIResponse,
    isPorn: boolean,
    isHentai: boolean
}

interface APIResponse {
    status: boolean;
    image: string;
    data: [
        {
            className: "Neutral",
            probability: number
        },
        {
            className: "Drawing",
            probability: number
        },
        {
            className: "Sexy",
            probability: number
        },
        {
            className: "Hentai",
            probability: number
        },
        {
            className: "Porn",
            probability: number
        }
    ]
}