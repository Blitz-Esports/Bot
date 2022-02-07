import type { Canvas } from "canvas";
import createCollage from "@settlin/collage";
import { generateBrawlerCard } from "./generateBrawlerCard";
import type { APlayer } from "../apiHandler/getPlayer";
import { splitChunk } from "../apiHandler/splitChunk";

export const generateBrawlerListCard = async function (player: APlayer) {
    const brawlerCards = await Promise.all(player.brawlers.map(async (brawler) => {
        try {
            return await generateBrawlerCard(brawler.id, brawler.power, brawler.rank, brawler.trophies, brawler.starPowers, brawler.gadgets);
        } catch (e) {
            return null;
        }
    }));

    const imageCards = await Promise.all(splitChunk(brawlerCards.filter((b) => b !== null), 8).map(async (bufferChunk: Buffer[]) => {
        const card: Canvas = await createCollage({
            sources: bufferChunk,
            width: 8,
            height: 1,
            imageWidth: 200,
            imageHeight: 200,
            spacing: 2,
            backgroundColor: "#000000",
        });
        return card.toBuffer();
    }));

    return imageCards;
};