import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo-branco.svg";
import { Divider, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Badge } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
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
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
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

type ButtonName = "consulta" | "gerenciar";

interface Agendamento {
  id: string;
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  dataAgendamento: string;
  horarioAgendamento: string;
  status: boolean;
}

const Consulta = () => {
  const [selectedButton, setSelectedButton] = useState<ButtonName>("consulta");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<boolean>(true);
  const [exibirAgendado, setExibirAgendado] = useState<boolean>(true);
  const [exibirRealizado, setExibirRealizado] = useState<boolean>(true);

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
  }, []);

  useEffect(() => {
    if (dataSelecionada) {
      const filtrados = agendamentos.filter(
        (agendamento) =>
          agendamento.dataAgendamento === dataSelecionada.toISOString()
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

  const formatarData = (data: string) => {
    const dataObj = new Date(data);
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
              <Link to="/">Home</Link>
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
                <Button colorScheme="primary" onClick={onOpen}>
                  Gerenciar agendamentos selecionados
                </Button>
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Gerenciar agendamentos</DrawerHeader>

                    <DrawerBody>
                      <div className="font-semibold text-base pb-4">
                        <span className="pr-1">
                          {countSelectedCheckboxes()}
                        </span>
                        <span>agendamentos selecionados</span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Button
                          variant="outline"
                          colorScheme={
                            selectedStatus === true ? "green" : "gray"
                          }
                          onClick={() => setSelectedStatus(true)}
                        >
                          Agendado
                        </Button>
                        <Button
                          variant="outline"
                          colorScheme={
                            selectedStatus === false ? "red" : "gray"
                          }
                          onClick={() => setSelectedStatus(false)}
                        >
                          Realizado
                        </Button>
                      </div>
                    </DrawerBody>

                    <DrawerFooter>
                      <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleCloseAppointment(selectedStatus)}
                      >
                        Confirmar
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
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
                      </Th>
                      <Th>Nome</Th>
                      <Th>Sobrenome</Th>
                      <Th>Data de Nascimento</Th>
                      <Th>Data de Agendamento</Th>
                      <Th>Horário</Th>
                      <Th>Status</Th>
                      <Th>Apagar</Th>
                      <Th>Editar</Th>
                    </Tr>
                  </Thead>
                  <Tbody className="rounded-lg">
                    {agendamentosVisiveis.map((agendamento, index) => (
                      <Tr key={index}>
                        <Td>
                          <Checkbox
                            isChecked={checkedItems[index]}
                            onChange={() => handleCheckboxChange(index)}
                            colorScheme="primary"
                          ></Checkbox>
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
                            aria-label="Delete"
                            icon={<MdDelete size={20} color="#FF4949" />}
                            bg="none"
                          />
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Edit"
                            icon={<FaEdit color="#5570F1" />}
                            bg="none"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consulta;
