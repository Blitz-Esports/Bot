import { Sequelize } from "sequelize";
import config from "../../config";
// Models
import { TranscriptModel } from "./models/TranscriptModel";
import { BinModel } from "./models/BinModel";
import { container } from "@sapphire/framework";

export const initializeDatabase = async () => {
    const database = new Sequelize(config.database.database, config.database.user, config.database.password, {
        host: config.database.host,
        port: config.database.port,
        dialect: "mysql",
        logging: (msg: string) => container.logger.debug(msg)
    });
    await database.authenticate();

    //* Load Models
    database.define("transcript", TranscriptModel);
    database.define("bin", BinModel);

    //* Sync Models
    await database.sync();

    return database;
}