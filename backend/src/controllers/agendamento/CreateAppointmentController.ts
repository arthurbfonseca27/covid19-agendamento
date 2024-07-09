import { Request, Response } from "express";
import { CreateAppointmentService } from "../../services/agendamento/CreateAppointmentService";

class CreateAppointmentController {
  async handle(req: Request, res: Response) {
    const { nome, sobrenome, dataNascimento, dataAgendamento, horarioAgendamento, status } = req.body;

    const createAppointmentService = new CreateAppointmentService();

    const usuario = await createAppointmentService.execute({
      nome,
      sobrenome,
      dataNascimento,
      dataAgendamento,
      horarioAgendamento,
      status
    });

    return res.json(usuario);
  }
}

export { CreateAppointmentController };
