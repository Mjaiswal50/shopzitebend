import * as mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    products: [
        {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
      }
    ]
});

const cart = mongoose.model('cart', cartSchema);
export default cart;
