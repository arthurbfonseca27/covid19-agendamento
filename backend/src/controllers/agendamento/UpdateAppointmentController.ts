import { Request, Response } from "express";
import { UpdateAppointmentService } from "../../services/agendamento/UpdateAppointmentService";

class UpdateAppointmentController {
  async handle(req: Request, res: Response) {
    try {
      const {
        id,
        nome,
        sobrenome,
        dataNascimento,
        dataAgendamento,
        horarioAgendamento,
        status,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID do agendamento não fornecido." });
      }

      const updateAppointmentService = new UpdateAppointmentService();

      const updatedAppointment = await updateAppointmentService.execute({
        id,
        nome,
        sobrenome,
        dataNascimento,
        dataAgendamento,
        horarioAgendamento,
        status,
      });

      return res.json(updatedAppointment);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar agendamento." });
    }
  }
}

export { UpdateAppointmentController };
