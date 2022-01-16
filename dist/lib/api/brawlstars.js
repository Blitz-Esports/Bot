"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBrawlerListCard = exports.generateBrawlerCard = exports.getBrawlerInfo = exports.getPlayer = exports.getClub = exports.encodeTag = exports.brawlstarsEmojis = void 0;
const tslib_1 = require("tslib");
const fetch_1 = require("@sapphire/fetch");
const canvas_1 = require("canvas");
const collage_1 = (0, tslib_1.__importDefault)(require("@settlin/collage"));
(0, canvas_1.registerFont)("./assets/fonts/Lilita-One.ttf", { family: "Liliita" });
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
const { brawlstars } = config_1.default.api;
exports.brawlstarsEmojis = {
    unknown: "<:Not_Found:792392216663556116>",
    role: {
        member: "<:Member:792430014326898740>",
        senior: "<:Seniors:789425351768014888>",
        vicePresident: "<:VicePresidents:789425469375119360>",
        president: "<:President:789425708929253396>"
    },
    entrance: {
        open: "<:Open:792418812397748264>",
        closed: "<:Closed:809420167230128188>",
        inviteOnly: "<:Invite_Only:792419406038433872>"
    },
    icons: {
        trophy_player: "<:Trophies:789421880036687883>",
        trophy_highest: "<:Highest_Trophies:792372446221041684>",
        trophy_club: "<:Club_Trophies:789425841661804544>",
        trophy_normal: "<:Trophy_B:794043009699545089>",
        trophy_required: "<:Trophy_R:820529622638395463>",
        trophy_highest_crown: "<:Trophy_H:794043128432427009>",
        required_trophies: "<:Required_Trophies:789425152789053451>",
        exp: "<:Exp:789422109515448351>",
        power_play_points: "<:PP:791623097266077726>",
        highest_power_play_points: "<:Power_Play:789421996525092864>",
        champion_ship: "<:Championship:789422626098380822>",
        brawlers: "<:Brawlers:789422051914940426>",
        star_powers: "<:Star_Powers:789422174972149761>",
        gadgets: "<:Gadgets:789422235651014683>",
        star_points: "",
        "3v3": "<:3v3:789422302873124885>",
        duo: "<:Duo:789422359273537546>",
        solo: "<:Solo:789422408658321409>",
        robo_rumble: "<:Robo_Rumble:789422466728591371>",
        club: "<:Club:789421935967862785>",
        members: "<:Members:789425597742972948>",
        list: "<:Description:792420384732872784>",
        crown: "<:Crown:829363141300846602>"
    }
};
const encodeTag = (tag) => {
    return encodeURIComponent(`#${tag.toUpperCase().replace("#", "")}`);
};
exports.encodeTag = encodeTag;
const getClub = async (tag) => {
    try {
        const response = await (0, fetch_1.fetch)(`${brawlstars.url}/clubs/${(0, exports.encodeTag)(tag)}`, {
            headers: {
                "Authorization": `Bearer ${brawlstars.token}`
            }
        }, "json" /* JSON */);
        return response;
    }
    catch (e) {
        return null;
    }
};
exports.getClub = getClub;
const getPlayer = async (tag) => {
    try {
        const response = await (0, fetch_1.fetch)(`${brawlstars.url}/players/${(0, exports.encodeTag)(tag)}`, {
            headers: {
                "Authorization": `Bearer ${brawlstars.token}`
            }
        }, "json" /* JSON */);
        return response;
    }
    catch (e) {
        return null;
    }
};
exports.getPlayer = getPlayer;
let brawlerInfoCache = null;
const getBrawlerInfo = async () => {
    if (brawlerInfoCache)
        return brawlerInfoCache;
    try {
        const res = await (0, fetch_1.fetch)("https://api.brawlapi.com/v1/brawlers", "json" /* JSON */);
        brawlerInfoCache = res.list;
        return res.list;
    }
    catch (e) {
        return null;
    }
};
exports.getBrawlerInfo = getBrawlerInfo;
const generateBrawlerCard = async (brawlerId, powerLevel, rank, trophies, brawlerStarPowers, brawlerGadgets) => {
    const allBrawlerInfo = await (0, exports.getBrawlerInfo)();
    if (!allBrawlerInfo)
        return null;
    const brawlerInfo = allBrawlerInfo.find(b => b.id === brawlerId);
    if (!brawlerInfo)
        return null;
    const brawlerIconImage = await (0, canvas_1.loadImage)(brawlerInfo.imageUrl);
    const canvas = (0, canvas_1.createCanvas)(brawlerIconImage.width, brawlerIconImage.height);
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
        const gadgetIconImageSrc = await (0, canvas_1.loadImage)(gadgets[0].imageUrl);
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 50, 0, 50, 50);
        ctx.drawImage(gadgetIconImageSrc, (canvas.width - 40), 15, 30, 30);
        ctx.save();
    }
    if (gadgets[1]) {
        const gadgetIconImageSrc = await (0, canvas_1.loadImage)(gadgets[1].imageUrl);
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
        const starPowerIconImageSrc = await (0, canvas_1.loadImage)(starPowers[0].imageUrl);
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 50, canvas.height - 50, 50, 50);
        ctx.drawImage(starPowerIconImageSrc, (canvas.width - 40), canvas.height - 40, 30, 30);
        ctx.save();
    }
    if (starPowers[1]) {
        const starPowerIconImageSrc = await (0, canvas_1.loadImage)(iStarPowers[1].imageUrl);
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 90, canvas.height - 50, 40, 50);
        ctx.drawImage(starPowerIconImageSrc, (canvas.width - 80), canvas.height - 40, 30, 30);
        ctx.save();
    }
    const rankImageSrc = await (0, canvas_1.loadImage)(`https://cdn.brawlify.com/rank/${rank}.png`);
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
};
exports.generateBrawlerCard = generateBrawlerCard;
const generateBrawlerListCard = async function (player) {
    const brawlerCards = await Promise.all(player.brawlers.map(async (brawler) => {
        try {
            return await (0, exports.generateBrawlerCard)(brawler.id, brawler.power, brawler.rank, brawler.trophies, brawler.starPowers, brawler.gadgets);
        }
        catch (e) {
            return null;
        }
    }));
    const imageCards = await Promise.all(splitChunk(brawlerCards.filter((b) => b !== null), 8).map(async (bufferChunk) => {
        const card = await (0, collage_1.default)({
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
exports.generateBrawlerListCard = generateBrawlerListCard;
const splitChunk = (array, chunk) => {
    const inputArray = array;
    var perChunk = chunk || 15;
    var result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
    return result;
};
//# sourceMappingURL=brawlstars.js.map