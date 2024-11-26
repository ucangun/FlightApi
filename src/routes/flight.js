"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteFlight,
} = require("../controllers/flight");

// URL: /flights

// Get all flights and create a new flight
router.route("/").get(list).post(create);

// Get a specific flight by ID, update, or delete it
router.route("/:id").get(read).put(update).patch(update).delete(deleteFlight);

/* ------------------------------------------------------- */
module.exports = router;
