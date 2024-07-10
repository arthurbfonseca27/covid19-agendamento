import { Router } from "express";

import { ListAppointmentController } from "./controllers/agendamento/ListAppointmentController";
import { CreateAppointmentController } from "./controllers/agendamento/CreateAppointmentController";
import { ListAvailableTimesController } from "./controllers/horariosDisponiveis/ListAvailableTimesController";
import { UpdateAppointmentController } from "./controllers/agendamento/UpdateAppointmentController";
import { DeleteAppointmentController } from "./controllers/agendamento/DeleteAppointmentController";

const router = Router();

router.post("/agendamentos", new CreateAppointmentController().handle);
router.get("/agendamentos", new ListAppointmentController().handle);
router.get("/horarios-disponiveis", new ListAvailableTimesController().handle);
router.put("/agendamentos/:id", new UpdateAppointmentController().handle);
router.delete("/agendamentos/:id", new DeleteAppointmentController().handle);

export { router };
