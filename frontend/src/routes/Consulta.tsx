import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo-branco.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Divider, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Badge } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { AgendamentoSchema } from "../validation/Agendamento";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";
import api from "../services/api";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
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

type ButtonName = "consulta" | "gerenciar";

interface Agendamento {
  id: string;
  nome: string;
  sobrenome: string;
  horarioAgendamento: string;
  dataNascimento: Date;
  dataAgendamento: Date;
  status: boolean;
}

const Consulta = () => {
  const [selectedButton, setSelectedButton] = useState<ButtonName>("consulta");
  const [dataValida, setDataValida] = useState<Date | string>("");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(() => {
    const storedDate = localStorage.getItem("dataSelecionada");
    return storedDate ? new Date(storedDate) : null;
  });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentoParaEditar, setAgendamentoParaEditar] = useState<
    string | null
  >(null);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<
    string | null
  >(null);
  const [agendamentoIdParaEditar, setAgendamentoIdParaEditar] = useState<
    string | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Agendamento | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    sobrenome: "",
    dataNascimento: new Date(),
    status: false,
    dataAgendamento: new Date(),
    horarioAgendamento: "",
  });

  const [selectAll, setSelectAll] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState<boolean>(false);
  const [showManageDiv, setShowManageDiv] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<boolean>(true);
  const [exibirAgendado, setExibirAgendado] = useState<boolean>(true);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [showTimes, setShowTimes] = useState<boolean>(false);
  const [exibirRealizado, setExibirRealizado] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [ordenacao, setOrdenacao] = useState(true);

  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState<
    Agendamento[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Simulação de chamada Axios para obter os agendamentos
    const fetchData = async () => {
      try {
        const response = await api.get<Agendamento[]>("/agendamentos");
        setAgendamentos(response.data);
      } catch (error) {
        console.error("Erro ao obter agendamentos:", error);
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (dataSelecionada) {
      localStorage.setItem("dataSelecionada", dataSelecionada.toISOString());
    } else {
      localStorage.removeItem("dataSelecionada");
    }
  }, [dataSelecionada]);

  useEffect(() => {
    if (dataSelecionada) {
      const filtrados = agendamentos.filter(
        (agendamento) =>
          formatarData(agendamento.dataAgendamento) ===
          formatarData(dataSelecionada)
      );
      setAgendamentosFiltrados(filtrados);
    } else {
      setAgendamentosFiltrados([]);
    }
  }, [dataSelecionada, agendamentos]);

  const handleDateChange = (date: Date | null) => {
    setDataSelecionada(date);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
  };

  const countSelectedCheckboxes = () => {
    return checkedItems.filter((item) => item).length;
  };

  const handleExibirAgendado = () => {
    setExibirAgendado(!exibirAgendado);
  };

  const handleExibirRealizado = () => {
    setExibirRealizado(!exibirRealizado);
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

  const handleButtonClick = (buttonName: ButtonName) => {
    setSelectedButton(buttonName);
  };

  const agendamentosVisiveis = agendamentosFiltrados.filter((agendamento) => {
    if (exibirAgendado && agendamento.status) {
      return true;
    }
    if (exibirRealizado && !agendamento.status) {
      return true;
    }
    return false;
  });

  const agendamentosOrdenados = [...agendamentosVisiveis].sort((a, b) => {
    if (ordenacao) {
      // Ordenar por "Agendado"
      return a.status === true ? -1 : 1; // "Agendado" vem antes de "Realizado"
    } else {
      // Ordenar por "Realizado"
      return a.status === false ? -1 : 1; // "Realizado" vem antes de "Agendado"
    }
  });

  const handleShowManageDiv = () => {
    setShowCheckboxes(true);
    setShowManageDiv(true);
  };

  const handleCloseManageDiv = (status: boolean) => {
    handleCloseAppointment(status);
    setShowManageDiv(false);
    setShowCheckboxes(false);
  };

  const handleCloseAppointment = async (statusEscolhido: boolean) => {
    const selectedAgendamentos = agendamentosFiltrados.filter(
      (agendamento, index) => checkedItems[index]
    );

    try {
      // Atualiza no servidor
      await Promise.all(
        selectedAgendamentos.map(async (agendamento) => {
          await api.put(`/agendamentos/${agendamento.id}`, {
            ...agendamento,
            status: statusEscolhido,
          });
        })
      );

      // Atualiza o estado local imediatamente
      const updatedAgendamentos = agendamentos.map((agendamento) => {
        if (
          selectedAgendamentos.some(
            (selected) => selected.id === agendamento.id
          )
        ) {
          return {
            ...agendamento,
            status: statusEscolhido,
          };
        }
        return agendamento;
      });

      setAgendamentos(updatedAgendamentos);

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
      setAgendamentos((prevAgendamentos) =>
        prevAgendamentos.filter((agendamento) => agendamento.id !== id)
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
      let statusAgendamento;
      if (values.dataAgendamento != null && values.dataAgendamento < hoje) {
        statusAgendamento = false; // Define status como false se for anterior
      } else {
        statusAgendamento = values.status; // Caso contrário, mantém como true
      }

      // Enviando os dados para a API
      const response = await api.put(`/agendamentos/${id}`, {
        nome: values.nome,
        sobrenome: values.sobrenome,
        dataNascimento: values.dataNascimento,
        dataAgendamento: values.dataAgendamento,
        horarioAgendamento: values.horarioAgendamento,
        status: statusAgendamento,
      });

      // Verificando se a resposta foi bem sucedida
      if (response.status === 200) {
        setAgendamentos((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...values } : appointment
          )
        );
        onCloseEditModal();
      } else {
        alert("Erro!");
        console.error();
      }
      setRefresh((prev) => !prev);
    } catch (error) {
      alert("Erro!");
    }
  };

  // Função para lidar com o envio do formulário

  const formatarData = (data: any) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return ""; // Retorna uma string vazia se a data for inválida
    }
    return dataObj.toLocaleDateString("pt-BR");
  };

  const initialCheckedItems = Array(agendamentosFiltrados.length).fill(false);
  const [checkedItems, setCheckedItems] = React.useState(initialCheckedItems);

  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];

    // Se o índice for 0 (primeiro checkbox filho), atualize diretamente
    if (index === 0) {
      setCheckedItems(newCheckedItems);
    } else {
      // Caso contrário, mantenha a lógica anterior
      setCheckedItems(newCheckedItems);
    }
  };

  const handleDataChange = async (date: Date) => {
    try {
      await Yup.object({
        dataAgendamento: AgendamentoSchema.fields.dataAgendamento,
      }).validate({ dataAgendamento: date });
      setDataValida(date);
    } catch (err) {
      setDataValida("");
    }
  };

  useEffect(() => {
    // Buscar horários disponíveis quando a data de agendamento mudar
    if (formData.dataAgendamento) {
      fetchHorariosDisponiveis();
    }
  }, [formData.dataAgendamento]);

  const fetchHorariosDisponiveis = async () => {
    try {
      const response = await api.get("/horarios-disponiveis", {
        params: {
          dataAgendamento: formData.dataAgendamento,
        },
      });
      setHorariosDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
    }
  };

  const formatarDados = () => {
    // const anoNascimento = formData.dataNascimento.getFullYear(); // 1990
    // const mesNascimento = formData.dataNascimento.getMonth(); // 0 (Janeiro, índice 0)
    // const diaNascimento = formData.dataNascimento.getDate();

    // const anoAgendamento = formData.dataAgendamento.getFullYear(); // 1990
    // const mesAgendamento = formData.dataAgendamento.getMonth(); // 0 (Janeiro, índice 0)
    // const diaAgendamento = formData.dataAgendamento.getDate();

    setFormData({
      ...formData,
      dataNascimento: new Date(0, 0, 0),
      dataAgendamento: new Date(0, 0, 0),
    });
  };

  const mapTest = agendamentosFiltrados.length + 1;

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
              selected={dataSelecionada}
              onChange={handleDateChange}
              id="dataAgendamento"
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
                        colorScheme={selectedStatus === true ? "green" : "gray"}
                        onClick={() => setSelectedStatus(true)}
                      >
                        Agendado
                      </Button>
                      <Button
                        variant="outline"
                        borderRadius="20px"
                        colorScheme={selectedStatus === false ? "red" : "gray"}
                        onClick={() => setSelectedStatus(false)}
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
                        onClick={() => handleCloseManageDiv(selectedStatus)}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-row gap-2 justify-between items-center">
                {dataSelecionada ? (
                  <div>
                    <span className="font-semibold">
                      {agendamentosFiltrados.length > 0 ? (
                        <div>
                          <span>
                            {agendamentosFiltrados.length}{" "}
                            {agendamentosFiltrados.length > 1
                              ? "resultados"
                              : "resultado"}{" "}
                          </span>
                          <span className="pr-1">para</span>
                          <span className="font-semibold text-[#5570F1]">
                            {dataSelecionada
                              ? dataSelecionada.toLocaleDateString()
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
                            onChange={handleExibirAgendado}
                          >
                            Agendado
                          </Checkbox>
                        </MenuItem>
                        <MenuItem>
                          <Checkbox
                            defaultChecked
                            colorScheme="primary"
                            onChange={handleExibirRealizado}
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
                                Array(agendamentosFiltrados.length).fill(
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
                            setOrdenacao(!ordenacao);
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
                    {agendamentosOrdenados.map((agendamento, index) => (
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
                        <Td>{agendamento.nome}</Td>
                        <Td>{agendamento.sobrenome}</Td>
                        <Td>{formatarData(agendamento.dataNascimento)}</Td>
                        <Td>{formatarData(agendamento.dataAgendamento)}</Td>
                        <Td>{agendamento.horarioAgendamento}</Td>
                        <Td>
                          <HStack spacing={4}>
                            <Tag
                              size="lg"
                              borderRadius="full"
                              variant="outline"
                              colorScheme={
                                agendamento.status ? "success" : "red"
                              }
                            >
                              {agendamento.status ? "Agendado" : "Realizado"}
                            </Tag>
                          </HStack>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Apagar"
                            icon={<MdDelete size={20} color="#FF4949" />}
                            bg="none"
                            onClick={() => {
                              setAgendamentoParaExcluir(agendamento.id);
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
                              const dataAgendamento = new Date(
                                agendamento.dataAgendamento
                              );
                              const dataNascimento = new Date(
                                agendamento.dataNascimento
                              );
                              const anoNascimento =
                                dataNascimento.getFullYear();
                              const mesNascimento = dataNascimento.getMonth();
                              const diaNascimento = dataNascimento.getDate();

                              const anoAgendamento =
                                dataAgendamento.getFullYear();
                              const mesAgendamento = dataAgendamento.getMonth();
                              const diaAgendamento = dataAgendamento.getDate();

                              setFormData({
                                ...agendamento,
                                dataNascimento: new Date(
                                  anoNascimento,
                                  mesNascimento,
                                  diaNascimento
                                ),

                                dataAgendamento: new Date(
                                  anoAgendamento,
                                  mesAgendamento,
                                  diaAgendamento
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
                    if (agendamentoParaExcluir) {
                      handleDeleteAppointment(agendamentoParaExcluir);
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
                  validationSchema={AgendamentoSchema}
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
                                  htmlFor="nome"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Nome
                                </label>
                                <Field
                                  name="nome"
                                  id="nome"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleChange(e);
                                    setFormData((prevValues) => ({
                                      ...prevValues,
                                      nome: e.target.value,
                                    }));
                                  }}
                                  placeholder="Nome"
                                  className="rounded-lg px-4 py-3 bg-[#EFF1F9] w-full focus:outline-none focus:none focus:none focus:border-transparent"
                                  required
                                />
                                <ErrorMessage
                                  name="nome"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col pt-2 gap-1">
                                <label
                                  htmlFor="sobrenome"
                                  className="text-sm text-[#5E6366] focus:outline-none focus:none focus:none focus:border-transparent"
                                >
                                  Sobrenome
                                </label>
                                <Field
                                  name="sobrenome"
                                  id="sobrenome"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleChange(e);
                                    setFormData((prevValues) => ({
                                      ...prevValues,
                                      sobrenome: e.target.value,
                                    }));
                                  }}
                                  placeholder="Sobrenome"
                                  className="rounded-lg py-3 px-4 bg-[#EFF1F9] focus:outline-none focus:none focus:none focus:border-transparent"
                                  required
                                />
                                <ErrorMessage
                                  name="sobrenome"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col pt-2 gap-1">
                                <label
                                  htmlFor="dataNascimento"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Data de nascimento
                                </label>
                                <Field name="dataNascimento" required>
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
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
                                        form.setFieldValue(
                                          "dataNascimento",
                                          date
                                        );
                                        setFormData((prevValues) => ({
                                          ...prevValues,
                                          dataNascimento: date,
                                        }));
                                      }}
                                      className="rounded-lg py-3 w-full px-4 bg-[#EFF1F9] focus:outline-none"
                                    />
                                  )}
                                </Field>
                                <ErrorMessage
                                  name="dataNascimento"
                                  component={ErrorStyled}
                                />
                              </div>
                              <div className="flex flex-col gap-1 pt-2">
                                <label
                                  htmlFor="status"
                                  className="text-sm text-[#5E6366]"
                                >
                                  Situação
                                </label>
                                <Field name="status" required>
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
                                            setFieldValue("status", true)
                                          }
                                        >
                                          Agendado
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() =>
                                            setFieldValue("status", false)
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
                                    htmlFor="dataAgendamento"
                                    className="text-sm text-[#5E6366]"
                                  >
                                    Data de Agendamento
                                  </label>
                                  <Field name="dataAgendamento" required>
                                    {({
                                      field,
                                      form,
                                    }: {
                                      field: any;
                                      form: any;
                                    }) => (
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
                                          form.setFieldValue(
                                            "dataAgendamento",
                                            date
                                          );
                                          handleDataChange(date);
                                          setFormData((prevValues) => ({
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
                                <div className="flex flex-col w-1/2 gap-1">
                                  <label
                                    htmlFor="horarioAgendamento"
                                    className="text-sm text-[#5E6366]"
                                  >
                                    Horário de Agendamento
                                  </label>
                                  <Field name="horarioAgendamento" required>
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
                                    name="horarioAgendamento"
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
                                      {horariosDisponiveis.map(
                                        (time, index) => (
                                          <Button
                                            key={index}
                                            width="full"
                                            colorScheme={
                                              time === selectedTime
                                                ? "primary"
                                                : "gray"
                                            }
                                            onClick={() =>
                                              setSelectedTime(time)
                                            }
                                          >
                                            {time}
                                          </Button>
                                        )
                                      )}
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
                                          "horarioAgendamento",
                                          selectedTime
                                        );
                                        setFormData((prevValues) => ({
                                          ...prevValues,
                                          horarioAgendamento: selectedTime,
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

export default Consulta;
