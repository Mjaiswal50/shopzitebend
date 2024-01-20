const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema( 
        {
          full_name: String,
          phone_number: String,
          address_line1: String,
          address_line2: String,
          city: String,
          state: String,
          pincode: String
        }
);

const address = mongoose.model('add', addressSchema);

export default address;
