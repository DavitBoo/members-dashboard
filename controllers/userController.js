const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

// Controlador para crear un nuevo usuario
exports.createUser = [
  body("firstname", "First name must contain at least 3 characters").trim().isLength({ min: 3 }).escape(),
  body("lastname", "Last name must contain at least 3 characters").trim().isLength({ min: 3 }).escape(),
  body("email", "It must be email format").isEmail().escape(),
  body("password", "The password must contain at least 6 characters").trim().isLength({ min: 6 }).escape(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),

  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // if (password !== confirmPassword) {
    //   return res.status(400).json({ error: "Passwords do not match" });
    // }

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    } else {
      const { firstname, lastname, email, password, confirmPassword } = req.body;

      const newUser = new User({
        firstname,
        lastname,
        email,
        password,
      });

      await newUser.save();
      res.status(201).json(newUser);
    }
  }),
];

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
