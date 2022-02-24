import { Sequelize } from "sequelize";
import config from "../../config";
// Models
import { TranscriptModel } from "./models/TranscriptModel";
import { BinModel } from "./models/BinModel";
import { container } from "@sapphire/framework";
import { ClubModel } from "./models/ClubModel";
import { PlayerModel } from "./models/PlayerModel";
import { WarnModel } from "./models/WarnModel";
import { TokenModel } from "./models/TokenModel";
import { OnlyFanModel } from "./models/OnlyFanModel";
import { LevelModel } from "./models/LevelModel";

export const initializeDatabase = async () => {
    const database = new Sequelize(config.database.database, config.database.user, config.database.password, {
        host: config.database.host,
        port: config.database.port,
        dialect: "mysql",
        dialectOptions: {
            charset: "utf8mb4"
        },
        logging: config.database.debug ? (msg: string) => container.logger.debug(msg) : false
    });
    await database.authenticate();

    //* Load Models
    database.define("transcript", TranscriptModel);
    database.define("bin", BinModel);
    database.define("club", ClubModel);
    database.define("player", PlayerModel);
    database.define("warn", WarnModel);
    database.define("token", TokenModel);
    database.define("onlyfan", OnlyFanModel);
    database.define("level", LevelModel);

    //* Sync Models
    await database.sync();

    return database;
}