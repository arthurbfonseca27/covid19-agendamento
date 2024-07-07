import * as Yup from "yup";

export const AgendamentoInicialSchema = Yup.object().shape({
  nome: Yup.string().required("Campo obrigatório."),
  sobrenome: Yup.string().required("Campo obrigatório."),
  dataNascimento: Yup.date().max(new Date(), "Insira uma data de nascimento válida.").required("Campo obrigatório."),
});
