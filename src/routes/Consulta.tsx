import React, { useState } from "react";
import Logo from "../assets/Logo-branco.svg";
import { Divider, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Badge } from "@chakra-ui/react";
import DatePicker, { registerLocale } from "react-datepicker";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { IoChevronDown } from "react-icons/io5";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
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
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

type ButtonName = "consulta" | "gerenciar";

const Gerenciamento = () => {
  const [selectedButton, setSelectedButton] = useState<ButtonName>("consulta");

  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setDataSelecionada(date);
  };

  const handleButtonClick = (buttonName: ButtonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="flex flex-row w-full">
      <div className="bg-[#5570F1] w-1/6 h-screen rounded-r-lg">
        <div className="pt-8 pb-4 px-10">
          <img src={Logo} alt="Logo da plataforma" />
        </div>
        <div className="px-4">
          <Divider orientation="horizontal" />
        </div>
        <div className="flex flex-col items-center justify-center pt-8 gap-8">
          <Button
            leftIcon={<FaSearch />}
            width="80%"
            color={selectedButton === "consulta" ? "#5570F1" : "#FFFFFF"}
            bg={selectedButton === "consulta" ? "#FFFFFF" : "#5570F1"}
            variant={selectedButton === "consulta" ? "solid" : "gost"}
            onClick={() => handleButtonClick("consulta")}
          >
            Consulta
          </Button>
          <Button
            leftIcon={<IoMdMenu size={24} />}
            width="80%"
            color={selectedButton === "gerenciar" ? "#5570F1" : "#FFFFFF"}
            bg={selectedButton === "gerenciar" ? "#FFFFFF" : "#5570F1"}
            variant={selectedButton === "gerenciar" ? "solid" : "gost"}
            onClick={() => handleButtonClick("gerenciar")}
          >
            Gerenciar
          </Button>
        </div>
      </div>
      {selectedButton == "consulta" ? (
        <div className="w-screen">
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
              <Button borderRadius="4px">Consultar</Button>
            </div>
            <div className="flex flex-col pt-10">
              <div className="flex flex-col ">
                <p className="font-medium font text-2xl pb-10">Agendamentos</p>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <div>
                    <span className="font-semibold">
                      20 de 30 resultados para{" "}
                    </span>
                    <span className="font-semibold text-[#5570F1]">
                      {dataSelecionada
                        ? dataSelecionada.toLocaleDateString()
                        : " "}
                    </span>
                  </div>
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
                            <Checkbox defaultChecked colorScheme="primary">
                              Agendamentos abertos
                            </Checkbox>
                          </MenuItem>
                          <MenuItem>
                            <Checkbox defaultChecked colorScheme="primary">
                              Agendamentos fechados
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
                  <Table variant="striped" bg="F7F6FE">
                    <Thead>
                      <Tr>
                        <Th>Nome</Th>
                        <Th>Sobrenome</Th>
                        <Th>Data de Nascimento</Th>
                        <Th>Data de Agendamento</Th>
                        <Th>Horário</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>

                    <Tbody className="rounded-lg">
                      <Tr>
                        <Td>Arthur</Td>
                        <Td>Braga da Fonseca</Td>
                        <Td>27/11/2002</Td>
                        <Td>12/08/2024</Td>
                        <Td>11:00</Td>
                        <Td>
                          <Badge
                            ml="1"
                            fontSize="0.8em"
                            padding={"4px"}
                            borderRadius={"4px"}
                            colorScheme="green"
                          >
                            Aberto
                          </Badge>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Luiz Felipe</Td>
                        <Td>Guimarães Macedo</Td>
                        <Td>03/12/2002</Td>
                        <Td>13/10/2024</Td>
                        <Td>08:00</Td>
                        <Td>
                          <Badge
                            ml="1"
                            fontSize="0.8em"
                            padding={"4px"}
                            borderRadius={"4px"}
                            colorScheme="red"
                          >
                            Fechado
                          </Badge>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Gerenciamento;
