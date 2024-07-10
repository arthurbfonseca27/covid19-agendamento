import { Request, Response } from "express";
import { ListAvailableTimesService } from "../../services/horariosDisponiveis/ListAvailableTimesService";

class ListAvailableTimesController {
  async handle(req: Request, res: Response) {
    const { dataAgendamento } = req.query;

    try {
      if (!dataAgendamento) {
        throw new Error("Parâmetro dataAgendamento não fornecido");
      }

      const service = new ListAvailableTimesService();
      const horariosDisponiveis = await service.execute(
        new Date(dataAgendamento as string)
      );

      res.status(200).json(horariosDisponiveis);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
    }
  }
}

export { ListAvailableTimesController };
