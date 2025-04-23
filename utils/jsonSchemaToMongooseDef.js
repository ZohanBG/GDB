function convertJsonSchemaToMongoose(jsonSchema) {
    if (!jsonSchema || typeof jsonSchema !== 'object') return {};
  
    if (jsonSchema.type === 'object' && jsonSchema.properties) {
      const result = {};
      const requiredFields = jsonSchema.required || [];
      for (const [key, value] of Object.entries(jsonSchema.properties)) {
        result[key] = convertJsonSchemaToMongoose(value, requiredFields);
        if (
          requiredFields.includes(key) &&
          (value.type !== 'object' && value.type !== 'array')
        ) {
          if (typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key].required = true;
          } else if (typeof result[key] === 'function') {
            result[key] = { type: result[key], required: true };
          }
        }
      }
      return result;
    }
  
    if (jsonSchema.type === 'array' && jsonSchema.items) {
      return [convertJsonSchemaToMongoose(jsonSchema.items)];
    }
  
    switch (jsonSchema.type) {
      case 'string': return String;
      case 'number': return Number;
      case 'boolean': return Boolean;
      case 'date': return Date;
      case 'object': return {};
      default: return {};
    }
  }
  
module.exports = convertJsonSchemaToMongoose;