"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWorkers = void 0;
const updateOverviewEmbed_1 = require("./clubOverview/updateOverviewEmbed");
const updateClubs_1 = require("./clubUpdater/updateClubs");
const loadWorkers = async () => {
    (0, updateClubs_1.updateClub)();
    (0, updateOverviewEmbed_1.updateOverviewEmbed)();
};
exports.loadWorkers = loadWorkers;
//# sourceMappingURL=loadWorkers.js.map