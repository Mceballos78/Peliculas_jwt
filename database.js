import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './peliculas_db.sqlite',
    logging: false
});

export default sequelize;