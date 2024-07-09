import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import { AgendamentoFinalSchema } from "../validation/AgendamentoFinal";
import { Progress, Stack } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setDataAgendamento, setHorario } from "../redux/pessoaSlice";
import "react-datepicker/dist/react-datepicker.css";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ptBR from "date-fns/locale/pt-BR";
import { IoArrowBackOutline } from "react-icons/io5";
import { Box } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
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
import useModal from "../hooks/useModal";
import { MdError } from "react-icons/md";

interface FormValues {
  dataAgendamento: Date | null;
  horario: string;
}

const AgendamentoFinal = () => {
  const [dataValida, setDataValida] = useState<Date | string>("");
  const pessoa = useSelector((state: RootState) => state.pessoa);
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const data = localStorage.getItem("formValues");
    if (data) {
      const storedValues = JSON.parse(data) as FormValues;
      storedValues.dataAgendamento = storedValues.dataAgendamento
        ? new Date(storedValues.dataAgendamento)
        : null;
      return storedValues;
    } else {
      return { dataAgendamento: null, horario: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [formValues]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values: FormValues) => {
    if (pessoa.nome && pessoa.sobrenome && pessoa.dataNascimento) {
      setActiveStep(2);

      dispatch(setHorario(values.horario));

      if (values.dataAgendamento) {
        dispatch(
          setDataAgendamento(values.dataAgendamento.toLocaleDateString())
        );
      }

      handlerShowCorrectModal();
      navigate("/");
    } else {
      handlerShowErrorModal();
      navigate("/AgendamentoInicial");
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const ErrorStyled = styled.span`
    color: red;
    font-size: 14px;
  `;

  const { showModal } = useModal();

  const handlerShowCorrectModal = () => {
    showModal({
      title: "Agendamento realizado com sucesso!",
      description:
        "Você foi direcionado para a página inicial da plataforma e poderá consultar seu agendamento.",
      confirmText: "Entendido!",
      icon: <FaCheckCircle size={48} color="#10FE0C" />,
    });
  };

  const handlerShowErrorModal = () => {
    showModal({
      title: "Ooops! Agendamento inválido!",
      description:
        "Verifique se todos os dados foram preenchidos corretamente.",
      confirmText: "Tente novamente",
      icon: <MdError size={48} color="#FF1010" />,
    });
  };

  const [selectedTime, setSelectedTime] = useState<string>("");
  const times = Array.from(
    { length: 11 },
    (_, i) => `${String(i + 8).padStart(2, "0")}:00`
  );

  const steps = [
    { title: "Primeiro passo", description: "Informações pessoais" },
    { title: "Segundo passo", description: "Data & Horário" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const handleDataChange = async (date: Date) => {
    try {
      await AgendamentoFinalSchema.validate({ dataAgendamento: date });
      setDataValida(date);
    } catch (err) {
      setDataValida("");
    }
  };

  return (
    <div className="bg-[#F9F9FC] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-[#FFFFFF] py-8 rounded-3xl border border-[#DDE2E5]">
        <div className="flex flex-col pl-10 gap-8 justify-start items-start text-2xl w-full pb-4 pt-1">
          <p className="text-2xl w-full pb-11">Agende seu horário</p>
        </div>
        <div className="flex flex-row gap-1 text-sm justify-end items-end w-full px-10"></div>
        <div className="flex flex-row w-full pb-10">
          <div className="px-5 "></div>
          <Stepper index={activeStep} colorScheme="primary" className="w-full">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <div className="px-5"></div>
        </div>
        <Formik
          initialValues={formValues}
          validationSchema={AgendamentoFinalSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue }) => (
            <Form className="w-full px-10">
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
                          locale="ptBR"
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
                      htmlFor="dataAgendamento"
                      className="text-sm text-[#5E6366]"
                    >
                      Horário de Agendamento
                    </label>
                    <div className="rounded-lg py-1 bg-[#EFF1F9] focus:outline-none">
                      <Button
                        onClick={formValues.dataAgendamento ? onOpen : () => {}}
                        width="full"
                        color={formValues.horario ? "#000000" : "#ABAFB1"}
                        fontWeight="normal"
                        _hover={{ bg: "#EFF1F9" }}
                      >
                        {formValues.horario ? formValues.horario : "00:00"}
                      </Button>
                    </div>
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
                        {times.map((time, index) => (
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
              <div className="flex flex-row gap-10 pt-10 justify-center">
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
                  Agendar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AgendamentoFinal;
