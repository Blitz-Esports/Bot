"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubModel = void 0;
const sequelize_1 = require("sequelize");
exports.ClubModel = {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: sequelize_1.DataTypes.STRING,
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
//# sourceMappingURL=ClubModel.js.map