"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClub = void 0;
const framework_1 = require("@sapphire/framework");
const brawlstars_1 = require("../../api/brawlstars");
const clubLogHandler_1 = require("./handlers/clubLogHandler");
const updateClub = async () => {
    let allClubs = (await framework_1.container.database.models.club.findAll({})).map((club) => club.toJSON());
    if (allClubs.length === 0)
        return;
    let count = 0;
    setInterval(async () => {
        if (!allClubs[count])
            return;
        const clubData = await (0, brawlstars_1.getClub)(allClubs[count].id);
        if (clubData) {
            const clubLogs = await (0, clubLogHandler_1.clubLogHandler)(allClubs[count], clubData);
            const dataToUpdate = await framework_1.container.database.models.club.findOne({ where: { id: clubData.tag } });
            if (dataToUpdate) {
                await dataToUpdate.update({ rawData: clubData, clubLogs });
            }
        }
        count++;
        if (count === allClubs.length) {
            count = 0;
            allClubs = (await framework_1.container.database.models.club.findAll({})).map((club) => club.toJSON());
        }
    }, 1000 * 10);
};
exports.updateClub = updateClub;
//# sourceMappingURL=updateClubs.js.map