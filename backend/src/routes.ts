import { Router } from "express";

import { CreateAppointmentController } from "./controllers/agendamento/CreateAppointmentController"

const router = Router();

router.post("/agendamentos", new CreateAppointmentController().handle)

export { router }
