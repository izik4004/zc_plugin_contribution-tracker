// Package Modules
const axios = require("axios");

// Custom Modules
const { DATABASE_CONFIG, PLUGIN_ID } = require("../config");
const CustomError = require("../utils/custom-error");

class ZuriDatabase {
  constructor(collection_name) {

    this.DB_WRITE_URL = DATABASE_CONFIG.WRITE_URL;
    this.DB_READ_URL = DATABASE_CONFIG.READ_URL;
    this.DB_DELETE_URL = DATABASE_CONFIG.DELETE_URL;

    // Set the default values for the DB operations
    this.DB_DEFAULTS_CONFIG = {
      plugin_id: PLUGIN_ID,
      collection_name: collection_name,
      bulk_write: false,
      object_id: "",
      filter: {},
      payload: {},
    };
  }

  // Create
  async create(payload, organization_id) {
    // Set the payload
    this.DB_DEFAULTS_CONFIG.payload = payload;
    this.DB_DEFAULTS_CONFIG.organization_id = organization_id

    try {
      // Make the request
      const response = await axios.post(
        this.DB_WRITE_URL,
        JSON.stringify(this.DB_DEFAULTS_CONFIG)
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [CREATE]: ${error}`,
        "500",
        error.response.data
      );
    }
  }

  // Fetch a single object from the DB
  async fetchOne(object_id, organization_id) {
    try {

      this.DB_DEFAULTS_CONFIG.organization_id = organization_id
      // Make the request
      const response = await axios.get(
        `${this.DB_READ_URL}/${this.DB_DEFAULTS_CONFIG.plugin_id}/${this.DB_DEFAULTS_CONFIG.collection_name}/${this.DB_DEFAULTS_CONFIG.organization_id}?_id=${object_id}`
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [READ ONE]: ${error}`,
        "500",
        error.response.data
      );
    }
  }

  // Fetch a object by Parameter
  async fetchByParameter(object, organization_id) {
    try {

      this.DB_DEFAULTS_CONFIG.organization_id = organization_id
      // Convert the object to a query string
      const query_string = new URLSearchParams(object).toString();

      // Make the request
      const response = await axios.get(
        `${this.DB_READ_URL}/${this.DB_DEFAULTS_CONFIG.plugin_id}/${this.DB_DEFAULTS_CONFIG.collection_name}/${this.DB_DEFAULTS_CONFIG.organization_id}?${query_string}`
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [READ ONE BY PARAMETER]: ${error}`,
        "500",
        error.response.data
      );
    }
  }

  // Fetches all objects from the DB
  async fetchAll(organization_id) {
    try {

      this.DB_DEFAULTS_CONFIG.organization_id = organization_id
      // Make the request
      const response = await axios.get(
        `${this.DB_READ_URL}/${this.DB_DEFAULTS_CONFIG.plugin_id}/${this.DB_DEFAULTS_CONFIG.collection_name}/${this.DB_DEFAULTS_CONFIG.organization_id}`
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [READ ALL]: ${error}`,
        "500",
        error.response.data
      );
    }
  }

  // Update
  async update(object_id, payload, organization_id) {
    // Set the payload
    this.DB_DEFAULTS_CONFIG.payload = payload;
    // Set the ID of the object to be updated
    this.DB_DEFAULTS_CONFIG.object_id = object_id;

    this.DB_DEFAULTS_CONFIG.organization_id = organization_id
    try {
      // Make the request
      const response = await axios.put(
        this.DB_WRITE_URL,
        JSON.stringify(this.DB_DEFAULTS_CONFIG)
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [UPDATE]: ${error}`,
        "500",
        error.response.data
      );
    }
  }

  // Delete - Not Implemented in Zuri Core API yet
  async delete(object_id, payload, organization_id) {
    // Set the payload
    this.DB_DEFAULTS_CONFIG.payload = payload;
    // Set the ID of the object to be deleted
    this.DB_DEFAULTS_CONFIG.object_id = object_id;
    this.DB_DEFAULTS_CONFIG.organization_id = organization_id

    try {
      // Make the request
      const response = await axios.post(
        this.DB_DELETE_URL,
        JSON.stringify(this.DB_DEFAULTS_CONFIG)
      );

      // Return the response
      return response.data;
    } catch (error) {
      throw new CustomError(
        `Unable to Connect to Zuri Core DB [DELETE]: ${error}`,
        "500"
      );
    }
  }
}

module.exports = ZuriDatabase;