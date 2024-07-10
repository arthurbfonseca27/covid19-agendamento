import prismaClient from "../../prisma";

interface DeleteAppointmentRequest {
  id: string;
}

class DeleteAppointmentService {
  async execute({ id }: DeleteAppointmentRequest) {
    // Verificar se o agendamento existe
    const appointment = await prismaClient.agendamento.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }

    // Deletar o agendamento
    await prismaClient.agendamento.delete({
      where: { id },
    });

    return { message: "Agendamento deletado com sucesso" };
  }
}

export { DeleteAppointmentService };
