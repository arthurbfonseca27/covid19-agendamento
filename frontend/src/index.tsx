import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import "./index.css";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import Agendamento from "./routes/Agendamento";
import Consulta from "./routes/Consulta";
import ErrorPage from "./routes/Error404";
import Home from "./routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Agendamento",
    element: <Agendamento />,
  },
  {
    path: "/Consulta",
    element: <Consulta />,
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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
