import User from "../models/User";
import * as jwt from "jsonwebtoken";
import Product from "../models/Product";
import product from "../models/Product";

export class UserController {
  static signup(req, res) {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });
    user
      .save()
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.send(err);
      });
  }

  static async login(req, res) {
    let userEmail = req.query.email;
    let userPassword = req.query.password;
    let data: any = await User.find({ email: userEmail });
    let user = data[0];
    if(user){
        if (user.password === userPassword) {
            const token = jwt.sign(
              {
                email: user.email,
                userID: user._id,
                type: user.type
              },
              "secret"
            );
            res.send({ token, type:user.type, msg: "Logged in Successfully", statusCode: "200" });
          }else{
            return res.status(500).json({
                msg: "Error: Wrong Password",
                status_code: "500"
            })
            }
    } else {
        return res.status(500).json({
            msg: "Error: User Not Found",
            status_code: "500"
        })
    }
  }
  static getAllProducts(req,res,next){
    Product.find({},{ __v: 0}).then(data =>{
      res.send(data);
    })
  }
  static addToWishlist(req,res,next) {
    let userID = req.userData.userID;
    let pid = req.body.pid;
    User.find({ _id: userID }).then(async (data) => {
      console.log(data);
      let arr = data[0].wishlist;
      let updatedData:any;
      if (!arr.includes(pid)) {
        updatedData = await User.findOneAndUpdate(
          { _id: userID },
          {
            $push: { wishlist: pid },
          },
          { new: true }
        );
      }else{
        updatedData = await User.findOneAndUpdate(
            { _id: userID },
            {
              $pull: { wishlist: pid },
            },
            { new: true }
          );
        }
        console.log(updatedData)
        res.send({msg:"Added to Wishlist"})
    });

  }
  static async getWishlist(req, res, next) {
    try {
        const userID = req.userData.userID;
        const user = await User.findOne({ _id: userID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const wishlistProductIds = user.wishlist;

        // Use Promise.all to wait for all product queries to complete
        const Products = await Promise.all(
            wishlistProductIds.map(async (productId) => {
                const singleProduct = await Product.findOne({ _id: productId });
                return singleProduct;
            })
        );

        console.log(Products);
        res.json(Products);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


}
