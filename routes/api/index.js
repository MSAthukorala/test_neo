var express = require("express");
var router = express.Router();

const userRoute = require("./user");



router.get("/", (req, res) => {
  res.send("Book API");
});

router.use("/user", userRoute);

module.exports = router;
