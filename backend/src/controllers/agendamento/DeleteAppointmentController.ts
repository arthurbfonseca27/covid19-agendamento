import { Request, Response } from "express";
import { DeleteAppointmentService } from "../../services/agendamento/DeleteAppointmentService";

class DeleteAppointmentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteAppointmentService = new DeleteAppointmentService();

    try {
      const result = await deleteAppointmentService.execute({ id });
      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro desconhecido" });
    }
  }
}

export { DeleteAppointmentController };
