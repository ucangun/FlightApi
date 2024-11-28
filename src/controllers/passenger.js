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
      #swagger.summary = "List all passengers"
      #swagger.description = "Fetch all passengers from the database with optional filters, sorting, and pagination."
      #swagger.responses[200] = {
        description: "List of passengers",
        schema: {
          error: false,
          details: {
            page: 1,
            limit: 10,
            total: 100
          },
          result: [
            {
              "_id": "passengerId123",
              "firstName": "John",
              "lastName": "Doe",
              "gender": "Male",
              "email": "john.doe@example.com",
              "createdId": "userId"
            }
          ]
        }
      }
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
      #swagger.summary = "Create a new passenger"
      #swagger.description = "Create a new passenger entry in the database."
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          "firstName": "John",
          "lastName": "Doe",
          "gender": "Male",
          "email": "john.doe@example.com",
          "createdId": "userId"
        }
      }
      #swagger.responses[201] = {
        description: "Passenger created successfully",
        schema: {
          error: false,
          result: {
            "_id": "passengerId123",
            "firstName": "John",
            "lastName": "Doe",
            "gender": "Male",
            "email": "john.doe@example.com",
            "createdId": "userId"
          }
        }
      }
      #swagger.responses[400] = {
        description: "Error creating passenger",
        schema: {
          error: true,
          message: "Error creating passenger"
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
      #swagger.summary = "Get a passenger by ID"
      #swagger.description = "Fetch a passenger from the database using their unique ID."
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Unique ID of the passenger',
        type: 'string'
      }
      #swagger.responses[200] = {
        description: "Passenger details",
        schema: {
          error: false,
          result: {
            "_id": "passengerId123",
            "firstName": "John",
            "lastName": "Doe",
            "gender": "Male",
            "email": "john.doe@example.com",
            "createdId": "userId"
          }
        }
      }
      #swagger.responses[404] = {
        description: "Passenger not found",
        schema: {
          error: true,
          message: "Passenger not found"
        }
      }
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
      #swagger.summary = "Update a passenger"
      #swagger.description = "Update a passenger's details in the database."
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Unique ID of the passenger to be updated',
        type: 'string'
      }
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
      #swagger.responses[202] = {
        description: "Passenger updated successfully",
        schema: {
          error: false,
          result: {
            "_id": "passengerId123",
            "firstName": "John",
            "lastName": "Doe",
            "gender": "Male",
            "email": "john.doe@example.com",
            "createdId": "userId"
          }
        }
      }
      #swagger.responses[404] = {
        description: "Passenger not found or no changes made",
        schema: {
          error: true,
          message: "Passenger not found or no changes made"
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
      #swagger.summary = "Delete a passenger"
      #swagger.description = "Delete a passenger from the database using their unique ID."
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Unique ID of the passenger to be deleted',
        type: 'string'
      }
      #swagger.responses[204] = {
        description: "Passenger deleted successfully",
        schema: {
          error: false
        }
      }
      #swagger.responses[404] = {
        description: "Passenger not found",
        schema: {
          error: true,
          message: "Passenger not found"
        }
      }
    */

    const { deletedCount } = await Passenger.deleteOne({ _id: req.params.id });

    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
