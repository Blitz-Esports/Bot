"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = require("sequelize");
const config_1 = (0, tslib_1.__importDefault)(require("../../config"));
// Models
const TranscriptModel_1 = require("./models/TranscriptModel");
const BinModel_1 = require("./models/BinModel");
const framework_1 = require("@sapphire/framework");
const ClubModel_1 = require("./models/ClubModel");
const PlayerModel_1 = require("./models/PlayerModel");
const initializeDatabase = async () => {
    const database = new sequelize_1.Sequelize(config_1.default.database.database, config_1.default.database.user, config_1.default.database.password, {
        host: config_1.default.database.host,
        port: config_1.default.database.port,
        dialect: "mysql",
        dialectOptions: {
            charset: "utf8mb4"
        },
        logging: config_1.default.database.debug ? (msg) => framework_1.container.logger.debug(msg) : false
    });
    await database.authenticate();
    //* Load Models
    database.define("transcript", TranscriptModel_1.TranscriptModel);
    database.define("bin", BinModel_1.BinModel);
    database.define("club", ClubModel_1.ClubModel);
    database.define("player", PlayerModel_1.PlayerModel);
    //* Sync Models
    await database.sync();
    return database;
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=main.js.map