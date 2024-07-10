import prismaClient from "../../prisma";

interface UpdateAppointmentRequest {
  id: string;
  nome?: string;
  sobrenome?: string;
  dataNascimento?: Date;
  dataAgendamento?: Date;
  horarioAgendamento?: string; // formato "HH:mm"
  status?: boolean;
}

class UpdateAppointmentService {
  async execute({
    id,
    nome,
    sobrenome,
    dataNascimento,
    dataAgendamento,
    horarioAgendamento,
    status,
  }: UpdateAppointmentRequest) {
    const appointment = await prismaClient.agendamento.update({
      where: { id },
      data: {
        nome,
        sobrenome,
        dataNascimento,
        dataAgendamento,
        horarioAgendamento,
        status,
      },
    });

    return appointment;
  }
}

export { UpdateAppointmentService };
