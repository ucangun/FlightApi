"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Reservations API
------------------------------------------------------- */

const Reservation = require("../models/reservation");
const Passenger = require("../models/passenger");
const Flight = require("../models/flight");

module.exports = {
  // List Reservations
  list: async (req, res) => {
    /* 
              #swagger.tags = ["Reservations"]
              #swagger.summary = "List Reservations"
              #swagger.description = "Fetch all reservations with pagination and filters"
              #swagger.responses[200] = {
                description: "List of reservations fetched successfully",
                schema: {
                  error: false,
                  details: { 
                    pagination: { currentPage: 1, totalPages: 5 },
                    filters: { flightId: 'string', date: 'string' }
                  },
                  data: [
                    {
                      reservationId: "12345",
                      flightId: "67890",
                      passengers: [{ firstName: "John", lastName: "Doe" }],
                      createdAt: "2024-11-20T00:00:00Z"
                    }
                  ]
              }
          */

    const reservations = await res.getModelList(Reservation);
    const details = await res.getModelListDetails(Reservation);

    res.status(200).send({
      error: false,
      details,
      data: reservations,
    });
  },

  // Create a Reservation
  create: async (req, res) => {
    /* 
              #swagger.tags = ["Reservations"]
              #swagger.summary = "Create Reservation"
              #swagger.description = "Create a new reservation for a flight and passengers"
              #swagger.parameters['body'] = {
                  in: 'body',
                  required: true,
                  schema: {
                      "flightId": "1234567890abcdef12345678",
                      "passengers": {
                          "firstName": "John",
                          "lastName": "Doe",
                          "gender": "Male",
                          "email": "john.doe@example.com"
                      }
                  }
              }
          */

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
    if (req.user) {
      passenger = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        gender: req.user.gender,
        email: req.user.email,
      };
    } else {
      if (
        !passengerInfo ||
        passengerInfo.length === 0 ||
        !passengerInfo[0].firstName ||
        !passengerInfo[0].lastName ||
        !passengerInfo[0].email
      ) {
        return res.status(400).send({
          error: true,
          message: "Passenger information is required.",
        });
      }
      passenger = passengerInfo[0];
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

  // Read a Reservation by ID
  read: async (req, res) => {
    /* 
              #swagger.tags = ["Reservations"]
              #swagger.summary = "Read Reservation"
              #swagger.description = "Fetch details of a specific reservation by ID"
              #swagger.responses[200] = {
                description: "Reservation found successfully",
                schema: {
                  error: false,
                  result: {
                    reservationId: "12345",
                    flightId: "67890",
                    passengers: [{ firstName: "John", lastName: "Doe" }],
                    createdAt: "2024-11-20T00:00:00Z"
                  }
              }
              }
              #swagger.responses[404] = {
                description: "Reservation not found",
                schema: { error: true, message: "Reservation not found" }
              }
          */

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

  // Update a Reservation by ID
  update: async (req, res) => {
    /* 
              #swagger.tags = ["Reservations"]
              #swagger.summary = "Update Reservation"
              #swagger.parameters['body'] = {
                  in: 'body',
                  required: true,
                  schema: {
                      "flightId": "1234567890abcdef12345678",
                      "passengers": ["1234567890abcdef12345679"]
                  }
              }
              #swagger.responses[202] = {
                description: "Reservation updated successfully",
                schema: {
                  error: false,
                  result: {
                    reservationId: "12345",
                    flightId: "67890",
                    passengers: [{ firstName: "John", lastName: "Doe" }],
                    createdAt: "2024-11-20T00:00:00Z"
                  }
              }
              }
              #swagger.responses[404] = {
                description: "Reservation not found or no changes made",
                schema: { error: true, message: "Reservation not found or no changes made" }
              }
          */

    const result = await Reservation.updateOne(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!result.modifiedCount) {
      return res.status(404).send({
        error: true,
        message: "Reservation not found or no changes made",
      });
    }

    res.status(202).send({
      error: false,
      result,
    });
  },

  // Delete a Reservation by ID
  deleteReservation: async (req, res) => {
    /* 
              #swagger.tags = ["Reservations"]
              #swagger.summary = "Delete Reservation"
              #swagger.description = "Delete a specific reservation by ID"
              #swagger.responses[204] = {
                description: "Reservation deleted successfully",
                schema: { error: false }
              }
              #swagger.responses[404] = {
                description: "Reservation not found",
                schema: { error: true }
              }
          */

    const { deletedCount } = await Reservation.deleteOne({
      _id: req.params.id,
    });

    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
