"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const mongoose = require("mongoose");

// Flight Schema
const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      trim: true,
      required: true,
    },
    airline: {
      type: String,
      trim: true,
      required: true,
    },
    departure: {
      type: String,
      trim: true,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    arrival: {
      type: String,
      trim: true,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: Date.now,
    },
  },
  {
    collection: "flights",
    timestamps: true,
  }
);

// Flight Model
const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
