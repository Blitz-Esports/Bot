import { DataTypes, ModelAttributes } from "sequelize";

export const WarnModel: ModelAttributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    target: {
        type: DataTypes.STRING,
        allowNull: false
    },
    executor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    }
};