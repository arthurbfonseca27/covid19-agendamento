import React from "react";
import "./App.css";
import { ModalProvider } from "./context/ModalContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { router } from "../src/routes/routes";

const theme = extendTheme({
  colors: {
    primary: {
      500: "#5570F1",
      600: "#405EEF",
    },
    success: {
      500: "#1BA97F",
      600: "#189973",
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </ChakraProvider>
  );
}

export default App;
