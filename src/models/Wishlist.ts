import * as mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    products: [
        {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true }
      }
    ]
});

const cart = mongoose.model('cart', cartSchema);
export default cart;
