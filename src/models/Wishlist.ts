import * as mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
    products: [
        {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true }
      }
    ]
});

const wishlist = mongoose.model('wishlist', wishlistSchema);
export default wishlist;
