const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del usuario
    ref: "User", // Referencia al modelo User
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
