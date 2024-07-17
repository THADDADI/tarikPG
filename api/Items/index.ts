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
import { BlobServiceClient } from "@azure/storage-blob";

const databaseId = process.env.COSMOS_DB_ID || "";
const containerId = process.env.COSMOS_CONTAINER_ID || "";
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Cosmos config
const client = new CosmosClient({
  endpoint: process.env.COSMOSDB_ENDPOINT!,
  key: process.env.COSMOSDB_KEY!,
  userAgentSuffix: "CosmosDBJavascriptQuickstart",
});

// Establishes a connection with Azure Blob Storage
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net/?${sasToken}`
);
const containerClient = blobServiceClient.getContainerClient(containerName);

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

const storeMetadata = async (id, name, caption, fileType, imageUrl) => {
  const container = client.database("tutorial").container("metadata");
  await container.item(id, id).replace({ name, caption, fileType, imageUrl });
};

const extractMetadata = (
  headers
): { fileName: string; caption: string; fileType: string } => {
  const contentType = headers["content-type"];
  const fileType: string = contentType.split("/")[1];
  const contentDisposition = headers["content-disposition"] || "";
  const caption: string = headers["x-image-caption"] || "No caption provided";
  const matches = /filename="([^"]+)"/i.exec(contentDisposition);
  const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType };
};

export const itemsFunctions = async (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit | HttpResponse> => {
  req.headers.set("Content-Type", "application/json");
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
  } else if (req.url !== "/api/upload" && req.method === "POST") {
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
  } else if (req.url === "/api/upload" && req.method === "POST") {
    try {
      // Extract metadata from headers
      const { fileName, caption, fileType } = await extractMetadata(
        req.headers
      );

      // Upload the image as a to Azure Storage Blob as a stream
      const blobClient = containerClient.getBlockBlobClient(fileName);
      await blobClient.uploadStream(req);
      const imageUrl = blobClient.url;

      // Store the metadata in MongoDB
      await storeMetadata(fileName, caption, fileType, imageUrl);

      return {
        status: 500,
        jsonBody: {
          message: "Image uploaded and metadata stored successfully",
          imageUrl,
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: "Internal Server Error",
      };
    }
  } else {
    context.error("Method not allowed");

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
