import Appointment from "../pages/Appoitment/Appointment";
import Query from "../pages/Query/Query";
import ErrorPage from "../pages/Error404/Error404";
import Home from "../pages/Homepage/Home";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
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

export { router };
