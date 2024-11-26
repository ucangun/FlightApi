"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Auth Controller:

const { promisify } = require("util");
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

    // Access Token Oluşturma
    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
      expiresIn: "30m",
    });

    // Refresh Token Oluşturma
    const refreshToken = jwt.sign(
      { _id: user._id, password: user.password },
      process.env.REFRESH_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      error: false,
      bearer: {
        accessToken,
      },
      data: user,
    });
  },

  refresh: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Refresh"
        #swagger.description = 'Refresh with refreshToken for get accessToken'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "bearer": {
                    refresh: '...refresh_token...'
                }
            }
        }
    */

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.errorStatusCode = 401;
      throw new Error("Refresh token is required.");
    }

    const refreshData = await promisify(jwt.verify)(
      refreshToken,
      process.env.REFRESH_KEY
    );

    if (!refreshData) {
      res.errorStatusCode = 401;
      throw new Error("Invalid refresh token.");
    }

    const user = await User.findOne({ _id: refreshData._id });

    if (!(user && user.password == refreshData.password)) {
      res.errorStatusCode = 401;
      throw new Error("Wrong id or password.");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    res.status(200).send({
      error: false,
      bearer: {
        access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
          expiresIn: "30m",
        }),
      },
    });
  },
};
