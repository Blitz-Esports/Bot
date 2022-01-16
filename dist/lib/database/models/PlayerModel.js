"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = void 0;
const sequelize_1 = require("sequelize");
exports.PlayerModel = {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    tag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
};
//# sourceMappingURL=PlayerModel.js.map