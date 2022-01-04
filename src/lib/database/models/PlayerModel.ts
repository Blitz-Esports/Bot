import { DataTypes, ModelAttributes } from "sequelize";

export const PlayerModel: ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
};