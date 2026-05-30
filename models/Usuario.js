import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Usuario = sequelize.define('Usuario', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: false
});

export default Usuario;