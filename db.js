const mongoose = require('mongoose');
const loadSchemas = require('./utils/loadSchemas');
const convertJsonSchemaToMongoose = require('./utils/jsonSchemaToMongooseDef');
const Ajv = require('ajv');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
const models = {};
const ajv = new Ajv();

function initializeModels() {
  const schemas = loadSchemas();

  Object.keys(schemas).forEach(schemaName => {
    const jsonSchema = schemas[schemaName].schema || schemas[schemaName];
    const modelName = schemaName;

    const mongooseSchemaDef = convertJsonSchemaToMongoose(jsonSchema);

    const mongooseSchema = new mongoose.Schema(mongooseSchemaDef, {
      collection: schemaName.toLowerCase(),
      strict: true
    });

    models[schemaName] = mongoose.models[modelName] ||
      mongoose.model(modelName, mongooseSchema);

    models[schemaName].ajvValidate = ajv.compile(jsonSchema);

    console.log(`Model initialized: ${modelName} using collection ${schemaName.toLowerCase()}`);
  });

  return models;
}

async function connectToDatabase() {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB!");
    initializeModels();
    return models;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  getModels: () => models
};