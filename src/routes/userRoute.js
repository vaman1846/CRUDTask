const express = require("express");
const { login, createUser, createProfile, updateUser, updateProfile, deleteProfile } = require("../controllers/userController");
const commnMid = require("../middleware/Auth")
const Router = express.Router();

Router.post("/user", createUser);
Router.post("/login",login)
Router.post("/:userId/profile",commnMid.jwtValidation,commnMid.authorization,createProfile)
Router.put("/:userId/updateUser",commnMid.jwtValidation,commnMid.authorization,updateUser)
Router.put("/:userId/updateProfile",commnMid.jwtValidation,commnMid.authorization,updateProfile)
Router.delete("/:userId/delete",commnMid.jwtValidation,commnMid.authorization,deleteProfile)

Router.all("/**", function (req, res) {
  res.status(404).send({
    status: false,
    message: "Make sure Your Endpoint is Correct or Not",
  });
});
module.exports = Router;
