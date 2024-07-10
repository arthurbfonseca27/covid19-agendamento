import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AgendamentoSchema } from "../validation/Agendamento";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@chakra-ui/react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import useModal from "../hooks/useModal";
import { MdError } from "react-icons/md";
import axios from "axios";
import api from "../services/api";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import * as Yup from "yup";
import {
  setNome,
  setSobrenome,
  setDataNascimento,
  setDataAgendamento,
  setHorario,
} from "../redux/pessoaSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
} from "@chakra-ui/react";

interface FormValues {
  nome: string;
  sobrenome: string;
  dataNascimento: Date | null;
  dataAgendamento: Date | null;
  horario: string;
}

const Agendamento = () => {
  const [dataValida, setDataValida] = useState<Date | string>("");
  const [statusAgendamento, setStatusAgendamento] = useState<Boolean>(true);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const data = localStorage.getItem("formValues");
    if (data) {
      const storedValues = JSON.parse(data) as FormValues;
      storedValues.dataNascimento = storedValues.dataNascimento
        ? new Date(storedValues.dataNascimento)
        : null;
      storedValues.dataAgendamento = storedValues.dataAgendamento
        ? new Date(storedValues.dataAgendamento)
        : null;
      return storedValues;
    } else {
      return {
        nome: "",
        sobrenome: "",
        dataNascimento: null,
        dataAgendamento: null,
        horario: "",
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [formValues]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    try {
      // Despachando as ações para atualizar o estado no Redux
      dispatch(setNome(values.nome));
      dispatch(setSobrenome(values.sobrenome));
      if (values.dataNascimento) {
        dispatch(setDataNascimento(values.dataNascimento.toLocaleDateString()));
      }
      if (values.dataAgendamento) {
        dispatch(
          setDataAgendamento(values.dataAgendamento.toLocaleDateString())
        );
      }
      dispatch(setHorario(values.horario));

      const hoje = new Date(); // Obtém a data atual

      // Verifica se a data de agendamento é anterior à data atual
      if (values.dataAgendamento != null && values.dataAgendamento < hoje) {
        setStatusAgendamento(false); // Define status como false se for anterior
      } else {
        setStatusAgendamento(true); // Caso contrário, mantém como true
      }

      // Enviando os dados para a API
      const response = await api.post("/agendamentos", {
        nome: values.nome,
        sobrenome: values.sobrenome,
        dataNascimento: values.dataNascimento,
        dataAgendamento: values.dataAgendamento,
        horarioAgendamento: values.horario,
        status: statusAgendamento,
      });

      // Verificando se a resposta foi bem sucedida
      if (response.status === 200) {
        handlerShowCorrectModal();
        navigate("/");
      } else {
        handlerShowErrorModal(
          `Erro ao cadastrar o agendamento: ${response.data}`
        );
        console.error();
      }
    } catch (error) {
      handlerShowErrorModal(`Erro ao cadastrar o agendamento: ${error}`);
    }
  };

  const ErrorStyled = styled.span`
    color: red;
    font-size: 14px;
  `;

  const { showModal } = useModal();

  const handlerShowCorrectModal = () => {
    showModal({
      title: "Agendamento realizado com sucesso!",
      description:
        "Você foi direcionado para a página inicial da plataforma e poderá consultar os agendamentos realizados.",
      confirmText: "Entendido!",
      icon: <FaCheckCircle size={48} color="#10FE0C" />,
    });
  };

  const handlerShowErrorModal = (error: string) => {
    setFormValues({
      nome: "",
      sobrenome: "",
      dataNascimento: null,
      dataAgendamento: null,
      horario: "",
    });

    showModal({
      title: "Ooops! Agendamento inválido!",
      description: error,
      confirmText: "Tente novamente",
      icon: <MdError size={48} color="#FF1010" />,
    });
  };

  const handleDataChange = async (date: Date) => {
    try {
      await Yup.object({
        dataAgendamento: AgendamentoSchema.fields.dataAgendamento,
      }).validate({ dataAgendamento: date });
      setDataValida(date);
      console.log("Data válida:", date);
    } catch (err) {
      setDataValida("");
      console.log(err);
      console.log(date);
      console.log({ dataAgendamento: date });
      console.log("Data inválida");
    }
  };

  useEffect(() => {
    // Buscar horários disponíveis quando a data de agendamento mudar
    if (formValues.dataAgendamento) {
      fetchHorariosDisponiveis();
    }
  }, [formValues.dataAgendamento]);

  const fetchHorariosDisponiveis = async () => {
    try {
      const response = await api.get("/horarios-disponiveis", {
        params: {
          dataAgendamento: formValues.dataAgendamento?.toISOString(),
        },
      });
      setHorariosDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTime, setSelectedTime] = useState<string>("");

  return (
    <div className="bg-[#F9F9FC] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-[#FFFFFF] py-8 rounded-3xl border border-[#DDE2E5]">
        <p className="flex pl-10 justify-start items-start text-2xl w-full pb-1 pt-1 font-redHatDisplay">
          Informações do paciente
        </p>
        <div className="flex flex-row gap-1 text-sm pb-9 justify-end items-end w-full px-10"></div>
        <Formik
          initialValues={formValues}
          validationSchema={AgendamentoSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue }) => (
            <Form className="w-full px-10">
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col w-full">
                  <label htmlFor="nome" className="text-sm text-[#5E6366]">
                    Nome
                  </label>
                  <Field
                    name="nome"
                    id="nome"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        nome: e.target.value,
                      }));
                    }}
                    placeholder="Nome"
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        sobrenome: e.target.value,
                      }));
                    }}
                    placeholder="Sobrenome"
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
                        showYearDropdown
                        closeOnScroll={true}
                        peekNextMonth
                        showMonthDropdown
                        dropdownMode="select"
                        scrollableYearDropdown
                        onChange={(date: Date) => {
                          form.setFieldValue("dataNascimento", date);
                          setFormValues((prevValues) => ({
                            ...prevValues,
                            dataNascimento: date,
                          }));
                        }}
                        className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="dataNascimento" component={ErrorStyled} />
                </div>
                <div className="flex flex-col gap-6 ">
                  <div className="flex flex-row gap-8">
                    <div className="flex flex-col w-1/2">
                      <label
                        htmlFor="dataAgendamento"
                        className="text-sm text-[#5E6366]"
                      >
                        Data de Agendamento
                      </label>
                      <Field name="dataAgendamento" required>
                        {({ field, form }: { field: any; form: any }) => (
                          <DatePicker
                            {...field}
                            id="dataAgendamento"
                            selected={field.value}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/aaaa"
                            showYearDropdown
                            closeOnScroll={true}
                            peekNextMonth
                            showMonthDropdown
                            dropdownMode="select"
                            scrollableYearDropdown
                            onChange={(date: Date) => {
                              form.setFieldValue("dataAgendamento", date);
                              handleDataChange(date);
                              setFormValues((prevValues) => ({
                                ...prevValues,
                                dataAgendamento: date,
                              }));
                              onOpen();
                            }}
                            className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="dataAgendamento"
                        component={ErrorStyled}
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label
                        htmlFor="horario"
                        className="text-sm text-[#5E6366]"
                      >
                        Horário de Agendamento
                      </label>
                      <Field name="horario" required>
                        {({ field, form }: { field: any; form: any }) => (
                          <div className="rounded-lg py-1 bg-[#EFF1F9] focus:outline-none">
                            <Button
                              onClick={
                                formValues.dataAgendamento ? onOpen : () => {}
                              }
                              width="full"
                              color={formValues.horario ? "#000000" : "#ABAFB1"}
                              fontWeight="normal"
                              _hover={{ bg: "#EFF1F9" }}
                            >
                              {formValues.horario
                                ? formValues.horario
                                : "00:00"}
                            </Button>
                          </div>
                        )}
                      </Field>
                      <ErrorMessage name="horario" component={ErrorStyled} />
                    </div>
                  </div>

                  {dataValida &&
                    formValues.dataAgendamento &&
                    formValues.horario && (
                      <div className="gap-1 w-full">
                        <span className="pr-1">
                          Data e horário do agendamento:
                        </span>
                        <span className="font-bold text-[#5570F1]">
                          {formValues.dataAgendamento.toLocaleDateString()}{" "}
                        </span>
                        <span className="pr-1">às</span>
                        <span className="font-bold text-[#5570F1]">
                          {formValues.horario}
                        </span>
                      </div>
                    )}
                </div>
                <div>
                  <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>Escolha o horário</DrawerHeader>

                      <DrawerBody>
                        <Stack spacing="24px">
                          {horariosDisponiveis.map((time, index) => (
                            <Button
                              key={index}
                              width="full"
                              colorScheme={
                                time === selectedTime ? "primary" : "gray"
                              }
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </Stack>
                      </DrawerBody>

                      <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                          Cancelar
                        </Button>
                        <Button
                          colorScheme="primary"
                          onClick={() => {
                            setFieldValue("horario", selectedTime);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              horario: selectedTime,
                            }));
                            onClose();
                          }}
                        >
                          Salvar horário
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
                <div className="flex flex-row gap-10 pt-2 justify-center">
                  <Button
                    variant="outline"
                    border="2px"
                    size="lg"
                    fontWeight="normal"
                    colorScheme="primary"
                    width="180px"
                    borderRadius="12px"
                  >
                    <nav>
                      <Link to="/">Cancelar</Link>
                    </nav>
                  </Button>
                  <Button
                    size="lg"
                    colorScheme="primary"
                    type="submit"
                    fontWeight="normal"
                    width="180px"
                    borderRadius="12px"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Agendamento;
