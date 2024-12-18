"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

// auth:
router.use("/auth", require("./auth"));

// users:
router.use("/users", require("./user"));

// flights:
router.use("/flights", require("./flight"));

// reservations:
router.use("/reservations", require("./reservation"));

// reservations:
router.use("/passengers", require("./passenger"));

// documents:
router.use("/documents", require("./document"));

/* ------------------------------------------------------- */
module.exports = router;
