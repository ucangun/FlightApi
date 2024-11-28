"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const Flight = require("../models/flight");

module.exports = {
  // List flights
  list: async (req, res) => {
    /* 
        #swagger.tags = ["Flights"]
        #swagger.summary = "List all Flights"
        #swagger.description = `
            Retrieve all flights with optional filtering, searching, and sorting.
            <ul>
                <li>Filter: ?filter[field]=value</li>
                <li>Search: ?search[field]=value</li>
                <li>Sort: ?sort[field]=1/-1</li>
                <li>Pagination: ?page=1&limit=10</li>
            </ul>
        `
        #swagger.responses[200] = {
            description: "List of flights",
            schema: {
                error: false,
                details: { page: 1, limit: 10, total: 100 },
                result: [
                    {
                        _id: "flightId123",
                        flightNumber: "TK123",
                        airline: "Turkish Airlines",
                        departure: "Istanbul",
                        departureDate: "2024-12-25T10:00:00",
                        arrival: "New York",
                        arrivalDate: "2024-12-25T18:00:00"
                    }
                ]
            }
        }
    */

    const result = await res.getModelList(Flight);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Flight),
      result,
    });
  },

  // Create flight
  create: async (req, res) => {
    /* 
        #swagger.tags = ["Flights"]
        #swagger.summary = "Create a new Flight"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                flightNumber: "TK123",
                airline: "Turkish Airlines",
                departure: "Istanbul",
                departureDate: "2024-12-25T10:00:00",
                arrival: "New York",
                arrivalDate: "2024-12-25T18:00:00",
                createdId: "64b6c3f5f55a2e3a9a1b1c7d"
            }
        }
        #swagger.responses[200] = {
            description: "Flight successfully created",
            schema: {
                error: false,
                result: {
                    _id: "flightId123",
                    flightNumber: "TK123",
                    airline: "Turkish Airlines",
                    departure: "Istanbul",
                    departureDate: "2024-12-25T10:00:00",
                    arrival: "New York",
                    arrivalDate: "2024-12-25T18:00:00",
                    createdId: "64b6c3f5f55a2e3a9a1b1c7d"
                }
            }
        }
    */

    const result = await Flight.create(req.body);
    res.status(200).send({
      error: false,
      result,
    });
  },

  // Read a flight by ID
  read: async (req, res) => {
    /* 
        #swagger.tags = ["Flights"]
        #swagger.summary = "Get Flight by ID"
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: "Flight ID"
        }
        #swagger.responses[200] = {
            description: "Flight details",
            schema: {
                error: false,
                result: {
                    _id: "flightId123",
                    flightNumber: "TK123",
                    airline: "Turkish Airlines",
                    departure: "Istanbul",
                    departureDate: "2024-12-25T10:00:00",
                    arrival: "New York",
                    arrivalDate: "2024-12-25T18:00:00"
                }
            }
        }
        #swagger.responses[404] = {
            description: "Flight not found",
            schema: { error: true, message: "Flight not found" }
        }
    */

    const result = await Flight.findOne({ _id: req.params.id });
    if (!result) {
      res.status(404).send({
        error: true,
        message: "Flight not found",
      });
      return;
    }

    res.status(200).send({
      error: false,
      result,
    });
  },

  // Update a flight by ID
  update: async (req, res) => {
    /* 
        #swagger.tags = ["Flights"]
        #swagger.summary = "Update Flight"
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: "Flight ID"
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                flightNumber: "TK124",
                airline: "Turkish Airlines",
                departure: "Ankara",
                departureDate: "2024-12-26T12:00:00",
                arrival: "London",
                arrivalDate: "2024-12-26T14:00:00"
            }
        }
        #swagger.responses[202] = {
            description: "Flight successfully updated",
            schema: { error: false, result: { modifiedCount: 1 } }
        }
        #swagger.responses[404] = {
            description: "Flight not found",
            schema: { error: true, message: "Flight not found or no changes made" }
        }
    */

    const result = await Flight.updateOne({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result.modifiedCount) {
      res.status(404).send({
        error: true,
        message: "Flight not found or no changes made",
      });
      return;
    }

    res.status(202).send({
      error: false,
      result,
    });
  },

  // Delete a flight by ID
  deleteFlight: async (req, res) => {
    /* 
        #swagger.tags = ["Flights"]
        #swagger.summary = "Delete Flight by ID"
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: "Flight ID"
        }
        #swagger.responses[204] = {
            description: "Flight successfully deleted"
        }
        #swagger.responses[404] = {
            description: "Flight not found",
            schema: { error: true }
        }
    */

    const { deletedCount } = await Flight.deleteOne({ _id: req.params.id });
    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
