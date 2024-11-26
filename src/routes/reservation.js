"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Reservation API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteReservation,
} = require("../controllers/reservation");

// URL: /reservations

router.use(require("../middlewares/authentication"));

// Get all reservations and create a new reservation
router.route("/").get(list).post(create);

// Get a specific reservation by ID, update, or delete it
router
  .route("/:id")
  .get(read)
  .put(update)
  .patch(update)
  .delete(deleteReservation);

/* ------------------------------------------------------- */
module.exports = router;
