import { DataTypes, ModelAttributes } from "sequelize";

export const BinModel: ModelAttributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: true
    }
};