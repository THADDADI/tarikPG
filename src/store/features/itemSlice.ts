import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IItem } from "../../../api/models/Item";
// import { openDB } from "idb";
import { RootState } from "../index";

type InitState = {
  items: IItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
};

const initialState: InitState = {
  items: [],
  status: "idle",
  error: null,
};

// Open IndexedDB
// const dbPromise = openDB("items-db", 1, {
//   upgrade(db) {
//     db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
//   },
// });

const fetchItemByID = createAsyncThunk<IItem[], string>(
  "items/fetchItemById",
  async (id) => {
    const response = await axios.get(`/api/Items/${id}`);
    return response.data;
  }
);

const fetchItems = createAsyncThunk<IItem[]>("items/fetchItems", async () => {
  const response = await axios.get("/api/Items");
  return response.data;
});

const addItem = createAsyncThunk<IItem, string>(
  "items/addItem",
  async (item) => {
    const response = await axios.post("/api/Items", item);
    return response.data;
  }
);

const deleteItem = createAsyncThunk<IItem, string>(
  "items/deleteItem",
  async (id) => {
    const response = await axios.delete(`/api/Items/${id}`);
    return response.data;
  }
);

const updateItem = createAsyncThunk<IItem, { id: string; item: IItem }>(
  "items/updateItem",
  async (params: { id: string; item: IItem }) => {
    const response = await axios.put(`/api/Items/${params.id}`, params.item);
    return response.data;
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = "idle";
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Data
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Get All Databy ID
    builder
      .addCase(fetchItemByID.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItemByID.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItemByID.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Delete Data
    builder
      .addCase(deleteItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Update Data
    builder
      .addCase(updateItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => {
          if (item.id === action.payload.id) {
            item = action.payload;
          }

          return item;
        });
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Add Data
    builder
      .addCase(addItem.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.concat(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { reset } = itemsSlice.actions;
export const selectItems = (state: RootState) => state.items.items;
export default itemsSlice.reducer;
export { fetchItems, addItem, fetchItemByID, deleteItem, updateItem };
