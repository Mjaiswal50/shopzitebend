import * as mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    products: [
        {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
      }
    ]
});

const order = mongoose.model('order', orderSchema);
export default order;
