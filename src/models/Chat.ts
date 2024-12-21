import * as mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chat = mongoose.model('chat', chatSchema);
export default chat;
