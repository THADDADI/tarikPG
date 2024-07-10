import { CosmosClient } from "@azure/cosmos";
import {
  getAll,
  createItem,
  updateItem,
  deleteItem,
  createDatabase,
  readDatabase,
  getById,
  readContainer,
  createContainer,
} from "../utils/CRUD";
import {
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { app } from "@azure/functions";
import { IItem } from "../models/Item";

const databaseId = process.env.COSMOS_DB_ID || "";
const containerId = process.env.COSMOS_CONTAINER_ID || "";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new CosmosClient({
  endpoint: process.env.COSMOSDB_ENDPOINT!,
  key: process.env.COSMOSDB_KEY!,
  userAgentSuffix: "CosmosDBJavascriptQuickstart",
});

createDatabase(databaseId, client)
  .then(() => createContainer(databaseId, containerId, "/id", client))
  .then(() => readDatabase(databaseId, client))
  .then(() => readContainer(databaseId, containerId, client))
  .then(() => {
    console.log(`Completed successfully`);
  })
  .catch((error) => {
    console.log(`Completed with error ${JSON.stringify(error)}`);
  });

export const itemsFunctions = async (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit | HttpResponse> => {
  if (req.method === "GET" && req.params.id) {
    context.log("Items HTTP trigger function processed a GetById request.");
    //return single item
    try {
      const itemId = req.params.id;
      const { resources } = await getById(
        databaseId,
        containerId,
        client,
        itemId
      );
      return {
        status: 200,
        jsonBody: resources,
      };
    } catch (error) {
      context.error("problem with the database", error.message);
      return {
        status: 500,
        body: `Error retrieving item from the database: ${error.message}`,
      };
    }
  } else if (req.method === "GET") {
    context.log("Items HTTP trigger function processed a GetAll request.");
    //return all items
    try {
      const { resources } = await getAll(databaseId, containerId, client);
      return {
        status: 200,
        jsonBody: resources,
      };
    } catch (error) {
      context.error("problem with the database", error.message);
      return {
        status: 500,
        body: `Error retrieving items from the database: ${error.message}`,
      };
    }
  } else if (req.method === "POST") {
    context.log("Items HTTP trigger function processed a Create request.");

    //create new item in the database
    try {
      const newItem = (await req.json()) as IItem;
      const { resource: createdItem } = await createItem(
        databaseId,
        containerId,
        client,
        newItem
      );
      return {
        status: 201,
        jsonBody: createdItem,
      };
    } catch (error) {
      context.error("problem with the database", error.message);
      return {
        status: 500,
        body: `Error creating item in the database: ${error.message}`,
      };
    }
  } else if (req.method === "PUT") {
    context.log("Items HTTP trigger function processed an Update request.");

    try {
      const itemId = req.params.id;
      const updatedItem = (await req.json()) as IItem;
      const { resource: replacedItem } = await updateItem(
        databaseId,
        containerId,
        client,
        updatedItem,
        itemId
      );

      return {
        status: 200,
        jsonBody: replacedItem,
      };
    } catch (error) {
      context.error("problem with the database", error.message);
      return {
        status: 500,
        body: `Error updating item in the database: ${error.message}`,
      };
    }
  } else if (req.method === "DELETE") {
    context.log("Items HTTP trigger function processed a Delete request.");

    try {
      const itemId = req.params.id;

      const { resource: deletedItem } = await deleteItem(
        databaseId,
        containerId,
        client,
        itemId
      );
      return {
        status: 204,
        jsonBody: deletedItem,
      };
    } catch (error) {
      context.error("problem with the database", error.message);
      return {
        status: 500,
        body: `Error deleting item from the database: ${error.message}`,
      };
    }
  } else {
    context.error("Mthod not allowed");
    return {
      status: 405,
      body: "Method Not Allowed",
    };
  }
};

app.http("Items", {
  methods: ["GET", "PUT", "DELETE", "POST"],
  handler: itemsFunctions,
  route: "Items/{id?}",
});
