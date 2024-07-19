import * as Yup from "yup";
import { subDays } from "date-fns";

function getYesterday() {
  return subDays(new Date(), 1); 
}

export const AppointmentSchema = Yup.object().shape({
  name: Yup.string().required("Campo obrigatório."),
  surname: Yup.string().required("Campo obrigatório."),
  dateOfBirth: Yup.date().max(new Date(), "Insira uma data de nascimento válida.").required("Campo obrigatório."),
  appointmentDate: Yup.date().min(getYesterday(), "Insira uma data de agendamento válida.").required("Campo obrigatório."),
  appointmentTime: Yup.string().required("Campo obrigatório."),
});


