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
exports.salesFunctions = void 0;
const functions_1 = require("@azure/functions");
const salesFunctions = (req, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log("HTTP trigger function processed a request.");
    const name = req.query || (req.body && req.params.name);
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    return {
        status: 200,
        jsonBody: responseMessage,
    };
});
exports.salesFunctions = salesFunctions;
functions_1.app.http("Sales", {
    methods: ["GET", "PUT", "DELETE", "POST"],
    handler: exports.salesFunctions,
    route: "Sales/{id?}",
});
