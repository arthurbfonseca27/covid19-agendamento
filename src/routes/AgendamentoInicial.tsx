import React from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import { AgendamentoInicialSchema } from "../validation/AgendamentoInicial";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";
import styled from "styled-components";

interface FormValues {
  nome: string;
  sobrenome: string;
  dataNascimento: Date | null;
}

const AgendamentoInicial = () => {
  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  const ErrorStyled = styled.span`
    color: red;
    font-size: 14px;
  `;

  return (
    <div className="bg-[#F9F9FC] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-[#FFFFFF] py-8 rounded-3xl border border-[#DDE2E5]">
        <p className="flex pl-10 justify-start items-start text-2xl w-full pb-10 pt-1">
          Agende seu horário
        </p>
        <div className="flex flex-row gap-1 text-sm pb-4 justify-end items-end w-full px-10">
          <p className="text-[#5570F1]">Passo 1</p>
          <p className="text-[#83898C]">de 2</p>
        </div>
        <div className="flex flex-row w-full pb-10">
          <div className="px-5"></div>
          <Progress
            value={50}
            colorScheme="primary"
            className="w-full rounded-3xl"
          />
          <div className="px-5"></div>
        </div>

        <Formik
          initialValues={{
            nome: "",
            sobrenome: "",
            dataNascimento: null,
          }}
          validationSchema={AgendamentoInicialSchema}
          onSubmit={handleSubmit}
        >
          <Form className="w-full px-10">
            <div className="flex flex-col gap-6 ">
              <div className="flex flex-col w-full">
                <label htmlFor="nome" className="text-sm text-[#5E6366]">
                  Nome
                </label>
                <Field
                  name="nome"
                  id="nome"
                  placeholder="Fulano"
                  className="rounded-lg px-4 py-3 bg-[#EFF1F9] w-full focus:outline-none focus:none focus:none focus:border-transparent"
                  required
                />
                <ErrorMessage name="nome" component={ErrorStyled} />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="sobrenome"
                  className="text-sm text-[#5E6366] focus:outline-none focus:none focus:none focus:border-transparent"
                >
                  Sobrenome
                </label>
                <Field
                  name="sobrenome"
                  id="sobrenome"
                  placeholder="Da Silva"
                  className="rounded-lg py-3 px-4 bg-[#EFF1F9] focus:outline-none focus:none focus:none focus:border-transparent"
                  required
                />
                <ErrorMessage name="sobrenome" component={ErrorStyled} />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="dataNascimento"
                  className="text-sm text-[#5E6366]"
                >
                  Data de nascimento
                </label>
                <Field name="dataNascimento" required>
                  {({ field, form }: { field: any; form: any }) => (
                    <DatePicker
                      {...field}
                      id="dataNascimento"
                      selected={field.value}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/aaaa"
                      onChange={(date: Date) =>
                        form.setFieldValue("dataNascimento", date)
                      }
                      className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                    />
                  )}
                </Field>
                <ErrorMessage name="dataNascimento" component={ErrorStyled} />
              </div>
              <div className="flex flex-row gap-10 pt-10 justify-center">
                <Button
                  variant="outline"
                  border="2px"
                  size="lg"
                  colorScheme="primary"
                >
                  Cancelar
                </Button>
                <Button size="lg" colorScheme="primary">
                  Continuar
                </Button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AgendamentoInicial;
