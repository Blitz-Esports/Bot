import { createCanvas, loadImage } from "canvas";
import moment from "moment";
import type { ABattlelog } from "../../apiHandler/getBattlelog";
import { getGamemodes } from "../../apiHandler/getGamemodes";
import { capitlizeString, getBrawlerIcon } from "../../brawlstars";

export const battleLog_3v3 = async (battleLog: ABattlelog) => {
    const data = battleLog;
    const gameModes = await getGamemodes();
    if (!gameModes) return null;
    const gameMode = gameModes.find((mode) => mode.scHash === data.battle.mode);
    if (!gameMode) return null;

    const canvas = createCanvas(1440, 440);
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

    //* Draw player info
    const playerIcons = await Promise.all(
        [...data.battle.teams[0], ...data.battle.teams[1]]
            .map(async (player) => {
                const image = await getBrawlerIcon(player.brawler.id);
                return {
                    tag: player.tag,
                    image,
                }
            })
    );

    const trophyIcon = await loadImage("https://iili.io/lbfByX.png");
    const levelIcon = await loadImage("https://iili.io/lbRrle.png");
    const crownIcon = await loadImage("https://iili.io/lb5Gmx.png");

    data.battle.teams.forEach((team, iTeam) => {

        team.forEach((player, iPlayer) => {
            const starPlayer = data.battle.starPlayer?.tag === player.tag;

            //* Draw rectangle
            ctx.fillStyle = gameMode.color;
            ctx.fillRect((453.3 * iPlayer) + (20 * (iPlayer + 1)), canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1)), 453.3, 133.3);

            //* Draw brawler icon
            const target = playerIcons.find((p) => p.tag === player.tag) ?? { image: crownIcon };
            ctx.drawImage(target.image, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)), canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))), 120, 120);

            if (starPlayer) ctx.drawImage(crownIcon, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 40, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) - 10, crownIcon.width / 2, crownIcon.height / 2);

            //* Draw player name
            ctx.font = "35px Liliita,Arial-Unicode-Ms,NotoColorEmoji,Nougat-ExtraBlack,Segoe-UI-Symbol";
            ctx.fillStyle = starPlayer ? "gold" : "white";
            ctx.fillText(player.name, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 130, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) + 35);

            //* Draw brawler trophies
            ctx.drawImage(trophyIcon, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 130, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) + 43, 35, 35);
            ctx.font = "25px Liliita";
            ctx.fillStyle = "white";
            ctx.fillText(player.brawler.trophies, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 170, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) + 73);

            //* Draw brawler power
            ctx.drawImage(levelIcon, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 133, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) + 85, 30, 30);
            ctx.font = "25px Liliita";
            ctx.fillStyle = "white";
            ctx.fillText(`${player.brawler.power}`, (453.3 * iPlayer) + (20 * (iPlayer + 1)) + ((10 - (iPlayer * 3)) * (iPlayer + 1)) + 168, canvas.height - (133.3 * (iTeam + 1)) - (20 * (iTeam + 1) - (iTeam === 0 ? 6 : 4 * (iTeam + 1))) + 110);

        });

    });


    //* Draw battle result
    const resultColor = {
        "victory": "#28a745",
        "defeat": "#dc3545",
        "draw": "#17a2b8"
    }

    ctx.font = "60px Liliita";
    ctx.fillStyle = resultColor[data.battle.result as keyof typeof resultColor];
    ctx.textAlign = "right";
    ctx.fillText(capitlizeString(data.battle.result), canvas.width - 70, 80);


    //* Draw trophy change
    ctx.font = "30px Liliita";
    ctx.fillStyle = "#ffc107";
    ctx.textAlign = "left";
    if (data.battle.trophyChange && data.battle.trophyChange !== 0) {
        ctx.fillText(`${data.battle.trophyChange < 0 ? `-${Math.abs(data.battle.trophyChange)}` : `+${Math.abs(data.battle.trophyChange)}`}`, canvas.width - 65, 55);
    }
    else {
        ctx.fillText(`=0`, canvas.width - 65, 55);
    }

    //* Draw battle time
    ctx.font = "25px Liliita";
    ctx.fillStyle = "grey";
    ctx.textAlign = "right";
    ctx.fillText(`${moment(data.battleTime).fromNow()}`, canvas.width - 80, 110);

    return canvas.toBuffer();
}