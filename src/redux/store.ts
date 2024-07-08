import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaSlice";

export default configureStore({
  reducer: {
    pessoa: pessoaReducer,
  },
});
