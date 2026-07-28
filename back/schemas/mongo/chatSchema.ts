import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  user: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  model: String,
  searchMode: Boolean
});

export const conversationSchema = new mongoose.Schema({
    messages: [messageSchema]
})

export const chatlogSchema = new mongoose.Schema({
    id: Number,
    conversations: [conversationSchema]
})