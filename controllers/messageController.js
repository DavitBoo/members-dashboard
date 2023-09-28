const asyncHandler = require("express-async-handler");
const Message = require("../models/message");

// Controlador para crear un nuevo mensaje
exports.createMessage = asyncHandler(async (req, res) => {
  const newMessage = new Message(req.body);
  await newMessage.save();
  res.status(201).json(newMessage);
});

// Controlador para obtener todos los mensajes
exports.getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();
  res.status(200).json(messages);
});

// Controlador para obtener un mensaje por su ID
exports.getMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.status(200).json(message);
});

// Controlador para actualizar un mensaje por su ID
exports.updateMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!message) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.status(200).json(message);
});

// Controlador para eliminar un mensaje por su ID
exports.deleteMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.status(204).send();
});
