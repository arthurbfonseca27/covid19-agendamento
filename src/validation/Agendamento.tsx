import * as Yup from "yup";
import { subDays } from "date-fns";

function getYesterday() {
  return subDays(new Date(), 1); 
}

export const AgendamentoSchema = Yup.object().shape({
  dataAgendamento: Yup.date().min(getYesterday(), "Insira uma data de agendamento válida.").required("Campo obrigatório."),
  nome: Yup.string().required("Campo obrigatório."),
  sobrenome: Yup.string().required("Campo obrigatório."),
  dataNascimento: Yup.date().max(new Date(), "Insira uma data de nascimento válida.").required("Campo obrigatório."),
});


