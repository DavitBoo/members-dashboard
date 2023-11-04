const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

// Controlador para crear un nuevo usuario
exports.createUser = [
  body("firstname", "First name must contain at least 3 characters").trim().isLength({ min: 3 }).escape(),
  body("lastname", "Last name must contain at least 3 characters").trim().isLength({ min: 3 }).escape(),
  body("username", "It must be email format").isEmail().escape(),
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
      const { firstname, lastname, username, password } = req.body;

      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          res.status(400).json(err);
        } else {
          const newUser = new User({
            firstname,
            lastname,
            username,
            password: hashedPassword,
          });

          await newUser.save();
          res.redirect("/dashboard");
        }
        // otherwise, store hashedPassword in DB
      });
    }
  }),
];

exports.loginUser = asyncHandler(async (req, res) => {
  res.render("./layout/layout", { page: "login", user: req.user });
})

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

exports.getJoinTheClub = asyncHandler(async (req, res) => {
  res.render("./layout/layout", { page: "joinTheClub", user: req.user});
});

exports.postJoinTheClub = asyncHandler(async (req, res) => {
  if (process.env.MEMBER_CODE === req.body.code) {
    const userId = req.body.userId;

    try {
      // Busca al usuario por su nombre de usuario:
      const user = await User.findById(userId);

      if (!user) {
        console.log("Usuario no encontrado");
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualiza el estado del usuario de "guest" a "member":
      user.status = "member";

      // Guarda los cambios en la base de datos:
      await user.save();

      console.log("Usuario actualizado con éxito");
      return res.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  } else {
    return res.status(403).json({ message: "Código de membresía incorrecto" });
  }
});

// panel con todos los usuarios
exports.getUserPanel = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.render("./layout/layout", { page: "userPanel", users, user: req.user });
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

exports.postUserPanel = asyncHandler(async (req, res) => {
  const { userStatus, usernames } = req.body;
  console.log(usernames);

  for (const username of usernames) {
    const newStatus = userStatus[username]; // Nuevo estado para el usuario
    // Actualiza el estado del usuario en tu base de datos
    await User.updateOne({ username }, { status: newStatus });
  }

  res.redirect("/"); // Redirige a la página de panel de usuario después de actualizar
});
