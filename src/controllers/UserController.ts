import User from "../models/User";
import * as jwt from "jsonwebtoken";

export class UserController {
    static signup(req,res) {
        const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: req.body.password,
        })
        user.save().then((data) => {
			return res.send(data);
		}).catch(err => {
			return res.send(err)
		});	
    }

}