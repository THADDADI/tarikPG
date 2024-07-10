import {
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { app } from "@azure/functions";

export const salesFunctions = async (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit | HttpResponse> => {
  context.log("HTTP trigger function processed a request.");
  const name = req.params.name || (req.body && req.params.name);
  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  return {
    status: 200,
    jsonBody: responseMessage,
  };
};

app.http("Sales", {
  methods: ["GET", "PUT", "DELETE", "POST"],
  handler: salesFunctions,
  route: "Sales/{id?}",
});
