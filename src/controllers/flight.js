"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

// Flight Controller:

const Flight = require("../models/flight");

module.exports = {
  // List flights
  list: async (req, res) => {
    /* 
              #swagger.tags = ["Flights"]
              #swagger.summary = "List Flights"
              #swagger.description = `
                  You can send query with endpoint for filter[], search[], sort[], page and limit.
                  <ul> Examples:
                      <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                      <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                      <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                      <li>URL/?<b>page=2&limit=1</b></li>
                  </ul>
              `
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
              #swagger.summary = "Create Flight"
              #swagger.parameters['body'] = {
                  in:'body',
                  required: true,
                  schema: {
                      "flightNumber": "TK123",
                      "airline": "Turkish Airlines",
                      "departure": "Istanbul",
                      "departureDate": "2024-12-25T10:00:00",
                      "arrival": "New York",
                      "arrivalDate": "2024-12-25T18:00:00",
                      "createdBy": "userId",
                  }
              }
          */

    const result = await Flight.create(req.body);

    res.status(200).send({
      error: false,
      result,
    });
  },

  // Read a single flight by ID
  read: async (req, res) => {
    /* 
              #swagger.tags = ["Flights"]
              #swagger.summary = "Read Flight"
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
              #swagger.parameters['body'] = {
                  in: 'body',
                  required: true,
                  schema: {
                      "flightNumber": "TK123",
                      "airline": "Turkish Airlines",
                      "departure": "Istanbul",
                      "departureDate": "2024-12-25T10:00:00",
                      "arrival": "New York",
                      "arrivalDate": "2024-12-25T18:00:00",
                  }
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
              #swagger.summary = "Delete Flight"
          */

    const { deletedCount } = await Flight.deleteOne({ _id: req.params.id });

    res.status(deletedCount ? 204 : 404).send({
      error: !deletedCount,
    });
  },
};
