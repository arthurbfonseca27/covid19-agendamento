import * as Yup from "yup";
import { subDays } from "date-fns"; // Importa a função subDays do date-fns

// Função para obter a data de ontem
function getYesterday() {
  return subDays(new Date(), 1); // Subtrai 1 dia da data atual
}

export const AgendamentoFinalSchema = Yup.object().shape({
  dataAgendamento: Yup.date()
    .min(getYesterday(), "Insira uma data de agendamento válida.")
    .required("Campo obrigatório."),
});
