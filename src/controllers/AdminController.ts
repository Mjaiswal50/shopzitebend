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
static  deleteProduct(req,res,next){
  const productId = req.params.id;
  console.log(productId);
  Product.findOne({ _id : productId }).then(data =>{
    if (!data) {
      return res.json({ error: 'Product not found' });
    }
    return data.deleteOne();
  }).then(() => {
    res.json({ message: 'Product deleted successfully' });
  }).catch(err => {
    res.json({ error: err.message });
  });
  }
}
