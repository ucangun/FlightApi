"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const { login, refresh } = require("../controllers/auth");

router.post("/login", login);
router.get("/refresh", refresh);

/* ------------------------------------------------------- */
module.exports = router;
