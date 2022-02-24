import type { CanvasRenderingContext2D, Image } from "canvas";
import { customFont, RankCardData } from "../levelling";
import { levels } from "../levels";

interface Data extends RankCardData {
    resolvedAvatar: Image;
}
export const drawRankCard = (ctx: CanvasRenderingContext2D, rawData: Data, { width, height }: { width: number, height: number }) => {

    const data = {
        ...rawData,
        current_xp: rawData.xp,
        required_xp: levels.find(level => level.level === rawData.level + 1)?.xp ?? 0,
        avatar: rawData.resolvedAvatar
    };

    const calculateProgress = () => {
        const cx = data.current_xp;
        const rx = data.required_xp;
        const progressBarWidth = 596.5;

        if (rx <= 0) return 1;
        if (cx > rx) return progressBarWidth;

        let width = (cx * 615) / rx;
        if (width > progressBarWidth) width = progressBarWidth;
        return width;
    }

    const toAbbrev = (value: number) => {
        return Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(value)
    }

    const shortenName = (text: string, len: number) => {
        if (text.length <= len) return text;
        return `${text.slice(0, len).trim()}...`;
    };


    //* Add overlay [opacity]
    ctx.globalAlpha = data.card_opacity / 100;
    ctx.fillStyle = "black";
    ctx.fillRect(20, 20, width - 40, height - 40);
    // Reset transparency
    ctx.globalAlpha = 1;

    //* Draw username
    ctx.font = `40px ${customFont}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    const usernameTextWidth = ctx.measureText(shortenName(data.username, 13)).width;
    ctx.fillText(`${shortenName(data.username, 13)}`, 257 + 18.5 - 34 + 5, 147.5 + 18.5 + 36.25 - 25 - 30);

    //* Draw level
    ctx.font = `70px ${customFont}`;
    ctx.fillStyle = data.card_color;
    ctx.textAlign = "end";
    const levelTextWidth = ctx.measureText(`${data.level}`).width;
    ctx.fillText(`${data.level}`, width - 20 - 18.5 - 34 + 10, 90);
    ctx.font = `30px ${customFont}`;
    ctx.fillStyle = data.card_color;
    const levelTextTitleWidth = ctx.measureText(`LEVEL`).width;
    ctx.fillText(`LEVEL`, width - 20 - 18.5 - 34 + 10 - levelTextWidth - 5, 90);

    //* Draw rank
    ctx.font = `70px ${customFont}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "end";
    const rankTextWidth = ctx.measureText(`#${data.rank}`).width;
    ctx.fillText(`#${data.rank}`, width - 20 - 18.5 - 34 + 10 - levelTextTitleWidth - levelTextWidth - 20, 90);
    ctx.font = `30px ${customFont}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "end";
    ctx.fillText(`RANK`, width - 20 - 18.5 - 34 + 10 - levelTextTitleWidth - levelTextWidth - rankTextWidth - 30, 90);

    //* Draw discriminator
    ctx.font = `25px ${customFont}`;
    ctx.fillStyle = "grey";
    ctx.textAlign = "start";
    ctx.fillText(`#${data.discriminator}`, usernameTextWidth + 257 + 18.5 - 34 + 5 + 10, 147.5 + 18.5 + 36.25 - 25 - 30);

    //* Show progress
    ctx.font = `30px ${customFont}`;
    ctx.fillStyle = "grey";
    ctx.textAlign = "end";
    ctx.fillText(`/ ${toAbbrev(data.required_xp)} XP`, 670 + ctx.measureText(toAbbrev(data.current_xp)).width + 110, 147.5 + 18.5 + 36.25 - 25 - 30);

    ctx.fillStyle = data.card_color;
    ctx.fillText(toAbbrev(data.current_xp), 670 + ctx.measureText(toAbbrev(data.current_xp)).width + 110 - ctx.measureText(`/ ${toAbbrev(data.required_xp)} XP`).width - 10, 147.5 + 18.5 + 36.25 - 25 - 30);


    //* Draw progress bar
    ctx.fillStyle = "grey";
    ctx.arc(257 + 18.5 - 34, 147.5 + 18.5 + 36.25 - 25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5 - 34, 147.5 + 36.25 - 25, 615 - 18.5, 37.5);
    ctx.arc(257 + 615 - 34, 147.5 + 18.5 + 36.25 - 25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = data.card_color;
    ctx.arc(257 + 18.5 - 34, 147.5 + 18.5 + 36.25 - 25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5 - 34, 147.5 + 36.25 - 25, calculateProgress(), 37.5);
    ctx.arc(257 + 18.5 - 34 + calculateProgress(), 147.5 + 18.5 + 36.25 - 25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();


    //* Draw avatar
    ctx.beginPath();
    ctx.arc(130, height / 2, 90, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(data.avatar, 40, 35, 180, 180);
    ctx.restore();

}