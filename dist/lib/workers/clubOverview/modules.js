"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.splitChunk = void 0;
const brawlstars_1 = require("../../api/brawlstars");
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
exports.splitChunk = splitChunk;
const list = (club, role) => {
    let r = [role];
    if (role === "vicePresident")
        r = ["president", role];
    const list = club.members.filter((x) => r.includes(x.role)).sort((a, b) => b.trophies - a.trophies).map((m) => `${brawlstars_1.brawlstarsEmojis.role[m.role] || brawlstars_1.brawlstarsEmojis.unknown}\`${m.trophies}\` [${m.name}](https://brawlify.com/stats/profile/${m.tag.replace("#", "")})`).slice(0, 5);
    return list.length === 0 ? ["- None -"] : list;
};
exports.list = list;
//# sourceMappingURL=modules.js.map