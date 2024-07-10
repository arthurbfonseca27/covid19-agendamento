import prismaClient from "../../prisma";

class ListAvailableTimesService {
  async execute(dataAgendamento: Date) {
    try {
      const startHour = 8;
      const endHour = 17;
      const maxAppointmentsPerTimeSlot = 2;
      const availableTimes: string[] = [];

      // Gerar todos os horários das 8h às 18h
      for (let hour = startHour; hour <= endHour; hour++) {
        const horario = `${String(hour).padStart(2, "0")}:00`;

        // Verificar se há menos de dois agendamentos para este horário nesta data
        const agendamentosParaHorario = await prismaClient.agendamento.count({
          where: {
            dataAgendamento,
            horarioAgendamento: horario,
          },
        });

        if (agendamentosParaHorario < maxAppointmentsPerTimeSlot) {
          availableTimes.push(horario);
        }
      }

      return availableTimes;
    } catch (error) {
      throw new Error("Erro ao buscar horários disponíveis");
    }
  }
}

export { ListAvailableTimesService };
