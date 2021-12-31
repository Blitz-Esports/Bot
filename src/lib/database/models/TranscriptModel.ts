import { DataTypes, ModelAttributes } from "sequelize";

export const TranscriptModel : ModelAttributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    html: {
        type: DataTypes.TEXT,
        allowNull: false
    }
};