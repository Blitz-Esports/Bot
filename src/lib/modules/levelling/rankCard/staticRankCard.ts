import { createCanvas, loadImage } from "canvas";
import type{RankCardData} from "../levelling";
import { drawRankCard } from "./drawRankCard";

const defaultConfig = {
    width: 900,
    height: 250,
    defaultBackground: "https://iili.io/1IU0nj.png"
}

export const buildStaticRankCard = async(data: RankCardData) => {
   
    const backGroundImage = await loadImage(data.card_background ?? defaultConfig.defaultBackground, { responseType: "arraybuffer" }).catch(async() => {
        return await loadImage(defaultConfig.defaultBackground);
    });
    const avatarImage = await loadImage(data.avatar);

    const canvas = createCanvas(defaultConfig.width, defaultConfig.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(backGroundImage, 0, 0, defaultConfig.width, defaultConfig.height);

    drawRankCard(ctx, {
        ...data,
        resolvedAvatar: avatarImage
    }, { width: canvas.width, height : canvas.height });

    return canvas.toBuffer("image/png");
}