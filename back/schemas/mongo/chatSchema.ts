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
  title: {type: String, required: true},
  user: { type: String, required: true, index: true },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true })

export const chatlogSchema = new mongoose.Schema({
    id: Number,
    conversations: [conversationSchema]
})
