import { DataTypes, ModelAttributes } from "sequelize";

export const TokenModel: ModelAttributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    metaData: {
        type: "LONGTEXT",
        get: function () {
            return JSON.parse(this.getDataValue("metaData"));
        },
        set: function (value) {
            return this.setDataValue("metaData", JSON.stringify(value));
        },
        defaultValue: "{}"
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    }
};