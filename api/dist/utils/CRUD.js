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
exports.exit = exports.cleanup = exports.deleteItem = exports.updateItem = exports.getAll = exports.getById = exports.createItem = exports.scaleContainer = exports.readContainer = exports.createContainer = exports.readDatabase = exports.createDatabase = void 0;
// Create DB if not existing
const createDatabase = (databaseId, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Creating database if not existing`);
    return yield client.databases.createIfNotExists({
        id: databaseId,
    });
});
exports.createDatabase = createDatabase;
/**
 * Read the database definition
 */
const readDatabase = (databaseId, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Reading database`);
    return yield client.database(databaseId).read();
});
exports.readDatabase = readDatabase;
/**
 * Create the container if it does not exist
 */
const createContainer = (databaseId, containerId, partitionKey, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Creating container if not existing`);
    return yield client
        .database(databaseId)
        .containers.createIfNotExists({ id: containerId, partitionKey: partitionKey }, { offerThroughput: 400 });
});
exports.createContainer = createContainer;
/**
 * Read the container definition
 */
const readContainer = (databaseId, containerId, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Reading container`);
    return yield client.database(databaseId).container(containerId).read();
});
exports.readContainer = readContainer;
/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
const scaleContainer = (databaseId, containerId, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Scaling container`);
    const { resource: containerDefinition } = yield client
        .database(databaseId)
        .container(containerId)
        .read();
    const { resources: offers } = yield client.offers.readAll().fetchAll();
    const newRups = 500;
    for (const offer of offers) {
        if ((containerDefinition === null || containerDefinition === void 0 ? void 0 : containerDefinition._rid) !== offer.offerResourceId) {
            continue;
        }
        if (offer.content)
            offer.content.offerThroughput = newRups;
        const offerToReplace = client.offer(offer.id);
        yield offerToReplace.replace(offer);
        console.log(`Updated offer to ${newRups} RU/s\n`);
        break;
    }
});
exports.scaleContainer = scaleContainer;
/**
 * Create family item if it does not exist
 */
const createItem = (databaseId, containerId, client, itemBody) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Creating Item:\n${itemBody.id}`);
    return yield client
        .database(databaseId)
        .container(containerId)
        .items.upsert(itemBody);
});
exports.createItem = createItem;
/**
 * Query the container using SQL
 */
const getById = (databaseId, containerId, client, itemId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const allData = yield client
        .database(databaseId)
        .container(containerId)
        .items.query(querySpec)
        .fetchAll();
    return allData;
});
exports.getById = getById;
const getAll = (databaseId, containerId, client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Querying all items: ${containerId}`);
    return yield client
        .database(databaseId)
        .container(containerId)
        .items.readAll()
        .fetchAll();
});
exports.getAll = getAll;
/**
 * Replace the item by ID.
 */
const updateItem = (databaseId, containerId, client, itemBody, reqId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Updating item: ${itemBody.id}`);
    return yield client
        .database(databaseId)
        .container(containerId)
        .item(reqId, reqId)
        .replace(itemBody);
});
exports.updateItem = updateItem;
/**
 * Delete the item by ID.
 */
const deleteItem = (databaseId, containerId, client, reqId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Deleting item: ${reqId}`);
    return yield client
        .database(databaseId)
        .container(containerId)
        .item(reqId, reqId)
        .delete();
});
exports.deleteItem = deleteItem;
/**
 * Cleanup the database and collection on completion
 */
const cleanup = (databaseId, client) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.database(databaseId).delete();
});
exports.cleanup = cleanup;
/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
const exit = (message) => {
    console.log(message);
    console.log("Press any key to exit");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", process.exit.bind(process, 0));
};
exports.exit = exit;
