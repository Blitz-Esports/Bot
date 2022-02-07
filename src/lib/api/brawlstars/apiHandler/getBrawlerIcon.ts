import { loadImage } from "canvas";
import { getBrawlerInfo } from "./getBrawlerInfo";

export const getBrawlerIcon = async (id: number) => {
    const allBrawlers = await getBrawlerInfo();
    if (!allBrawlers) {
        return await loadImage("https://iili.io/l3RnVI.png");
    }
    return await loadImage(allBrawlers.find(b => b.id === id)?.imageUrl ?? "https://iili.io/l3RnVI.png");
}