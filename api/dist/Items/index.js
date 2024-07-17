"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsFunctions = void 0;
const cosmos_1 = require("@azure/cosmos");
const CRUD_1 = require("../utils/CRUD");
const functions_1 = require("@azure/functions");
const databaseId = process.env.COSMOS_DB_ID || "";
const containerId = process.env.COSMOS_CONTAINER_ID || "";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new cosmos_1.CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_KEY,
    userAgentSuffix: "CosmosDBJavascriptQuickstart",
});
(0, CRUD_1.createDatabase)(databaseId, client)
    .then(() => (0, CRUD_1.createContainer)(databaseId, containerId, "/id", client))
    .then(() => (0, CRUD_1.readDatabase)(databaseId, client))
    .then(() => (0, CRUD_1.readContainer)(databaseId, containerId, client))
    .then(() => {
    console.log(`Completed successfully`);
})
    .catch((error) => {
    console.log(`Completed with error ${JSON.stringify(error)}`);
});
const itemsFunctions = (req, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "GET" && req.params.id) {
        context.log("Items HTTP trigger function processed a GetById request.");
        //return single item
        try {
            const itemId = req.params.id;
            const { resources } = yield (0, CRUD_1.getById)(databaseId, containerId, client, itemId);
            return {
                status: 200,
                jsonBody: resources,
            };
        }
        catch (error) {
            context.error("problem with the database", error.message);
            return {
                status: 500,
                body: `Error retrieving item from the database: ${error.message}`,
            };
        }
    }
    else if (req.method === "GET") {
        context.log("Items HTTP trigger function processed a GetAll request.");
        //return all items
        try {
            const { resources } = yield (0, CRUD_1.getAll)(databaseId, containerId, client);
            return {
                status: 200,
                jsonBody: resources,
            };
        }
        catch (error) {
            context.error("problem with the database", error.message);
            return {
                status: 500,
                body: `Error retrieving items from the database: ${error.message}`,
            };
        }
    }
    else if (req.method === "POST") {
        context.log("Items HTTP trigger function processed a Create request.");
        //create new item in the database
        try {
            const newItem = (yield req.json());
            const { resource: createdItem } = yield (0, CRUD_1.createItem)(databaseId, containerId, client, newItem);
            return {
                status: 201,
                jsonBody: createdItem,
            };
        }
        catch (error) {
            context.error("problem with the database", error.message);
            return {
                status: 500,
                body: `Error creating item in the database: ${error.message}`,
            };
        }
    }
    else if (req.method === "PUT") {
        context.log("Items HTTP trigger function processed an Update request.");
        try {
            const itemId = req.params.id;
            const updatedItem = (yield req.json());
            const { resource: replacedItem } = yield (0, CRUD_1.updateItem)(databaseId, containerId, client, updatedItem, itemId);
            return {
                status: 200,
                jsonBody: replacedItem,
            };
        }
        catch (error) {
            context.error("problem with the database", error.message);
            return {
                status: 500,
                body: `Error updating item in the database: ${error.message}`,
            };
        }
    }
    else if (req.method === "DELETE") {
        context.log("Items HTTP trigger function processed a Delete request.");
        try {
            const itemId = req.params.id;
            const { resource: deletedItem } = yield (0, CRUD_1.deleteItem)(databaseId, containerId, client, itemId);
            return {
                status: 204,
                jsonBody: deletedItem,
            };
        }
        catch (error) {
            context.error("problem with the database", error.message);
            return {
                status: 500,
                body: `Error deleting item from the database: ${error.message}`,
            };
        }
    }
    else {
        context.error("Mthod not allowed");
        return {
            status: 405,
            body: "Method Not Allowed",
        };
    }
});
exports.itemsFunctions = itemsFunctions;
functions_1.app.http("Items", {
    methods: ["GET", "PUT", "DELETE", "POST"],
    handler: exports.itemsFunctions,
    route: "Items/{id?}",
});
