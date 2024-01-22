import * as mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    address: {
          full_name: String,
          phone_number: String,
          address_line1: String,
          address_line2: String,
          city: String,
          state: String,
          pincode: String
          },
    cart: [
        {
        orgProduct: { type: Object },
        quantity: { type: Number, default: 1 },
      }
    ],
    status: {type: String, default: "Order Placed"},
    MOP: String,
    date: { type: Date, default: Date.now },
    final_date: { type: Date, default: Date.now },
    
  });

const order = mongoose.model('order', orderSchema);
export default order;
