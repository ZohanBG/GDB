const express = require('express');
const { getModels } = require('../db');

function createDynamicRoutes(schemas) {
  const router = express.Router();
  const models = getModels();

  Object.keys(schemas).forEach((schemaName) => {
    const schemaConfig = schemas[schemaName];
    const mongoConfig = schemaConfig.mongoConfig || {};
    const routePath = mongoConfig.routePath || schemaName.toLowerCase();
    const Model = models[schemaName];

    if (!Model) {
      console.error(`Model for schema ${schemaName} not found`);
      return;
    }

    // Create route
    router.post(`/${routePath}`, async (req, res) => {
      try {
        const newDocument = new Model(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
      } catch (err) {
        res.status(500).json({ error: 'Error creating document', message: err.message });
      }
    });

    // Read all route
    router.get(`/${routePath}`, async (req, res) => {
      try {
        const documents = await Model.find();
        res.status(200).json(documents);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching documents', message: err.message });
      }
    });

    // Read one route
    router.get(`/${routePath}/:id`, async (req, res) => {
      try {
        const document = await Model.findById(req.params.id);
        if (!document) {
          return res.status(404).json({ error: `${schemaName} not found` });
        }
        res.status(200).json(document);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching document', message: err.message });
      }
    });

    // Update route
    router.put(`/${routePath}/:id`, async (req, res) => {
      try {
        const updatedDocument = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedDocument) {
          return res.status(404).json({ error: `${schemaName} not found` });
        }
        
        res.status(200).json(updatedDocument);
      } catch (err) {
        res.status(500).json({ error: 'Error updating document', message: err.message });
      }
    });

    // Delete route
    router.delete(`/${routePath}/:id`, async (req, res) => {
      try {
        const deletedDocument = await Model.findByIdAndDelete(req.params.id);
        
        if (!deletedDocument) {
          return res.status(404).json({ error: `${schemaName} not found` });
        }
        
        res.status(200).json({ message: `${schemaName} deleted successfully` });
      } catch (err) {
        res.status(500).json({ error: 'Error deleting document', message: err.message });
      }
    });
  });

  return router;
}

module.exports = createDynamicRoutes;