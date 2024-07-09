import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaSlice";

const store = configureStore({
  reducer: {
    pessoa: pessoaReducer,
    // outros reducers, se houver
  },
});

export type RootState = ReturnType<typeof store.getState>; // Exporte o tipo RootState

export default store;
