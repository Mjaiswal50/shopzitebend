import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { auth } from "../middleware";

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
        this.router.patch('/add/wishlist',auth, UserController.addToWishlist);
        this.router.patch('/add/tocart',auth, UserController.addToCart);
        this.router.patch('/decrease/product/quantity',auth, UserController.decreaseQuantity);
        this.router.patch('/increase/product/quantity',auth, UserController.increaseQuantity);
        this.router.patch('/delete/product/cart',auth, UserController.deleteFromCart);

    }
    postRoutes() {
        this.router.post('/signup',UserController.signup);
    }
    getRoutes() {
        this.router.get('/login',UserController.login);
        this.router.get('/get/all/products',auth, UserController.getAllProducts);
        this.router.get('/get/wishlist',auth, UserController.getWishlist);
        this.router.get('/get/cart/products',auth, UserController.getCartProducts);
    }
}

export default new UserRouter().router;