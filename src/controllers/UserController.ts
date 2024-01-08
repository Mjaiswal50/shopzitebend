import User from "../models/User";
import * as jwt from "jsonwebtoken";

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


}
