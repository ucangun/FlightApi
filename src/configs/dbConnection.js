"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// MongoDB Connection:

const mongoose = require("mongoose");

const dbConnection = function () {
  mongoose
    .connect(process.env.MONGOURI)
    .then(() => console.log("* DB Connected * "))
    .catch((err) => console.log("* DB Not Connected * ", err));
};

/* ------------------------------------------------------- */
module.exports = {
  mongoose,
  dbConnection,
};
