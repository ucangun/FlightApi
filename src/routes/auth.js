"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const { login } = require("../controllers/auth");

router.post("/login", login);

/* ------------------------------------------------------- */
module.exports = router;
