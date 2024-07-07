import React from "react";
import { SiGoogleforms } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import Logo from "../assets/Logo.svg";
import { Button, ButtonGroup } from "@chakra-ui/react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        <img src={Logo} alt="Logo da plataforma"></img>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center">
        <Button rightIcon={<SiGoogleforms />} size="lg" colorScheme="primary">
          Agendar
        </Button>
        <Button rightIcon={<FaSearch />} size="lg" colorScheme="primary">
          Consultar
        </Button>
      </div>
    </div>
  );
};

export default Home;
