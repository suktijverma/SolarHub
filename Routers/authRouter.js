const router = require("express").Router();
const authController = require("./../Controller/authController");
// register
router.get("/getUserCredentials", authController.getLinkedinAuth);
module.exports = router;
