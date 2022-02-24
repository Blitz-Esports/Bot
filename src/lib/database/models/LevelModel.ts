import { DataTypes, ModelAttributes } from "sequelize";

export const LevelModel: ModelAttributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    discriminator: {
        type: DataTypes.STRING
    },
    avatar: {
        type: DataTypes.STRING
    },
    message_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    card_background: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },
    card_color: {
        type: DataTypes.STRING,
        defaultValue: "white"
    },
    card_opacity: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    badges: {
        type: DataTypes.TEXT("long"),
        defaultValue: "[]",
        get: function () {
            return JSON.parse(this.getDataValue("badges"));
        },
        set: function (value) {
            return this.setDataValue("badges", JSON.stringify(value));
        }
    },
    log: {
        type: DataTypes.TEXT("long"),
        defaultValue: "{}",
        get: function () {
            return JSON.parse(this.getDataValue("log"));
        },
        set: function (value) {
            return this.setDataValue("log", JSON.stringify(value));
        }
    }
};