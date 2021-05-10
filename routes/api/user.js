var express = require("express");
const User = require("../../models/AppUser");
var router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require('bcrypt');
const Token = require("../../utils/JwtAuth")


//Register User
router.post(
  "/register",
  [
    check("user_email")
      .exists()
      .not()
      .isEmpty(),
    check("user_password")
      .exists()
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    try {

      let user = await User.findOne({ user_email: req.body.user_email });

      if (user) {
        return res.status(400).send('User with the provided email already exist.');
      }
      let user_password = await bcrypt.hash(req.body.user_password, 8);
      let userData = {
        user_email: req.body.user_email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_password: user_password,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
      }
      userData = await User(userData).save()

      res.status(200).send(userData)
    } catch (e) {
      res.status(422).send(e.message)
    }

  }
);

//User Login
router.post("/authenticate", [
  check('user_email').exists().not().isEmpty(),
  check('user_password').exists().not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }


  try {
    let user_email = req.body.user_email;
    let user_password = req.body.user_password;

    let user = await User.findOne({ "user_email": user_email })

    let response = await bcrypt.compare(user_password, user.user_password)
    let token = Token.sign(user._id);

    if (response == true) {
      res.status(200).send({ success: true, data: { auth: true,authToken:token } });
    } else {
      res.status(500).send({ success: true, data: { auth: false,authToken:token } });
    }

  } catch (e) {
    res.status(500).send({ success: false, data: null, error: e });
  }
 
});

//Get  Users
router.get("/getUsers", Token.check, async (req, res) => {
  try {
    let users = await User.find()
      .sort("-createdAt")

    let allResult = {
      users: users
    }
    res.send(allResult)

  } catch (e) {
    res.status(422).send(e.message)
  }
})

module.exports = router;
