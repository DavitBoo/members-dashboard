const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// Controlador para crear un nuevo usuario
exports.createUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const newUser = new User({
    firstname,
    lastname,
    email,
    password,
  });

  await newUser.save();
  res.status(201).json(newUser);
});

// Controlador para obtener todos los usuarios
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Controlador para obtener un usuario por su ID
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json(user);
});

// Controlador para actualizar un usuario por su ID
exports.updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json(user);
});

// Controlador para eliminar un usuario por su ID
exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(204).send();
});
