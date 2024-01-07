import * as express from 'express';
import mongoose from 'mongoose';
import { getEnvironmentVariable } from './environment/environment';
import UserRouter from './routers/UserRouter';


export class Server {
    public app : express.Application = express();

    constructor() {
        this.setConfiguration();
        this.setRoutes();
    }

    setConfiguration(){
        this.connectMongodb();
    }

    connectMongodb(){
        const databaseUrl = getEnvironmentVariable().db_url;
        mongoose.connect(databaseUrl).then(() => {
            console.log('connected to database');
        });
    }

    setRoutes(){
        this.app.use('/api/user',UserRouter)
    }
    error404Handler(){
        this.app.use((req,res)=>{
            res.status(404).json({
                message: "not found",
                status_code : "404"
            })
        })
    }
    handleErrors(){
        this.app.use((error,req,res,next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'something went wrong',
                status_code : errorStatus
            })
        }) 
    }

    
}