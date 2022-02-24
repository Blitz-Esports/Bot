import { createCanvas, createImageData, loadImage } from "canvas";
import { GifUtil } from "gifwrap";
import GIFEncoder from "gif-encoder-2";
import { drawRankCard } from "./drawRankCard";
import type { RankCardData } from "../levelling";
import axios from "axios";

const defaultConfig = {
    width: 900,
    height: 250,
    fps: 120,
    delay: 0,
    repeat: 0,
    quality: 20,
    algorithm: "neuquant",
    optimizer: true,
    defaultBackground: "https://iili.io/1IrKIn.gif"
}

export const buildAnimatedRankCard = async (data: RankCardData): Promise<Buffer> => {

    const backGroundImage = await axios.get(data.card_background ?? defaultConfig.defaultBackground, { responseType: "arraybuffer" }).catch(async () => {
        return await axios.get(defaultConfig.defaultBackground);
    });
    const avatarImage = await loadImage(data.avatar);

    const { width, height, frames } = await GifUtil.read(backGroundImage.data);
    const encoder = new GIFEncoder(defaultConfig.width, defaultConfig.height, defaultConfig.algorithm, defaultConfig.optimizer, frames.length);

    encoder.on('readable', () => encoder.read());
    encoder.setDelay(defaultConfig.delay);
    encoder.setRepeat(defaultConfig.repeat);
    encoder.setFrameRate(defaultConfig.fps);
    encoder.setQuality(defaultConfig.quality);
    encoder.start();

    for (const i in frames) {
        const frame = frames[i];

        // Create the frame's canvas
        const canvas = createCanvas(defaultConfig.width, defaultConfig.height);
        const ctx = canvas.getContext('2d');

        // Create image data from the frame's data and put it on the canvas
        const frameData = createImageData(new Uint8ClampedArray(frame.bitmap.data), width, height);
        ctx.putImageData(frameData, 0, 0);

        // Draw the rank card
        drawRankCard(ctx, {
            ...data,
            resolvedAvatar: avatarImage
        }, { width, height });
        encoder.addFrame(ctx);
    }

    encoder.finish();
    const buffer = encoder.out.getData();
    return buffer;
}