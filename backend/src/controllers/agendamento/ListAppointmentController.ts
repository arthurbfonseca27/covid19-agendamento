import e, { Request, Response } from "express";
import { ListAppointmentService } from "../../services/agendamento/ListAppointmentService";

class ListAppointmentController {
  async handle(req: Request, res: Response) {
    const listAppointmentService = new ListAppointmentService();

    const agendamento = await listAppointmentService.execute();

    return res.json(agendamento);
  }
}

export { ListAppointmentController };
