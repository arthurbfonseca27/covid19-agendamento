import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import Home from "./routes/Home";
import AgendamentoInicial from "./routes/AgendamentoInicial";
import AgendamentoFinal from "./routes/AgendamentoFinal";
import ErrorPage from "./routes/Error404";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ModalProvider } from "./context/ModalContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/AgendamentoInicial",
    element: <AgendamentoInicial />,
  },
  {
    path: "/AgendamentoFinal",
    element: <AgendamentoFinal />,
  },
]);

const theme = extendTheme({
  colors: {
    primary: {
      500: "#5570F1",
      600: "#405EEF",
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
