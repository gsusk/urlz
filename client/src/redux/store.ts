import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./user/user";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["user"],
};

const restConfig = {
  key: "user",
  storage,
  blacklist: ["error", "loading"],
};

const rootReducer = combineReducers({
  user: persistReducer(restConfig, authReducer),
});
const frd = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: frd,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export default store;
