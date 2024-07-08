import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PessoaState {
  nome: string;
  sobrenome: string;
  dataNascimento: string | null; // Alterado para string conforme sua necessidade
  dataAgendamento: string | null;
  horario: string;
}

const initialState: PessoaState = {
  nome: "",
  sobrenome: "",
  dataNascimento: null,
  dataAgendamento: null,
  horario: "",
};

export const slice = createSlice({
  name: "pessoa",
  initialState,
  reducers: {
    setNome(state, action: PayloadAction<string>) {
      state.nome = action.payload;
    },
    setSobrenome(state, action: PayloadAction<string>) {
      state.sobrenome = action.payload;
    },
    setDataNascimento(state, action: PayloadAction<string | null>) {
      state.dataNascimento = action.payload;
    },
    setDataAgendamento(state, action: PayloadAction<string | null>) {
      state.dataAgendamento = action.payload;
    },
    setHorario(state, action: PayloadAction<string>) {
      state.horario = action.payload;
    },
  },
});

export const { setNome, setSobrenome, setDataNascimento, setDataAgendamento, setHorario } = slice.actions;

export default slice.reducer;
