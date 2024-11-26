"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Reservations API
------------------------------------------------------- */
const Reservation = require("../models/reservation");
const Passenger = require("../models/passenger");
const Flight = require("../models/flight");

module.exports = {
  list: async (req, res) => {
    const reservations = await res.getModelList(Reservation);

    // Get the details of pagination, filters, etc.
    const details = await res.getModelListDetails(Reservation);

    res.status(200).send({
      error: false,
      details,
      data: reservations,
    });
  },

  create: async (req, res) => {
    const { flightId } = req.body;
    const passengerInfo = req.body.passengers;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).send({
        error: true,
        message: "Flight not found",
      });
    }

    let passenger;

    // Kullanıcı giriş yapmışsa, req.user'dan yolcu bilgilerini al
    if (req.user) {
      passenger = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        gender: req.user.gender,
        email: req.user.email,
      };
    } else {
      // Kullanıcı giriş yapmamışsa, passangersInfo'dan gelen veriyi al
      if (!passengerInfo) {
        return res.status(400).send({
          error: true,
          message: "Passenger information is required.",
        });
      }

      passenger = passengerInfo;
    }

    const newPassenger = await Passenger.create(passenger);

    const reservation = await Reservation.create({
      flightId,
      passengers: [newPassenger._id],
      createdId: req.user ? req.user._id : newPassenger._id,
    });

    res.status(201).send({
      error: false,
      result: reservation,
    });
  },

  read: async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).populate(
      "flightId passengers"
    );

    if (!reservation) {
      return res.status(404).send({
        error: true,
        message: "Reservation not found",
      });
    }

    res.status(200).send({
      error: false,
      result: reservation,
    });
  },

  update: async (req, res) => {
    // Update reservation by ID
    const result = await Reservation.updateOne(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!result.nModified) {
      return res.status(404).send({
        error: true,
        message: "Reservation not found or no changes",
      });
    }

    res.status(202).send({
      error: false,
      result: result,
    });
  },

  deleteReservation: async (req, res) => {
    // Delete reservation by ID
    const { deletedCount } = await Reservation.deleteOne({
      _id: req.params.id,
    });

    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
