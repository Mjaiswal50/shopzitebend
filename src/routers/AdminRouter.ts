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
        this.router.delete('/delete/product/:id', adminauth, AdminController.deleteProduct);
    }
    patchRoutes() {
        this.router.patch('/edit/product',adminauth,AdminController.editProduct);
    }
    postRoutes() {
        this.router.post('/add/product',adminauth,AdminController.addproduct);
    }
    getRoutes() {
        this.router.get('/get/all/products',adminauth,AdminController.getAllProducts);

    }
}

export default new AdminRouter().router;