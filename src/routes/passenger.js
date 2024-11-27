"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Passenger API
------------------------------------------------------- */

const router = require("express").Router();
const restrictTo = require("../middlewares/permissions");

const {
  list,
  create,
  read,
  update,
  deletePassenger,
} = require("../controllers/passenger");

// URL: /passengers

// Get all passengers and create a new passenger
router.route("/").get(restrictTo("admin"), list).post(create);

router.use(restrictTo("admin"));

router
  .route("/:id")
  .get(read)
  .put(update)
  .patch(update)
  .delete(deletePassenger);

module.exports = router;
