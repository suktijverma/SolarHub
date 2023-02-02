const router = require("express").Router();
const userController = require("./../Controller/userController");
// register
router.post("/createUser", userController.signup);
module.exports = router;
