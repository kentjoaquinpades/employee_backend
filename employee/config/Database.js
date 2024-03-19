import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const db = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});

export { db };