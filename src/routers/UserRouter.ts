import { Router } from "express";
import { UserController } from "../controllers/UserController";

export class UserRouter {
    public router: Router ;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    deleteRoutes() {
        
    }
    patchRoutes() {
        
    }
    postRoutes() {
        this.router.post('/signup',UserController.signup)
    }
    getRoutes() {
        this.router.get('/login',UserController.login)
    }
}

export default new UserRouter().router;