import {Environment} from "./environment.interface";
require('dotenv').config();

export const ProdEnvironment: Environment = {
    production: true,
    db_url: process.env.MONGO_URL
};