import { createCanvas, loadImage } from "canvas";
import { getBrawlerIcon } from "../apiHandler/getBrawlerIcon";
import { getBrawlerInfo } from "../apiHandler/getBrawlerInfo";
import type{AMapInfo} from "../apiHandler/getMap";
import { splitChunk } from "../apiHandler/splitChunk";

export const generateMapCard = async function (map: AMapInfo) {
    const brawlerInfo = await getBrawlerInfo();
    if (!brawlerInfo) return null;

    const canvas = createCanvas(1440, 800);
    const ctx = canvas.getContext("2d");

    //* Background Color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //* Draw Map Image
    const mapImage = await loadImage(map.imageUrl);
    let imageDimensions = [40, 15, 505, 770];
    if (map.gameMode.hash === "Showdown" || map.gameMode.hash === "Duo-Showdown") imageDimensions = [30, 92, 617, 617];
    ctx.drawImage(mapImage, ...imageDimensions);

    //* Write Map Name
    ctx.fillStyle = map.gameMode.color;
    ctx.font = "100px Liliita";
    ctx.textAlign = "center";
    ctx.fillText(map.name, 985, 120);

    //* Draw most wins
    ctx.fillStyle = "white";
    ctx.font = "40px Liliita";
    ctx.textAlign = "center";
    ctx.fillText("Most Wins", 985, 200);
    if (map.stats.length > 0) {
        const mostWins = await Promise.all(map.stats.sort((a, b) => b.winRate - a.starRate).slice(0, 10).map(async (stat) => {
            return {
                ...stat,
                icon: (await getBrawlerIcon(stat.brawler))
            }
        }));
        mostWins.forEach((data, indx) => {
            ctx.drawImage(data.icon, 700 + (indx * 60), 220, 50, 50);
            ctx.fillStyle = "white";
            ctx.font = "15px Liliita";
            ctx.textAlign = "center";
            ctx.fillText(`${Math.round(data.winRate)}%`, 725 + (indx * 60), 280);
        });
    }
    else {
        ctx.fillStyle = "grey";
        ctx.font = "20px Liliita";
        ctx.textAlign = "center";
        ctx.fillText("STATS DATA NOT AVAILABLE", 985, 250);
    }

    //* Draw most picked
    ctx.fillStyle = "white";
    ctx.font = "40px Liliita";
    ctx.textAlign = "center";
    ctx.fillText("Most Picked", 985, 350);
    if (map.stats.length > 0) {
        const mostPicked = await Promise.all(map.stats.sort((a, b) => b.useRate - a.useRate).slice(0, 10).map(async (stat) => {
            return {
                ...stat,
                icon: (await getBrawlerIcon(stat.brawler))
            }
        }));
        mostPicked.forEach((data, indx) => {
            ctx.drawImage(data.icon, 700 + (indx * 60), 370, 50, 50);
            ctx.fillStyle = "white";
            ctx.font = "15px Liliita";
            ctx.textAlign = "center";
            ctx.fillText(`${Math.round(data.winRate)}%`, 725 + (indx * 60), 430);
        });
    } else {
        ctx.fillStyle = "grey";
        ctx.font = "20px Liliita";
        ctx.textAlign = "center";
        ctx.fillText("STATS DATA NOT AVAILABLE", 985, 400);
    }

    //* Draw best teams
    ctx.fillStyle = "white";
    ctx.font = "40px Liliita";
    ctx.textAlign = "center";
    ctx.fillText("Best Teams", 985, 500);

    if (map.teamStats.length > 0) {

        const teamStats = await Promise.all(map.teamStats.sort((a, b) => {
            if (b.data.winRate === a.data.winRate) return 0;
            return b.data.winRate < a.data.winRate ? -1 : 1;
        }).slice(0, 8).map(async (team) => {
            return {
                ...team,
                brawler1Icon: (await getBrawlerIcon(team.brawler1)),
                brawler2Icon: (await getBrawlerIcon(team.brawler2)),
                brawler3Icon: team.brawler3 ? (await getBrawlerIcon(team.brawler3)) : null
            }
        }));

        ctx.fillStyle = "white";
        ctx.font = "17px Liliita";
        ctx.textAlign = "center";

        //* First row
        splitChunk(teamStats.slice(0, 4), 2).forEach((teamChunk, indx) => {
            let i = 0;
            ctx.fillText(`${Math.round(teamChunk[indx].data.winRate)}%`, 825 + 60, 585 + (indx * 90));
            teamChunk.forEach(async (team: any) => {
                ctx.drawImage(team.brawler1Icon, 800 + (i * 60), 520 + (indx * 90), 50, 50);
                i++
                ctx.drawImage(team.brawler2Icon, 800 + (i * 60), 520 + (indx * 90), 50, 50);
                i++
                if (team.brawler3Icon) {
                    ctx.drawImage(team.brawler3Icon, 800 + (i * 60), 520 + (indx * 90), 50, 50);
                }
                i = 0;
            });
        });

        //* Second row
        splitChunk(teamStats.slice(4, 8), 2).forEach((teamChunk, indx) => {
            let i = 0;
            ctx.fillText(`${Math.round(teamChunk[indx].data.winRate)}%`, 1025 + 60, 585 + (indx * 90));
            teamChunk.forEach(async (team: any) => {
                ctx.drawImage(team.brawler1Icon, 1000 + (i * 60), 520 + (indx * 90), 50, 50);
                i++
                ctx.drawImage(team.brawler2Icon, 1000 + (i * 60), 520 + (indx * 90), 50, 50);
                i++
                if (team.brawler3Icon) ctx.drawImage(team.brawler3Icon, 1000 + (i * 60), 520 + (indx * 90), 50, 50);
                i = 0;
            });
        });

    }
    else {
        ctx.fillStyle = "grey";
        ctx.font = "20px Liliita";
        ctx.textAlign = "center";
        ctx.fillText("TEAM DATA NOT AVAILABLE", 985, 550);
    }

    return canvas.toBuffer();
}