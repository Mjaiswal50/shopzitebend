import User from "../models/User";
import * as jwt from "jsonwebtoken";
import Product from "../models/Product"
export class AdminController {


  static addproduct(req,res,next){
      console.log("product added")
      let userProduct = req.body;
      const newProduct = new Product(userProduct)
      newProduct.save().then(data => {
        res.send(data);
      })
  }
  static getAllProducts(req,res,next){
    Product.find({},{ __v: 0}).then(data =>{
      res.send(data);
    })
}
}
