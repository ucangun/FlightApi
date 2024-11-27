"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Passenger API
------------------------------------------------------- */

// Passenger Controller

const Passenger = require("../models/passenger");

module.exports = {
  // List passengers
  list: async (req, res) => {
    /* 
              #swagger.tags = ["Passengers"]
              #swagger.summary = "List Passengers"
              #swagger.description = "Fetch all passengers from the database"
          */

    const result = await res.getModelList(Passenger);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Passenger),
      result,
    });
  },

  // Create passenger
  create: async (req, res) => {
    /* 
              #swagger.tags = ["Passengers"]
              #swagger.summary = "Create Passenger"
              #swagger.parameters['body'] = {
                  in:'body',
                  required: true,
                  schema: {
                      "firstName": "John",
                      "lastName": "Doe",
                      "gender": "Male",
                      "email": "john.doe@example.com",
                      "createdId": "userId",
                  }
              }
          */

    try {
      const passengerData = req.body;
      const newPassenger = await Passenger.create(passengerData);

      res.status(201).send({
        error: false,
        result: newPassenger,
      });
    } catch (error) {
      res.status(400).send({
        error: true,
        message: "Error creating passenger",
      });
    }
  },

  // Read a single passenger by ID
  read: async (req, res) => {
    /* 
              #swagger.tags = ["Passengers"]
              #swagger.summary = "Read Passenger"
          */

    const result = await Passenger.findById(req.params.id);

    if (!result) {
      res.status(404).send({
        error: true,
        message: "Passenger not found",
      });
      return;
    }

    res.status(200).send({
      error: false,
      result,
    });
  },

  // Update a passenger by ID
  update: async (req, res) => {
    /* 
              #swagger.tags = ["Passengers"]
              #swagger.summary = "Update Passenger"
              #swagger.parameters['body'] = {
                  in: 'body',
                  required: true,
                  schema: {
                      "firstName": "John",
                      "lastName": "Doe",
                      "gender": "Male",
                      "email": "john.doe@example.com"
                  }
              }
          */

    const result = await Passenger.updateOne({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result.modifiedCount) {
      res.status(404).send({
        error: true,
        message: "Passenger not found or no changes made",
      });
      return;
    }

    res.status(202).send({
      error: false,
      result,
    });
  },

  // Delete a passenger by ID
  deletePassenger: async (req, res) => {
    /* 
              #swagger.tags = ["Passengers"]
              #swagger.summary = "Delete Passenger"
          */

    const { deletedCount } = await Passenger.deleteOne({ _id: req.params.id });

    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
