const express = require('express');
const loadSchemas = require('./utils/loadSchemas');
const createDynamicRoutes = require('./routes/dynamicRoutes');
const { connectToDatabase } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

async function startServer() {
  try {
    await connectToDatabase();
    
    const schemas = loadSchemas();
    
    const dynamicRoutes = createDynamicRoutes(schemas);
    
    app.use('/api', dynamicRoutes);
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();