import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Items from "./pages/Items/Items";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CreateItemsPage from "./pages/Items/CreateItem.js";
import EditItemsPage from "./pages/Items/EditItem.js";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { registerSW } from "virtual:pwa-register";

// add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});

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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
