// src/app/store/index.js

import { configureStore } from "@reduxjs/toolkit";
import { offline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import localforage from "localforage";
import logger from "redux-logger";
import itemsSlice from "./features/itemSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

offlineConfig.persistOptions = { storage: localforage }; // Configure IndexedDB storage
const store = configureStore({
  reducer: { items: itemsSlice },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      offline({
        ...offlineConfig,
        effect: (effect) => axios(effect),
        discard: (error) => {
          const { request, response } = error;
          if (!request) throw error; // There was an error creating the request
          if (!response) return false; // There was no response
          return response.status >= 400 && response.status < 500;
        },
      })
    ),
});
export default store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
