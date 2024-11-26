"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Passenger Schema
const passengerSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "passengers", timestamps: true }
);

module.exports = mongoose.model("Passenger", passengerSchema);
