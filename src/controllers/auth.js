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
  login: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Login"
        #swagger.description = "Login with username (or email) and password to get an access token and refresh token."
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            description: "User credentials for login",
            schema: {
                "username": "testUser",
                "email": "test@example.com",
                "password": "aA?123456"
            }
        }
        #swagger.responses[200] = {
            description: "Login successful",
            schema: {
                "error": false,
                "bearer": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                },
                "data": {
                    "_id": "12345",
                    "userName": "testUser",
                    "email": "test@example.com",
                    "isActive": true
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized - Incorrect credentials or inactive account",
            schema: {
                "error": true,
                "message": "Incorrect Credentials!"
            }
        }
        #swagger.responses[400] = {
            description: "Bad Request - Missing required fields",
            schema: {
                "error": true,
                "message": "Username / Email and Password required!"
            }
        }
    */
    const { userName, email, password } = req.body;

    if (!((userName || email) && password)) {
      res.errorStatusCode = 401;
      throw new Error("Username / Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (user?.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      throw new Error("Incorrect Credentials!");
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
        #swagger.description = "Refresh access token using the refresh token."
        #swagger.parameters["cookie"] = {
            in: "cookie",
            required: true,
            description: "Refresh token stored in cookie",
            schema: {
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
        #swagger.responses[200] = {
            description: "Access token refreshed successfully",
            schema: {
                "error": false,
                "bearer": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized - Invalid or missing refresh token",
            schema: {
                "error": true,
                "message": "Invalid refresh token."
            }
        }
        #swagger.responses[400] = {
            description: "Bad Request - Missing cookie",
            schema: {
                "error": true,
                "message": "Refresh token is required."
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
      throw new Error("Wrong ID or password.");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    res.status(200).send({
      error: false,
      bearer: {
        access: jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
          expiresIn: "30m",
        }),
      },
    });
  },
};
