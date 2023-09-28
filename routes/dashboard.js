const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

router.get("/", (req, res) => {
  res.render("index");
});

// for users
router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUserById);
router.delete("/users/:id", userController.deleteUserById);

// for messages
router.post("/messages", messageController.createMessage);
router.get("/messages", messageController.getAllMessages);
router.get("/messages/:id", messageController.getMessageById);
router.put("/messages/:id", messageController.updateMessageById);
router.delete("/messages/:id", messageController.deleteMessageById);

module.exports = router;
