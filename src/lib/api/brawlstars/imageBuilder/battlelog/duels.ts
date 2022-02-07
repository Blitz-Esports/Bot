import { createCanvas, loadImage } from "canvas";
import moment from "moment";
import type { ABattlelog } from "../../apiHandler/getBattlelog";
import { getGamemodes } from "../../apiHandler/getGamemodes";
import { capitlizeString, getBrawlerIcon } from "../../brawlstars";

export const battleLog_duels = async (battleLog: ABattlelog) => {
    const data = battleLog;
    const gameModes = await getGamemodes();
    if (!gameModes) return null;
    const gameMode = gameModes.find((mode) => mode.scHash === data.battle.mode);
    if (!gameMode) return null;

    const canvas = createCanvas(970, 790);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    //* Draw game mode and map info
    const gameModeIcon = await loadImage(gameMode.imageUrl);
    ctx.drawImage(gameModeIcon, 15, 20, 100, 100);
    ctx.font = "70px Liliita,Arial-Unicode-Ms,NotoColorEmoji,Nougat-ExtraBlack,Segoe-UI-Symbol";
    ctx.fillStyle = gameMode.color;
    ctx.fillText(gameMode.name, 140, 80);

    ctx.font = "25px Liliita,Arial-Unicode-Ms,NotoColorEmoji,Nougat-ExtraBlack,Segoe-UI-Symbol";
    ctx.fillStyle = "white";
    ctx.fillText(data.event.map ?? "Unknown", 145, 110);

    const trophyIcon = await loadImage("https://iili.io/lbfByX.png");

    const brawlers = await Promise.all(
        [...data.battle.players[0].brawlers, ...data.battle.players[1].brawlers]
            .map(async (brawler) => {
                const image = await getBrawlerIcon(brawler.id);
                return {
                    id: brawler.id,
                    image
                }
            })
    )

    //* Draw battle result
    const resultColor = {
        "victory": "#28a745",
        "defeat": "#dc3545",
        "draw": "#17a2b8"
    }
    let result = data.battle.result;

    ctx.font = "60px Liliita";
    ctx.fillStyle = resultColor[result as keyof typeof resultColor];
    ctx.textAlign = "right";
    ctx.fillText(capitlizeString(result), canvas.width - 60, 80);

    //* Draw battle time
    ctx.font = "25px Liliita";
    ctx.fillStyle = "grey";
    ctx.textAlign = "right";
    ctx.fillText(`${moment(data.battleTime).fromNow()}`, canvas.width - 80, 110);

    //* Draw Stats
    data.battle.players.forEach((player, iPlayer) => {

        //* Draw rectangle
        ctx.fillStyle = gameMode.color;
        ctx.fillRect(15, (150 * (iPlayer + 1)) + (iPlayer * 170), 940, 300);

        //* Draw player name
        ctx.font = "60px Liliita,Arial-Unicode-Ms,NotoColorEmoji,Nougat-ExtraBlack,Segoe-UI-Symbol";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(player.name, canvas.width / 2, (150 * (iPlayer + 1)) + (iPlayer * 170) + 60);

        player.brawlers.forEach((brawler: any, iBrawler: number) => {

            //* Draw brawler icons
            const brawlerIcon = brawlers.find((b) => b.id === brawler.id)?.image;
            ctx.drawImage(brawlerIcon, (iBrawler * 100) + (iBrawler * 80) + 235, (150 * (iPlayer + 1)) + (iPlayer * 170) + 100, 150, 150);

            //* Draw brawler trophies
            ctx.fillStyle = "black";
            ctx.fillRect((iBrawler * 100) + (iBrawler * 80) + 235, (150 * (iPlayer + 1)) + (iPlayer * 170) + 100, 150, 30);
            ctx.drawImage(trophyIcon, (iBrawler * 100) + (iBrawler * 80) + 235 + 30, (150 * (iPlayer + 1)) + (iPlayer * 170) + 98, 30, 30);
            ctx.font = "25px Liliita";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(brawler.trophies, (iBrawler * 100) + (iBrawler * 80) + 235 + 65, (150 * (iPlayer + 1)) + (iPlayer * 170) + 125);

            //* Draw power level
            ctx.fillStyle = "black";
            ctx.fillRect((iBrawler * 100) + (iBrawler * 80) + 245, (150 * (iPlayer + 1)) + (iPlayer * 170) + 210, 30, 30);
            ctx.font = "25px Liliita";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(brawler.power, (iBrawler * 100) + (iBrawler * 80) + 235 + 20, (150 * (iPlayer + 1)) + (iPlayer * 170) + 235);

            //* Draw trophy change
            ctx.fillStyle = "black";
            ctx.fillRect((iBrawler * 100) + (iBrawler * 80) + 350, (150 * (iPlayer + 1)) + (iPlayer * 170) + 210, 30, 30);
            ctx.font = "25px Liliita";
            ctx.textAlign = "center";

            let trophyChangeColor = brawler.trophyChange < 0 ? resultColor["defeat"] : resultColor["victory"];
            let trophyChange = brawler.trophyChange < 0 ? `-${Math.abs(brawler.trophyChange)}` : `+${Math.abs(brawler.trophyChange)}`;
            if (brawler.trophyChange === 0) {
                trophyChangeColor = "gold"
                trophyChange = "=0";
            }
            ctx.fillStyle = trophyChangeColor;
            ctx.fillText(trophyChange, (iBrawler * 100) + (iBrawler * 80) + 235 + 130, (150 * (iPlayer + 1)) + (iPlayer * 170) + 235);

        });

    });

    return canvas.toBuffer();
}