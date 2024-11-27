"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Passenger API
------------------------------------------------------- */

const router = require("express").Router();
const {
  list,
  create,
  read,
  update,
  deletePassenger,
} = require("../controllers/passenger");
const restrictTo = require("../middlewares/permissions");

// URL: /passengers

// Get all passengers and create a new passenger
router.route("/").get(restrictTo("admin", "staff"), list).post(create);

router.use(restrictTo("admin", "staff"));

router
  .route("/:id")
  .get(read)
  .put(update)
  .patch(update)
  .delete(deletePassenger);

module.exports = router;
