const fs = require('fs');
const path = require('path');

function loadSchemas() {
  const schemasPath = path.join(__dirname, '../schemas');
  const schemaFiles = fs.readdirSync(schemasPath);

  const schemas = {};

  schemaFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const schemaName = path.basename(file, '.json');
      const schemaData = JSON.parse(fs.readFileSync(path.join(schemasPath, file), 'utf-8'));
      schemas[schemaName] = schemaData;
    }
  });

  return schemas;
}

module.exports = loadSchemas;