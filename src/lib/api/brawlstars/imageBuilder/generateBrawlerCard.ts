import { createCanvas, loadImage } from "canvas";
import { getBrawlerInfo } from "../brawlstars";

export const generateBrawlerCard = async (brawlerId: number, powerLevel: number, rank: number, trophies: number, brawlerStarPowers: BrawlerCardStarPowers[], brawlerGadgets: BrawlerCardGadgets[]) => {
    const allBrawlerInfo = await getBrawlerInfo();
    if (!allBrawlerInfo) return null;
    const brawlerInfo = allBrawlerInfo.find(b => b.id === brawlerId);
    if (!brawlerInfo) return null;

    const brawlerIconImage = await loadImage(brawlerInfo.imageUrl).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
    const canvas = createCanvas(brawlerIconImage.width, brawlerIconImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(brawlerIconImage, 0, 0);


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 50, 50);
    ctx.save();
    ctx.fillStyle = "#CB5AFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 30px Liliita";
    ctx.fillText(`${powerLevel}`, 50 / 2, 50 / 2);
    ctx.save();

    const iGadgets = brawlerInfo.gadgets;
    const gadgets = brawlerGadgets.map((gadget) => {
        return iGadgets.find((sp) => sp.id === gadget.id);
    });

    if (gadgets[0]) {
        const gadgetIconImageSrc = await loadImage(gadgets[0].imageUrl).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 50, 0, 50, 50);
        ctx.drawImage(gadgetIconImageSrc, (canvas.width - 40), 15, 30, 30);
        ctx.save();
    }
    if (gadgets[1]) {
        const gadgetIconImageSrc = await loadImage(gadgets[1].imageUrl).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 90, 0, 40, 50);
        ctx.drawImage(gadgetIconImageSrc, (canvas.width - 80), 15, 30, 30);
        ctx.save();
    }


    const iStarPowers = brawlerInfo.starPowers;
    const starPowers = brawlerStarPowers.map((starPower) => {
        return iStarPowers.find((sp) => sp.id === starPower.id);
    });

    if (starPowers[0]) {
        const starPowerIconImageSrc = await loadImage(starPowers[0].imageUrl).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 50, canvas.height - 50, 50, 50);
        ctx.drawImage(starPowerIconImageSrc, (canvas.width - 40), canvas.height - 40, 30, 30);
        ctx.save();
    }
    if (starPowers[1]) {
        const starPowerIconImageSrc = await loadImage(iStarPowers[1].imageUrl).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 90, canvas.height - 50, 40, 50);
        ctx.drawImage(starPowerIconImageSrc, (canvas.width - 80), canvas.height - 40, 30, 30);
        ctx.save();
    }


    const rankImageSrc = await loadImage(`https://cdn.brawlify.com/rank/${rank}.png`).catch(() => { return loadImage("https://iili.io/l3RnVI.png") });
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - 50, 50, 50);
    ctx.drawImage(rankImageSrc, 10, canvas.height - 40, 30, 30);
    ctx.save();

    const width = ctx.measureText(trophies.toString()).width;
    ctx.fillStyle = "black";
    ctx.fillRect(50, canvas.height - 50, width - 10, 50);
    ctx.fillStyle = "#BBB";
    ctx.font = "bold 20px Liliita";

    if (trophies > 999) {
        ctx.fillText(`${trophies}`, 50 + 18.5, canvas.height - 25.5);
    }
    else if (trophies > 99) {
        ctx.fillText(`${trophies}`, 50 + 10, canvas.height - 25.5);
    }
    else if (trophies > 9) {
        ctx.fillText(`${trophies}`, 50 + 10, canvas.height - 25.5);
    }
    ctx.save();
    return canvas.toBuffer();
}

interface BrawlerCardGadgets {
    id: number;
    name: string;
}

interface BrawlerCardStarPowers {
    id: number;
    name: string;
}