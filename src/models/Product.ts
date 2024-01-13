import * as mongoose from "mongoose";
import {model} from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    picUrl : {type: String, required: true,default:"https://reqres.in/img/faces/1-image.jpg"},
    inWishlist : {type: Boolean, required: false ,default: false},
    inCart : {type: Boolean, required: false ,default: false}
})   

const product = mongoose.model('product', productSchema);
export default product;
