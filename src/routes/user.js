"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require("express").Router();
const restrictTo = require("../middlewares/permissions");

/* ------------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteUser,
} = require("../controllers/user");

// URL: /users

router.route("/").get(list).post(create);

router.use(restrictTo("admin"));

router.route("/:id").get(read).put(update).patch(update).delete(deleteUser);

/* ------------------------------------------------------- */
module.exports = router;
