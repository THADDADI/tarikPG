import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Items from "./pages/Items/Items";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CreateItemsPage from "./pages/Items/CreateItem.js";
import EditItemsPage from "./pages/Items/EditItem.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/items",
    element: <Items />,
  },
  {
    path: "/items/create",
    element: <CreateItemsPage />,
  },
  {
    path: "/items/edit/:id",
    element: <EditItemsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
