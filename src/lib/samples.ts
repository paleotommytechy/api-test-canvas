export const PETSTORE_SWAGGER = {
  "openapi": "3.0.0",
  "info": {
    "title": "Swagger Petstore",
    "description": "This is a sample server Petstore server. You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/). For this sample, you can use the api key `special-key` to test the authorization filters.",
    "version": "1.0.0"
  },
  "servers": [
    { "url": "https://petstore.swagger.io/v2" }
  ],
  "paths": {
    "/pet": {
      "post": {
        "tags": ["pet"],
        "summary": "Add a new pet to the store",
        "operationId": "addPet",
        "requestBody": {
          "description": "Pet object that needs to be added to the store",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Pet" }
            }
          },
          "required": true
        },
        "responses": {
          "200": { "description": "Successful operation" },
          "405": { "description": "Invalid input" }
        }
      }
    },
    "/pet/findByStatus": {
      "get": {
        "tags": ["pet"],
        "summary": "Finds Pets by status",
        "description": "Multiple status values can be provided with comma separated strings",
        "operationId": "findPetsByStatus",
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "description": "Status values that need to be considered for filter",
            "required": true,
            "schema": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["available", "pending", "sold"],
                "default": "available"
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Pet" }
                }
              }
            }
          },
          "400": { "description": "Invalid status value" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Pet": {
        "type": "object",
        "required": ["name", "photoUrls"],
        "properties": {
          "id": { "type": "integer", "format": "int64" },
          "category": { "type": "object", "properties": { "id": { "type": "integer" }, "name": { "type": "string" } } },
          "name": { "type": "string", "example": "doggie" },
          "photoUrls": { "type": "array", "items": { "type": "string" } },
          "tags": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "integer" }, "name": { "type": "string" } } } },
          "status": { "type": "string", "description": "pet status in the store", "enum": ["available", "pending", "sold"] }
        }
      }
    }
  }
};
