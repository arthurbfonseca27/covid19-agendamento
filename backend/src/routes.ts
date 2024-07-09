import { Router } from "express";

import { ListAppointmentController } from "./controllers/agendamento/ListAppointmentController";
import { CreateAppointmentController } from "./controllers/agendamento/CreateAppointmentController";

const router = Router();

router.post("/agendamentos", new CreateAppointmentController().handle);
router.get("/agendamentos", new ListAppointmentController().handle);

export { router };
