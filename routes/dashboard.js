const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

const Message = require("../models/message");
const User = require("../models/user");

const passport = require("passport");

router.post(
  "/log-in",
  (req, res, next) => {
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/dashboard/signup",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find().populate("userId");
    res.render("index", { user: req.user, messages: messages });
  } catch (err) {
    return next(err);
  }
});

//sign up
router.get("/signup", (req, res) => {
  res.render("signup", { message: "Hi, hello!" });
});

// for users
router.post("/signup", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUserById);
router.delete("/users/:id", userController.deleteUserById);
router.get("/join-the-club", userController.getJoinTheClub);
router.post("/join-the-club", userController.postJoinTheClub);

// for messages
router.get("/new-message", messageController.newMessage);
router.post("/messages", messageController.postMessage);
router.get("/messages", messageController.getAllMessages);
router.get("/messages/:id", messageController.getMessageById);
router.put("/messages/:id", messageController.updateMessageById);
router.post("/delete/:id", messageController.deleteMessageById);

module.exports = router;
