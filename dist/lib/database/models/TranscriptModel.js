"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptModel = void 0;
const sequelize_1 = require("sequelize");
exports.TranscriptModel = {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true
    },
    html: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
};
//# sourceMappingURL=TranscriptModel.js.map