import { container } from "@sapphire/framework";
import { registerFont } from "canvas";
import { levels } from "./levels";
import { buildAnimatedRankCard } from "./rankCard/animatedRankCard";
import { buildStaticRankCard } from "./rankCard/staticRankCard";

const { config } = container;
const { levelling } = config.features;

registerFont("./assets/fonts/Arial-2.ttf", { family: "Arial-2" });
registerFont("./assets/fonts/Arial-Unicode-Ms.ttf", { family: "Arial-Unicode-Ms" });
registerFont("./assets/fonts/NotoColorEmoji.ttf", { family: "NotoColorEmoji" });
registerFont("./assets/fonts/Segoe-UI-Symbol.ttf", { family: "Segoe-UI-Symbol" });

export const customFont = "Arial-Unicode-Ms;Segoe-UI-Symbol;NotoColorEmoji;Arial-2";

export interface Levelling {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    message_count: number;
    level: number;
    xp: number;
    card_background: string;
    card_color: string;
    card_opacity: number;
    badges: {
        name: string;
        image: string;
    }[];
    log: {
        type: string;
        message: string;
        timestamp: number;
    }[];
}

export interface RankCardData {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    message_count: number;
    level: number;
    xp: number;
    card_background: string;
    card_color: string;
    card_opacity: number;
    badges: {
        name: string;
        image: string;
    }[];
    log: {
        type: string;
        message: string;
        timestamp: number;
    }[];
    rank: number;
}

export const randomXp = () => {
    return Math.floor(Math.random() * (levelling.xpRange.max - levelling.xpRange.min + 1) + levelling.xpRange.min)
}

export const calculateLevel = (xp: number) => {
    let level = 0;
    for (const [_, value] of Object.entries(levels)) {
        if (xp >= value.xp) level = Number(value.level);
    }
    return level;
}

export const fetchLevels = async () => {
    const rawLevels = await container.database.models.level.findAll({});
    const allLevels: RankCardData[] = rawLevels.map((level) => level.toJSON()).sort((a, b) => b.xp - a.xp).map((level, i) => {
        return {
            ...level,
            rank: i + 1
        }
    });
    return allLevels;
}

export const getUserLevel = async (userId: string): Promise<null | Levelling> => {
    const userData = await container.database.models.level.findOne({ where: { id: userId } });
    if (!userData) return null;
    return userData.toJSON();
}

export const generateRankCard = async (userId: string) => {
    try {
        const allLevels = await fetchLevels();

        const userData = allLevels.find((level) => level.id === userId);
        if (!userData) return null;

        if (!userData.card_background || !userData.card_background.endsWith(".gif")) {
            const rankCard = await buildStaticRankCard(userData);
            return { data: rankCard, mimeType: "image/png", extension: "png" };
        }
        else {
            const rankCard = await buildAnimatedRankCard(userData);
            return { data: rankCard, mimeType: "image/gif", extension: "gif" };;
        }
    } catch (e) {
        return null;
    }
}