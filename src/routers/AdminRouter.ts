import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { adminauth, auth } from "../middleware";

export class AdminRouter {
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
        this.router.post('/addproduct',adminauth,AdminController.addproduct);
    }
    getRoutes() {
    }
}

export default new AdminRouter().router;