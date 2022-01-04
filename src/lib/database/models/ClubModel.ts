import { DataTypes, ModelAttributes } from "sequelize";

export const ClubModel: ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    rawData: {
        type: "LONGTEXT",
        get: function () {
            return JSON.parse(this.getDataValue("rawData"));
        },
        set: function (value) {
            return this.setDataValue("rawData", JSON.stringify(value));
        },
        defaultValue: "{}"
    },
    clubLogs: {
        type: "LONGTEXT",
        get: function () {
            return JSON.parse(this.getDataValue("clubLogs"));
        },
        set: function (value) {
            return this.setDataValue("clubLogs", JSON.stringify(value));
        },
        defaultValue: "[]"
    }
};