import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Feat/UserSlice";
import Api from "./service/Api";

import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

// reducer
const reducer = combineReducers({
    user: userSlice,
    [Api.reducerPath] : Api.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [Api.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, Api.middleware],
});

export default store;