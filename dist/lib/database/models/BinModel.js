"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinModel = void 0;
const sequelize_1 = require("sequelize");
exports.BinModel = {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true
    },
    data: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
};
//# sourceMappingURL=BinModel.js.map