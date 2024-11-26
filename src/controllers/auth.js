"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Auth Controller:

const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */
  login: async (req, res) => {
    const { userName, email, password } = req.body;

    if (!((userName || email) && password)) {
      res.errorStatusCode = 401;
      throw new Error("Username / Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (user?.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      throw new Error("Incorrect Credeantials!");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    const accessData = {
      _id: user._id,
    };

    const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {
      expiresIn: "30m",
    });

    const refreshData = {
      _id: user._id,
    };

    const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {
      expiresIn: "1d",
    });

    res.status(200).send({
      error: false,
      bearer: {
        accessToken,
        refreshToken,
      },
      data: user,
    });
  },
};
