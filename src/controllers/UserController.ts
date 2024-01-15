import User from "../models/User";
import * as jwt from "jsonwebtoken";
import Product from "../models/Product";
import product from "../models/Product";
import Cart from "../models/Cart";
import mongoose from "mongoose";

export class UserController {
  static async signup(req, res) {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });
    let newUser = await user.save();
    const newCart = new Cart({ products: [] });
    // Save the cart to the database
    await newCart.save();
    // Update the user's cart reference with the new cart's ObjectId using findOneAndUpdate
    await User.findOneAndUpdate(
      { _id: newUser._id },
      { $set: { cart: newCart._id } }
    );
    return res.send(newUser);
  }

  static async login(req, res) {
    let userEmail = req.query.email;
    let userPassword = req.query.password;
    let data: any = await User.find({ email: userEmail });
    let user = data[0];
    if (user) {
      if (user.password === userPassword) {
        const token = jwt.sign(
          {
            email: user.email,
            userID: user._id,
            type: user.type,
          },
          "secret"
        );
        res.send({
          token,
          type: user.type,
          msg: "Logged in Successfully",
          statusCode: "200",
        });
      } else {
        return res.status(500).json({
          msg: "Error: Wrong Password",
          status_code: "500",
        });
      }
    } else {
      return res.status(500).json({
        msg: "Error: User Not Found",
        status_code: "500",
      });
    }
  }
  static getAllProducts(req, res, next) {
    Product.find({}, { __v: 0 })
      .then(async (data: any) => {
        // Create an array of promises for each product
        const promises = data.map(async (prod: any) => {
          const userID = req.userData.userID;
          const user = await User.findOne({ _id: userID });

          // wishlist
          let wishlistProductIds = user.wishlist.map((data) => data.toString());
          if (wishlistProductIds.includes(prod._id.toString())) {
            prod.inWishlist = true;
          }
          // cart
          let cartProducts = await Cart.findOne({ _id: user.cart });
          let cartIdsArr = cartProducts.products.map((data) => {
            return data.productId.toString();
          });
          if (cartIdsArr.includes(prod._id.toString())) {
            prod.inCart = true;
          }
          return prod; // Return the modified product
        });

        // Wait for all promises to resolve before sending the response
        Promise.all(promises)
          .then((modifiedData) => {
            res.send(modifiedData);
          })
          .catch((error) => {
            console.error("Error processing promises:", error);
            res.status(500).send({ error: "Internal Server Error" });
          });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "Internal Server Error" });
      });
  }

  static addToWishlist(req, res, next) {
    let userID = req.userData.userID;
    let pid = req.body.pid;
    let isAdded = true;
    let updatedData: any;
    User.find({ _id: userID }).then(async (data) => {
      let arr = data[0].wishlist;
      if (!arr.includes(pid)) {
        isAdded = true;
        updatedData = await User.findOneAndUpdate(
          { _id: userID },
          { $push: { wishlist: pid } },
          { new: true }
        );
      } else {
        isAdded = false;
        updatedData = await User.findOneAndUpdate(
          { _id: userID },
          { $pull: { wishlist: pid } },
          { new: true }
        );
      }
      let frontendData = {
        msg: isAdded ? "Added to Wishlist" : "Removed from wishlist",
        isAdded,
      };
      res.send(frontendData);
    });
  }
  static async getWishlist(req, res, next) {
    try {
      const userID = req.userData.userID;
      const user = await User.findOne({ _id: userID });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const wishlistProductIds = user.wishlist;

      // Use Promise.all to wait for all product queries to complete
      let Products = await Promise.all(
        wishlistProductIds.map(async (productId) => {
          const singleProduct = await Product.findOne({ _id: productId });
          return singleProduct;
        })
      );

      const cartId = user.cart;

      let cartData=await Cart.findOne({_id:cartId})
      let cartArr=cartData.products;
      let cartIdArr=cartArr.map((prod:any)=>{
        return prod.productId.toString()
      })
      Products= await Promise.all(Products.map(data=>{
        if(cartIdArr.includes(data._id.toString())){
          data.inCart =true;
        }
        return data
      }))

      res.json(Products);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static addToCart(req, res, next) {
    let prodId = req.body.pid;
    let userID = req.userData.userID;
    let updatedCart: any;

    User.find({ _id: userID }).then(async (data) => {
      let cartId = data[0].cart;
      let incartalready = false;
      let orgCart = await Cart.findOne({ _id: cartId });
      let pidArr = orgCart.products.map((data) => data.productId.toString());
      if (pidArr.includes(prodId.toString())) {
        incartalready = true;
        res.send({ msg: "Product Already in cart ", incartalready });
      } else {
        let item = { productId: prodId, quantity: 1 };
        updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { $push: { products: item } },
          { new: true }
        );
        res.send({ msg: "Product is added to your cart", incartalready });
      }
    });
  }
  static getCartProducts(req, res, next) {
    let userID = req.userData.userID;
    let updatedCart: any = [];
    User.findOne({ _id: userID }).then(async (userData) => {
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });
      let oldproducts = orgCart.products;
      let newproducts = await Promise.all(
        oldproducts.map(async (oldp) => {
          let prodId = oldp.productId;
          let prodQ = oldp.quantity;
          let productdetails = await Product.findOne({ _id: prodId });
          let newObj = {
            _id: prodId,
            quantity: prodQ,
            orgProduct: productdetails,
          };
          return newObj;
        })
      );
      console.log("newproducts", newproducts);
      res.send(newproducts);
    });
  }
  static decreaseQuantity(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.map(prod=>{
        if(prod.productId.toString()==productId.toString()){
            prod.quantity=prod.quantity-1;
        }
        return prod
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      res.send({msg:"done"});
    })
  }
  static increaseQuantity(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.map(prod=>{
        if(prod.productId.toString()==productId.toString()){
            prod.quantity=prod.quantity+1;
        }
        return prod
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      // let singleOldProd=oldproducts.filter(data=>{
      //     return data.productId==productId
      // })[0]
      // await Cart.findOneAndUpdate({_id: cartId}, {$pull : {products : singleOldProd}}, { new: true})
      // singleOldProd.quantity +=1;
      // await Cart.findOneAndUpdate({_id: cartId}, {$push : {products : singleOldProd}}, { new: true})

      res.send({msg:"done"});
    })
  }

  static deleteFromCart(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.filter(prod=>{
       return (prod.productId.toString()!=productId.toString())
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      // let singleOldProd=oldproducts.filter(data=>{
      //     return data.productId==productId
      // })[0]
      // await Cart.findOneAndUpdate({_id: cartId}, {$pull : {products : singleOldProd}}, { new: true})
      // singleOldProd.quantity +=1;
      // await Cart.findOneAndUpdate({_id: cartId}, {$push : {products : singleOldProd}}, { new: true})

      res.send({msg:"done"});
    })
  }

  static async fetchMe(req,res,next){
    let user=await User.findOne({_id:req.userData.userID})
    res.send(user);
  }
  static async updateMe(req,res,next){
    let updatedData = req.body.updatedMe;
    let user = await User.findOneAndUpdate({_id:req.userData.userID},{$set : updatedData},{new:true});
    res.send(user);
  }
}
