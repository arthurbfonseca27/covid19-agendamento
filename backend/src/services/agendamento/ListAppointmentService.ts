import prismaClient from "../../prisma";

class ListAppointmentService {
  async execute() {
    const agendamento = await prismaClient.agendamento.findMany();

    return agendamento;
  }
}

export { ListAppointmentService };
