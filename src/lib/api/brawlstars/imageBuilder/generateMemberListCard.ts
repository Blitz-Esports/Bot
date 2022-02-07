import { createCanvas, loadImage } from "canvas";
import { splitChunk } from "../apiHandler/splitChunk";
import type{AClub , AClubMember} from "../apiHandler/getClub";
import { capitlizeString } from "../apiHandler/capitalizeString";

export const generateClubMemberListCard = async function (club: AClub) {
    const { members } = club;
    let cards: Buffer[] = [];
    let rank = 0;
    const icons = await Promise.all(club.members.map((member) => loadImage(`https://cdn.brawlify.com/profile-low/${member.icon.id}.png`).catch(() => { return loadImage("https://iili.io/l3RnVI.png") })));

    splitChunk(members, 10).forEach(async (memberChunk: AClubMember[]) => {
        const canvas = createCanvas(1440, 800);
        const ctx = canvas.getContext("2d");

        //* Background Color
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        memberChunk.forEach((mem, indx) => {
            rank++;
            const i = ++indx;

            //* Draw Lines
            ctx.beginPath();
            ctx.moveTo(0, 20 + i * 78);
            ctx.lineTo(canvas.width, 20 + i * 78);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 0.5;
            ctx.stroke();

            //* Write Rank
            ctx.fillStyle = "grey";
            ctx.font = "40px Liliita";
            let textPos = (i < 10) ? 80 : 70;
            if (rank.toString().endsWith("0")) textPos = 78;
            ctx.fillText(rank.toString(), textPos, i * 78);

            //* Draw Icon Image
            ctx.drawImage(icons[rank - 1], 180, (i * 78) - 45, 55, 55);

            //* Write name
            ctx.fillStyle = mem.nameColor.replace("0xff", "#");
            ctx.font = `40px Liliita,Arial-Unicode-Ms,NotoColorEmoji,Nougat-ExtraBlack,Segoe-UI-Symbol`;
            ctx.fillText(mem.name, 300, i * 78);

            //* Write role
            ctx.fillStyle = "grey";
            ctx.font = "40px Liliita";
            ctx.fillText(capitlizeString(mem.role.replace(/([A-Z])/g, " $1")), 850, i * 78);

            //* Write trophies
            ctx.fillStyle = "grey";
            ctx.font = "40px Liliita,Arial-Unicode-Ms";
            ctx.fillText(mem.trophies.toLocaleString(), canvas.width - 200, i * 78);

        });

        cards.push(canvas.toBuffer());

    });

    return cards;
}