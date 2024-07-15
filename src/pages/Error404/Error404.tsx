import React from "react";
import Logo from "public/assets/Error.svg";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        <img src={Logo} alt="Logo da plataforma"></img>
      </div>
      <div className="flex font-light flex-row gap-8 justify-center items-center pt-8">
        <Button size="lg" colorScheme="primary" fontWeight="normal">
          <nav>
            <Link to="/">Voltar para o início</Link>
          </nav>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
