"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Reservation Model
------------------------------------------------------- */

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Reservation Schema
const reservationSchema = new Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passengers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Passenger",
          required: true,
        },
      ],
    },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },
  },
  { collection: "reservations", timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
