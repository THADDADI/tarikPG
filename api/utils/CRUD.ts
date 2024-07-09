import {
  ContainerResponse,
  CosmosClient,
  DatabaseResponse,
  FeedResponse,
  ItemDefinition,
  ItemResponse,
  PartitionKeyDefinition,
} from "@azure/cosmos";
import { IItem } from "../models/Item";
// Create DB if not existing
export const createDatabase = async (
  databaseId: string,
  client: CosmosClient
): Promise<DatabaseResponse> => {
  console.log(`Creating database if not existing`);

  return await client.databases.createIfNotExists({
    id: databaseId,
  });
};

/**
 * Read the database definition
 */
export const readDatabase = async (
  databaseId: string,
  client: CosmosClient
): Promise<DatabaseResponse> => {
  console.log(`Reading database`);

  return await client.database(databaseId).read();
};

/**
 * Create the container if it does not exist
 */
export const createContainer = async (
  databaseId: string,
  containerId: string,
  partitionKey: string | PartitionKeyDefinition | undefined,
  client: CosmosClient
): Promise<ContainerResponse> => {
  console.log(`Creating container if not existing`);

  return await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey: partitionKey },
      { offerThroughput: 400 }
    );
};

/**
 * Read the container definition
 */
export const readContainer = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient
) => {
  console.log(`Reading container`);

  return await client.database(databaseId).container(containerId).read();
};

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
export const scaleContainer = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient
) => {
  console.log(`Scaling container`);

  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  const { resources: offers } = await client.offers.readAll().fetchAll();

  const newRups = 500;
  for (const offer of offers) {
    if (containerDefinition?._rid !== offer.offerResourceId) {
      continue;
    }
    if (offer.content) offer.content.offerThroughput = newRups;
    const offerToReplace = client.offer(offer.id);
    await offerToReplace.replace(offer);
    console.log(`Updated offer to ${newRups} RU/s\n`);
    break;
  }
};

/**
 * Create family item if it does not exist
 */
export const createItem = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient,
  itemBody: IItem
): Promise<ItemResponse<ItemDefinition>> => {
  console.log(`Creating Item:\n${itemBody.id}`);

  return await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);
};

/**
 * Query the container using SQL
 */
export const getById = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient,
  itemId: string
): Promise<FeedResponse<IItem[]>> => {
  console.log(`Querying item by Id: ${itemId}`);

  // query to return all children in a family
  // Including the partition key value of lastName in the WHERE filter results in a more efficient query
  const querySpec = {
    query: "SELECT * FROM " + containerId + " r WHERE r.id = @id and r.name",
    parameters: [
      {
        name: "@id",
        value: itemId,
      },
    ],
  };

  const allData = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();

  return allData;
};

export const getAll = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient
): Promise<FeedResponse<ItemDefinition>> => {
  console.log(`Querying all items: ${containerId}`);

  return await client
    .database(databaseId)
    .container(containerId)
    .items.readAll()
    .fetchAll();
};

/**
 * Replace the item by ID.
 */
export const updateItem = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient,
  itemBody: IItem,
  reqId: string
): Promise<ItemResponse<IItem>> => {
  console.log(`Updating item: ${itemBody.id}`);

  return await client
    .database(databaseId)
    .container(containerId)
    .item(reqId, reqId)
    .replace(itemBody);
};

/**
 * Delete the item by ID.
 */
export const deleteItem = async (
  databaseId: string,
  containerId: string,
  client: CosmosClient,
  reqId: string
): Promise<ItemResponse<IItem>> => {
  console.log(`Deleting item: ${reqId}`);

  return await client
    .database(databaseId)
    .container(containerId)
    .item(reqId, reqId)
    .delete();
};

/**
 * Cleanup the database and collection on completion
 */
export const cleanup = async (databaseId: string, client: CosmosClient) => {
  await client.database(databaseId).delete();
};

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
export const exit = (message: string) => {
  console.log(message);
  console.log("Press any key to exit");

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
};
