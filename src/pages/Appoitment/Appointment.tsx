import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppointmentSchema } from "../../validation/AppointmentSchema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@chakra-ui/react";
import styled from "styled-components";
import useModal from "../../hooks/useModal";
import { MdError } from "react-icons/md";
import api from "../../services/api";
import { FaCheckCircle } from "react-icons/fa";
import * as Yup from "yup";
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
  name: string;
  surname: string;
  dateOfBirth: Date | null;
  appointmentDate: Date | null;
  appointmentTime: string;
}

const Appointment = () => {
  const [validDate, setValidDate] = useState<Date | string>("");
  const [appointmentStatus, setAppointmentStatus] = useState<Boolean>(true);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const data = localStorage.getItem("formValues");
    if (data) {
      const storedValues = JSON.parse(data) as FormValues;
      storedValues.dateOfBirth = storedValues.dateOfBirth
        ? new Date(storedValues.dateOfBirth)
        : null;
      storedValues.appointmentDate = storedValues.appointmentDate
        ? new Date(storedValues.appointmentDate)
        : null;
      return storedValues;
    } else {
      return {
        name: "",
        surname: "",
        dateOfBirth: null,
        appointmentDate: null,
        appointmentTime: "",
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [formValues]);

  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await api.post("/agendamentos", {
        name: values.name,
        surname: values.surname,
        dateOfBirth: values.dateOfBirth,
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        appointmentStatus: true,
      });

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
      name: "",
      surname: "",
      dateOfBirth: null,
      appointmentDate: null,
      appointmentTime: "",
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
        appointmentDate: AppointmentSchema.fields.appointmentDate,
      }).validate({ appointmentDate: date });
      setValidDate(date);
      console.log("Data válida:", date);
    } catch (err) {
      setValidDate("");
      console.log(err);
      console.log(date);
      console.log({ appointmentDate: date });
      console.log("Data inválida");
    }
  };

  useEffect(() => {
    // Buscar horários disponíveis quando a data de agendamento mudar
    if (formValues.appointmentDate) {
      fetchavailableTimes();
    }
  }, [formValues.appointmentDate]);

  const fetchavailableTimes = async () => {
    try {
      const response = await api.get("/horarios-disponiveis", {
        params: {
          appointmentDate: formValues.appointmentDate?.toISOString(),
        },
      });
      setAvailableTimes(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTime, setSelectedTime] = useState<string>("");

  return (
    <div className="bg-[#F9F9FC] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-[#FFFFFF] py-8 rounded-3xl border border-[#DDE2E5]">
        <p className="flex pl-10 justify-start items-start text-2xl w-full pb-1 pt-1">
          Informações do paciente
        </p>
        <div className="flex flex-row gap-1 text-sm pb-9 justify-end items-end w-full px-10"></div>
        <Formik
          initialValues={formValues}
          validationSchema={AppointmentSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue }) => (
            <Form className="w-full px-10">
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className="text-sm text-[#5E6366]">
                    Nome
                  </label>
                  <Field
                    name="name"
                    id="name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        name: e.target.value,
                      }));
                    }}
                    placeholder="Nome"
                    className="rounded-lg px-4 py-3 bg-[#EFF1F9] w-full focus:outline-none focus:none focus:none focus:border-transparent"
                    required
                  />
                  <ErrorMessage name="name" component={ErrorStyled} />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="surname"
                    className="text-sm text-[#5E6366] focus:outline-none focus:none focus:none focus:border-transparent"
                  >
                    Sobrenome
                  </label>
                  <Field
                    name="surname"
                    id="surname"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        surname: e.target.value,
                      }));
                    }}
                    placeholder="Sobrenome"
                    className="rounded-lg py-3 px-4 bg-[#EFF1F9] focus:outline-none focus:none focus:none focus:border-transparent"
                    required
                  />
                  <ErrorMessage name="surname" component={ErrorStyled} />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm text-[#5E6366]"
                  >
                    Data de nascimento
                  </label>
                  <Field name="dateOfBirth" required>
                    {({ field, form }: { field: any; form: any }) => (
                      <DatePicker
                        {...field}
                        id="dateOfBirth"
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
                          form.setFieldValue("dateOfBirth", date);
                          setFormValues((prevValues) => ({
                            ...prevValues,
                            dateOfBirth: date,
                          }));
                        }}
                        className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="dateOfBirth" component={ErrorStyled} />
                </div>
                <div className="flex flex-col gap-6 ">
                  <div className="flex flex-row gap-8">
                    <div className="flex flex-col w-1/2">
                      <label
                        htmlFor="appointmentDate"
                        className="text-sm text-[#5E6366]"
                      >
                        Data de Agendamento
                      </label>
                      <Field name="appointmentDate" required>
                        {({ field, form }: { field: any; form: any }) => (
                          <DatePicker
                            {...field}
                            id="appointmentDate"
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
                              form.setFieldValue("appointmentDate", date);
                              handleDataChange(date);
                              setFormValues((prevValues) => ({
                                ...prevValues,
                                appointmentDate: date,
                              }));
                              onOpen();
                            }}
                            className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="appointmentDate"
                        component={ErrorStyled}
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label
                        htmlFor="appointmentTime"
                        className="text-sm text-[#5E6366]"
                      >
                        Horário de Agendamento
                      </label>
                      <Field name="appointmentTime" required>
                        {({ field, form }: { field: any; form: any }) => (
                          <div className="rounded-lg py-1 bg-[#EFF1F9] focus:outline-none">
                            <Button
                              onClick={
                                formValues.appointmentDate ? onOpen : () => {}
                              }
                              width="full"
                              color={
                                formValues.appointmentTime
                                  ? "#000000"
                                  : "#ABAFB1"
                              }
                              fontWeight="normal"
                              _hover={{ bg: "#EFF1F9" }}
                            >
                              {formValues.appointmentTime
                                ? formValues.appointmentTime
                                : "00:00"}
                            </Button>
                          </div>
                        )}
                      </Field>
                      <ErrorMessage
                        name="appointmentTime"
                        component={ErrorStyled}
                      />
                    </div>
                  </div>

                  {validDate &&
                    formValues.appointmentDate &&
                    formValues.appointmentTime && (
                      <div className="gap-1 w-full">
                        <span className="pr-1">
                          Data e horário do agendamento:
                        </span>
                        <span className="font-bold text-[#5570F1]">
                          {formValues.appointmentDate.toLocaleDateString()}{" "}
                        </span>
                        <span className="pr-1">às</span>
                        <span className="font-bold text-[#5570F1]">
                          {formValues.appointmentTime}
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
                          {availableTimes.map((time, index) => (
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
                            setFieldValue("appointmentTime", selectedTime);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              appointmentTime: selectedTime,
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
                    Agendar
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

export default Appointment;
