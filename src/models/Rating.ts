import * as mongoose from "mongoose";
import { model } from "mongoose";
const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rateValue: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    prodId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
})  
const Rating = mongoose.model('Rating', userSchema);
export default Rating; 
