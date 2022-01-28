import { DataTypes, ModelAttributes } from "sequelize";

export const OnlyFanModel: ModelAttributes = {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
};