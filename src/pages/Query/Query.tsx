import React, { useState, useEffect } from "react";
import Logo from "public/assets/Logo-branco.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Divider, Button } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { AppointmentSchema } from "../../validation/AppointmentSchema";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { Tag } from "@chakra-ui/react";
import api from "../../services/api";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { setOriginalNode } from "typescript";
import { CgArrowsExchangeAltV } from "react-icons/cg";

interface Agendamento {
  id: string;
  name: string;
  surname: string;
  appointmentTime: string;
  dateOfBirth: Date;
  appointmentDate: Date;
  appointmentStatus: boolean;
}

const Query = () => {
  const [validDate, setValidDate] = useState<Date | string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const storedDate = localStorage.getItem("selectedDate");
    return storedDate ? new Date(storedDate) : null;
  });
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    surname: "",
    dateOfBirth: new Date(),
    appointmentStatus: false,
    appointmentDate: new Date(),
    appointmentTime: "",
  });

  const [selectAll, setSelectAll] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState<boolean>(false);
  const [showManageDiv, setShowManageDiv] = useState<boolean>(false);
  const [selectedappointmentStatus, setSelectedappointmentStatus] =
    useState<boolean>(true);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showMadeAppointments, setShowMadeAppointments] =
    useState<boolean>(true);
  const [showScheduledAppointments, setShowScheduledAppointments] =
    useState<boolean>(true);
  const [refreshAppointments, setRefreshAppointments] =
    useState<boolean>(false);
  const [order, setOrder] = useState(true);

  const [filteredAppointments, setFilteredAppointments] = useState<
    Agendamento[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Simulação de chamada Axios para obter os agendamentos
    const fetchData = async () => {
      try {
        const response = await api.get<Agendamento[]>("/agendamentos");
        setAppointments(response.data);
      } catch (error) {
        console.error("Erro ao obter agendamentos:", error);
      }
    };

    fetchData();
  }, [refreshAppointments]);

  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem("selectedDate", selectedDate.toISOString());
    } else {
      localStorage.removeItem("selectedDate");
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(
        (agendamento) =>
          formatDate(agendamento.appointmentDate) === formatDate(selectedDate)
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, appointments]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const countSelectedCheckboxes = () => {
    return checkedItems.filter((item) => item).length;
  };

  const handleshowScheduledAppointments = () => {
    setShowScheduledAppointments(!showScheduledAppointments);
  };

  const handleshowMadeAppointments = () => {
    setShowMadeAppointments(!showMadeAppointments);
  };

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const visibleAppointments = filteredAppointments.filter((agendamento) => {
    if (showScheduledAppointments && agendamento.appointmentStatus) {
      return true;
    }
    if (showMadeAppointments && !agendamento.appointmentStatus) {
      return true;
    }
    return false;
  });

  const orderedAppointments = [...visibleAppointments].sort((a, b) => {
    if (order) {
      // Ordenar por "Agendado"
      return a.appointmentStatus === true ? -1 : 1; // "Agendado" vem antes de "Realizado"
    } else {
      // Ordenar por "Realizado"
      return a.appointmentStatus === false ? -1 : 1; // "Realizado" vem antes de "Agendado"
    }
  });

  const handleShowManageDiv = () => {
    setShowCheckboxes(true);
    setShowManageDiv(true);
  };

  const handleCloseManageDiv = (appointmentStatus: boolean) => {
    handleCloseAppointment(appointmentStatus);
    setShowManageDiv(false);
    setShowCheckboxes(false);
  };

  const handleCloseAppointment = async (chosedAppointmentStatus: boolean) => {
    const selectedAppointments = filteredAppointments.filter(
      (appointment, index) => checkedItems[index]
    );

    try {
      // Atualiza no servidor
      await Promise.all(
        selectedAppointments.map(async (appointment) => {
          await api.put(`/agendamentos/${appointment.id}`, {
            ...appointment,
            appointmentStatus: chosedAppointmentStatus,
          });
        })
      );

      // Atualiza o estado local imediatamente
      const updatedAppointments = appointments.map((appointment) => {
        if (
          selectedAppointments.some(
            (selected) => selected.id === appointment.id
          )
        ) {
          return {
            ...appointment,
            appointmentStatus: chosedAppointmentStatus,
          };
        }
        return appointment;
      });

      setAppointments(updatedAppointments);

      onClose(); // Fecha o drawer após salvar
    } catch (error) {
      console.error("Erro ao fechar agendamento:", error);
      // Trate o erro conforme necessário
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    const response = await api.delete(`/agendamentos/${id}`);

    if (response.status === 200) {
      // Remove o agendamento excluído do estado
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
      onCloseDeleteModal();
    } else {
      console.error(`Erro ao remover o agendamento: ${response.data}`);
    }
  };

  const ErrorStyled = styled.span`
    color: red;
    font-size: 14px;
  `;

  const handleEditAppointment = async (values: Agendamento) => {
    try {
      const id = values.id;
      const hoje = new Date(); // Obtém a data atual

      // Verifica se a data de agendamento é anterior à data atual
      let appointmentStatusAgendamento;
      if (values.appointmentDate != null && values.appointmentDate < hoje) {
        appointmentStatusAgendamento = false; // Define appointmentStatus como false se for anterior
      } else {
        appointmentStatusAgendamento = values.appointmentStatus; // Caso contrário, mantém como true
      }

      // Enviando os dados para a API
      const response = await api.put(`/agendamentos/${id}`, {
        name: values.name,
        surname: values.surname,
        dateOfBirth: values.dateOfBirth,
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        appointmentStatus: appointmentStatusAgendamento,
      });

      // Verificando se a resposta foi bem sucedida
      if (response.status === 200) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...values } : appointment
          )
        );
        onCloseEditModal();
      } else {
        alert("Erro!");
        console.error();
      }
      setRefreshAppointments((prev) => !prev);
    } catch (error) {
      alert("Erro!");
    }
  };

  // Função para lidar com o envio do formulário

  const formatDate = (data: any) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "";
    }
    return dataObj.toLocaleDateString("pt-BR");
  };

  const initialCheckedItems = Array(filteredAppointments.length).fill(false);
  const [checkedItems, setCheckedItems] = React.useState(initialCheckedItems);

  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];

    if (index === 0) {
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems(newCheckedItems);
    }
  };

  const handleDataChange = async (date: Date) => {
    try {
      await Yup.object({
        appointmentDate: AppointmentSchema.fields.appointmentDate,
      }).validate({ appointmentDate: date });
      setValidDate(date);
    } catch (err) {
      setValidDate("");
    }
  };

  useEffect(() => {
    if (formData.appointmentDate) {
      fetchavailableTimes();
    }
  }, [formData.appointmentDate]);

  const fetchavailableTimes = async () => {
    try {
      const response = await api.get("/horarios-disponiveis", {
        params: {
          appointmentDate: formData.appointmentDate,
        },
      });
      setAvailableTimes(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
    }
  };

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  return (
    <div className="flex flex-row w-full bg-[#5570F1]">
      <div className="w-1/5 bg-[#5570F1] h-screen">
        <div className="flex flex-col pt-10 px-5">
          <img src={Logo} alt="Logo da plataforma"></img>
        </div>

        <div className="px-4 pt-4">
          <Divider orientation="horizontal" />
        </div>
        <div className="flex flex-col gap-4 px-5 pt-10">
          <Button variant="outline" colorScheme="whiteAlpha" color="#FFFFFF">
            <nav>
              <Link to="/">Página inicial</Link>
            </nav>
          </Button>
          <Button variant="outline" colorScheme="whiteAlpha" color="#FFFFFF">
            <nav>
              <Link to="/Agendamento">Agendar</Link>
            </nav>
          </Button>
        </div>
      </div>
      <div className="w-screen border rounded-l-lg bg-[#FFFFFF]">
        <div className="px-10 pt-10">
          <div className="flex flex-row gap-4 justify-start items-center">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              id="appointmentDate"
              dateFormat="dd/MM/yyyy"
              locale="ptBR"
              placeholderText="dd/mm/aaaa"
              showYearDropdown
              closeOnScroll={true}
              peekNextMonth={true}
              showMonthDropdown
              dropdownMode="select"
              scrollableYearDropdown
              className="rounded py-3 w-full px-4 border-2 border-[#EFF1F9] focus:outline-none"
            />
            <Button borderRadius="4px" onClick={() => handleDateChange}>
              Consultar
            </Button>
          </div>
          <div className="flex flex-col pt-10">
            <div className="flex flex-col ">
              <div className="flex flex-row justify-between">
                <p className="font-medium font text-2xl pb-10">Agendamentos</p>
                <Button colorScheme="primary" onClick={handleShowManageDiv}>
                  Alterar situação
                </Button>
              </div>
              {showManageDiv && (
                <div className="border  mb-4 rounded-xl">
                  <div className="font-semibold text-base p-4">
                    {/* <span className="pr-1">{countSelectedCheckboxes()}</span> */}
                    <span>
                      {countSelectedCheckboxes() === 0
                        ? "Nenhum agendamento selecionado"
                        : countSelectedCheckboxes() === 1
                        ? `${countSelectedCheckboxes()} agendamento selecionado`
                        : `${countSelectedCheckboxes()} agendamentos selecionados`}
                    </span>
                  </div>
                  <div className="pl-4 pb-4 flex flex-row justify-between">
                    <div className="flex flex-row gap-4">
                      <Button
                        variant="outline"
                        borderRadius="20px"
                        colorScheme={
                          selectedappointmentStatus === true ? "green" : "gray"
                        }
                        onClick={() => setSelectedappointmentStatus(true)}
                      >
                        Agendado
                      </Button>
                      <Button
                        variant="outline"
                        borderRadius="20px"
                        colorScheme={
                          selectedappointmentStatus === false ? "red" : "gray"
                        }
                        onClick={() => setSelectedappointmentStatus(false)}
                      >
                        Realizado
                      </Button>
                    </div>
                    <div className="px-4 flex gap-4">
                      <Button
                        variant="outline"
                        colorScheme="primary"
                        mr={3}
                        onClick={() => setShowManageDiv(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        colorScheme="primary"
                        onClick={() =>
                          handleCloseManageDiv(selectedappointmentStatus)
                        }
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-row gap-2 justify-between items-center">
                {selectedDate ? (
                  <div>
                    <span className="font-semibold">
                      {filteredAppointments.length > 0 ? (
                        <div>
                          <span>
                            {filteredAppointments.length}{" "}
                            {filteredAppointments.length > 1
                              ? "resultados"
                              : "resultado"}{" "}
                          </span>
                          <span className="pr-1">para</span>
                          <span className="font-semibold text-[#5570F1]">
                            {selectedDate
                              ? selectedDate.toLocaleDateString()
                              : " "}
                          </span>
                        </div>
                      ) : (
                        " "
                      )}
                    </span>
                  </div>
                ) : (
                  <div></div>
                )}
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<IoChevronDown />}
                      >
                        Exibir
                      </MenuButton>

                      <MenuList>
                        <MenuItem>
                          <Checkbox
                            defaultChecked
                            colorScheme="primary"
                            onChange={handleshowScheduledAppointments}
                          >
                            Agendado
                          </Checkbox>
                        </MenuItem>
                        <MenuItem>
                          <Checkbox
                            defaultChecked
                            colorScheme="primary"
                            onChange={handleshowMadeAppointments}
                          >
                            Realizado
                          </Checkbox>
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              </div>
            </div>
            <div className="pt-10">
              <TableContainer>
                <Table variant="simple" bg="FF00FF" size="md">
                  <Thead>
                    <Tr>
                      <Th>
                        {showCheckboxes && (
                          <Checkbox
                            colorScheme="primary"
                            isIndeterminate={isIndeterminate}
                            onChange={(e) =>
                              setCheckedItems(
                                Array(filteredAppointments.length).fill(
                                  e.target.checked
                                )
                              )
                            }
                          />
                        )}
                      </Th>
                      <Th>Nome</Th>
                      <Th>Sobrenome</Th>
                      <Th>Data de Nascimento</Th>
                      <Th>Data de Agendamento</Th>
                      <Th>Horário</Th>
                      <Th>
                        <Button
                          className="uppercase"
                          variant="ghost"
                          size="xs"
                          fontWeight="bold"
                          color="#4A5568"
                          rightIcon={<CgArrowsExchangeAltV size={14} />}
                          onClick={() => {
                            setOrder(!order);
                          }}
                        >
                          situação
                        </Button>
                      </Th>
                      <Th>Apagar</Th>
                      <Th>Editar</Th>
                    </Tr>
                  </Thead>
                  <Tbody className="rounded-lg">
                    {orderedAppointments.map((agendamento, index) => (
                      <Tr key={index}>
                        <Td>
                          {showCheckboxes && (
                            <Checkbox
                              isChecked={checkedItems[index]}
                              onChange={() => handleCheckboxChange(index)}
                              colorScheme="primary"
                            ></Checkbox>
                          )}
                        </Td>
                        <Td>{agendamento.name}</Td>
                        <Td>{agendamento.surname}</Td>
                        <Td>{formatDate(agendamento.dateOfBirth)}</Td>
                        <Td>{formatDate(agendamento.appointmentDate)}</Td>
                        <Td>{agendamento.appointmentTime}</Td>
                        <Td>
                          <HStack spacing={4}>
                            <Tag
                              size="lg"
                              borderRadius="full"
                              variant="outline"
                              colorScheme={
                                agendamento.appointmentStatus
                                  ? "success"
                                  : "red"
                              }
                            >
                              {agendamento.appointmentStatus
                                ? "Agendado"
                                : "Realizado"}
                            </Tag>
                          </HStack>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Apagar"
                            icon={<MdDelete size={20} color="#FF4949" />}
                            bg="none"
                            onClick={() => {
                              setAppointmentToDelete(agendamento.id);
                              onOpenDeleteModal();
                            }}
                          />
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Editar"
                            icon={<FaEdit size={20} color="#5570F1" />}
                            bg="none"
                            onClick={() => {
                              const appointmentDate = new Date(
                                agendamento.appointmentDate
                              );
                              const dateOfBirth = new Date(
                                agendamento.dateOfBirth
                              );
                              const birthYear = dateOfBirth.getFullYear();
                              const birthMonth = dateOfBirth.getMonth();
                              const birthDay = dateOfBirth.getDate();

                              const appointmentYear =
                                appointmentDate.getFullYear();
                              const appointmentMonth =
                                appointmentDate.getMonth();
                              const appointmentDay = appointmentDate.getDate();

                              setFormData({
                                ...agendamento,
                                dateOfBirth: new Date(
                                  birthYear,
                                  birthMonth,
                                  birthDay
                                ),

                                appointmentDate: new Date(
                                  appointmentYear,
                                  appointmentMonth,
                                  appointmentDay
                                ),
                              });
                              onOpenEditModal();
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <Modal
            isOpen={isOpenDeleteModal}
            size="lg"
            onClose={onCloseDeleteModal}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <div className="flex flex-col justify-center items-center">
                  <div className="pb-4">
                    <FiAlertCircle color="red" size={40} />
                  </div>
                  <p className="text-lg">
                    Tem certeza que deseja apagar esse agendamento?
                  </p>
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className="flex justify-center items-center">
                  <p className="text-[#54595E]">
                    As alterações não poderão ser desfeitas.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="red"
                  variant="outline"
                  border="2px"
                  mr={3}
                  onClick={onCloseDeleteModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  onClick={() => {
                    if (appointmentToDelete) {
                      handleDeleteAppointment(appointmentToDelete);
                    }
                  }}
                >
                  Apagar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpenEditModal} size="lg" onClose={onCloseEditModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <div className="pt-4 flex-row flex items-center">
                  <p className="text-xl font-medium">Editar agendamento</p>
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={formData}
                  validationSchema={AppointmentSchema}
                  onSubmit={handleEditAppointment}
                >
                  {({ handleChange, setFieldValue }) => (
                    <div>
                      <div className="flex flex-col">
                        <Form>
                          <div>
                            <div>
                              <div className="flex flex-col w-full pt-2 gap-1">
                                <label
                                  htmlFor="name"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Nome
                                </label>
                                <Field
                                  name="name"
                                  id="name"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleChange(e);
                                    setFormData((prevValues) => ({
                                      ...prevValues,
                                      name: e.target.value,
                                    }));
                                  }}
                                  placeholder="Nome"
                                  className="rounded-lg px-4 py-3 bg-[#EFF1F9] w-full focus:outline-none focus:none focus:none focus:border-transparent"
                                  required
                                />
                                <ErrorMessage
                                  name="name"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col pt-2 gap-1">
                                <label
                                  htmlFor="surname"
                                  className="text-sm text-[#5E6366] focus:outline-none focus:none focus:none focus:border-transparent"
                                >
                                  Sobrenome
                                </label>
                                <Field
                                  name="surname"
                                  id="surname"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleChange(e);
                                    setFormData((prevValues) => ({
                                      ...prevValues,
                                      surname: e.target.value,
                                    }));
                                  }}
                                  placeholder="surname"
                                  className="rounded-lg py-3 px-4 bg-[#EFF1F9] focus:outline-none focus:none focus:none focus:border-transparent"
                                  required
                                />
                                <ErrorMessage
                                  name="surname"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col pt-2 gap-1">
                                <label
                                  htmlFor="dateOfBirth"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Data de nascimento
                                </label>
                                <Field name="dateOfBirth" required>
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
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
                                        setFormData((prevValues) => ({
                                          ...prevValues,
                                          dateOfBirth: date,
                                        }));
                                      }}
                                      className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                                    />
                                  )}
                                </Field>
                                <ErrorMessage
                                  name="dateOfBirth"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col gap-1 pt-2">
                                <label
                                  htmlFor="appointmentStatus"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Situação
                                </label>
                                <Field name="appointmentStatus" required>
                                  {({ field }: { field: any }) => (
                                    <Menu>
                                      <MenuButton
                                        className="flex flex-row"
                                        py={6}
                                        as={Button}
                                        transition="all 0.2s"
                                        borderRadius="md"
                                        borderWidth="1px"
                                        fontWeight="normal"
                                        _hover={{ bg: "gray.400" }}
                                        rightIcon={<IoChevronDown />}
                                      >
                                        <HStack spacing={4}>
                                          <Tag
                                            size="lg"
                                            borderRadius="full"
                                            variant="outline"
                                            colorScheme={
                                              field.value ? "success" : "red"
                                            }
                                          >
                                            {field.value
                                              ? "Agendado"
                                              : "Realizado"}
                                          </Tag>
                                        </HStack>
                                      </MenuButton>
                                      <MenuList>
                                        <MenuItem
                                          onClick={() =>
                                            setFieldValue(
                                              "appointmentStatus",
                                              true
                                            )
                                          }
                                        >
                                          Agendado
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() =>
                                            setFieldValue(
                                              "appointmentStatus",
                                              false
                                            )
                                          }
                                        >
                                          Realizado
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  )}
                                </Field>
                              </div>
                              <div className="flex flex-row gap-4 pt-2 ">
                                <div className="flex flex-col w-1/2 gap-1">
                                  <label
                                    htmlFor="appointmentDate"
                                    className="text-sm text-[#5E6366]"
                                  >
                                    Data de Agendamento
                                  </label>
                                  <Field name="appointmentDate" required>
                                    {({
                                      field,
                                      form,
                                    }: {
                                      field: any;
                                      form: any;
                                    }) => (
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
                                          form.setFieldValue(
                                            "appointmentDate",
                                            date
                                          );
                                          handleDataChange(date);
                                          setFormData((prevValues) => ({
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
                                <div className="flex flex-col w-1/2 gap-1">
                                  <label
                                    htmlFor="appointmentTime"
                                    className="text-sm text-[#5E6366]"
                                  >
                                    Horário de Agendamento
                                  </label>
                                  <Field name="appointmentTime" required>
                                    {({
                                      field,
                                      form,
                                    }: {
                                      field: any;
                                      form: any;
                                    }) => (
                                      <div className="rounded-lg py-1 bg-[#EFF1F9] focus:outline-none">
                                        <Button
                                          onClick={onOpen}
                                          width="full"
                                          color={
                                            selectedTime ? "#000000" : "#ABAFB1"
                                          }
                                          fontWeight="normal"
                                          _hover={{ bg: "#EFF1F9" }}
                                        >
                                          {selectedTime
                                            ? selectedTime
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
                            </div>
                            <div>
                              <Drawer
                                isOpen={isOpen}
                                placement="right"
                                onClose={onClose}
                              >
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
                                            time === selectedTime
                                              ? "primary"
                                              : "gray"
                                          }
                                          onClick={() => setSelectedTime(time)}
                                        >
                                          {time}
                                        </Button>
                                      ))}
                                    </Stack>
                                  </DrawerBody>

                                  <DrawerFooter borderTopWidth="1px">
                                    <Button
                                      variant="outline"
                                      mr={3}
                                      onClick={onClose}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      colorScheme="primary"
                                      onClick={() => {
                                        setFieldValue(
                                          "appointmentTime",
                                          selectedTime
                                        );
                                        setFormData((prevValues) => ({
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
                          </div>
                          <div className="flex flex-row gap-4 justify-end pt-10 pb-2">
                            <Button
                              variant="outline"
                              border="2px"
                              size="md"
                              fontWeight="normal"
                              colorScheme="primary"
                              width="100px"
                              onClick={onCloseEditModal}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="md"
                              colorScheme="primary"
                              type="submit"
                              fontWeight="normal"
                              width="100px"
                              onClick={() => {
                                const interval = setInterval(() => {
                                  setSelectedTime("");
                                }, 2000);

                                // Limpar o intervalo após 2 segundos
                                setTimeout(() => {
                                  clearInterval(interval);
                                }, 2000);
                              }}
                            >
                              Editar
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}
                </Formik>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Query;
