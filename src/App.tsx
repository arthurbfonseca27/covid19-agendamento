import React from "react";
import "./App.css";
import Appointment from "./routes/Appoitment/Appointment";
import Query from "./routes/Query/Query";
import ErrorPage from "./routes/Error404/Error404";
import Home from "./routes/Home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Agendamento",
    element: <Appointment />,
  },
  {
    path: "/Consulta",
    element: <Query />,
  },
]);

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
