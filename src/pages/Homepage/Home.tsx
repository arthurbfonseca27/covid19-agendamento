import React from "react";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaSearch } from "react-icons/fa";
import Logo from "public/assets/Logo.svg";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        <img src={Logo} alt="Logo da plataforma"></img>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center">
        <Button leftIcon={<LiaClipboardListSolid size={20  }/>} size="lg" colorScheme="primary" fontWeight='normal'  width="180px">
          <nav>
            <Link to="/Agendamento">Agendar</Link>
          </nav>
        </Button>
        <Button leftIcon={<FaSearch />} size="lg" colorScheme="primary" fontWeight='normal'  width="180px">
        <nav>
            <Link to="/Consulta">Consultar</Link>
          </nav>
        </Button>
      </div>
    </div>
  );
};

export default Home;
