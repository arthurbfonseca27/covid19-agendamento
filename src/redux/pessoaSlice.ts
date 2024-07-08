import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PessoaState {
  nome: string;
  sobrenome: string;
  dataNascimento: string | null; // Alterado para string conforme sua necessidade
}

const initialState: PessoaState = {
  nome: "",
  sobrenome: "",
  dataNascimento: null,
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
  },
});

export const { setNome, setSobrenome, setDataNascimento } = slice.actions;

export default slice.reducer;
