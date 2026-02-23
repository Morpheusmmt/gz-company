import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import api from "../../services/api";  

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const user = api.auth.getCurrentUser();  

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > lastScrollY);
      setLastScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      if (e.clientY <= 70) {
        setHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${hidden ? "navbar_hidden" : ""}`}>
      <div className="navbar_left">
        <div className="navbar_logo">
          <img src="/logo.png" alt="Logo" className="navbar_logo_img" />
        </div>
      </div>

      <div className="navbar_center">
        <ul className="navbar_links">
          <li><a href="/home">Início</a></li>
          <li><a href="#Imagens">Imagens</a></li>
          <li><a href="#Fale conosco">Fale conosco</a></li>
        </ul>
      </div>

      <div className="navbar_right">
        {user ? (
          <button
            className="navbar_button"
            onClick={() => navigate("/menu")}
          >
            Voltar ao Menu
          </button>
        ) : (
          <button
            className="navbar_button"
            onClick={() => navigate("/login")}
          >
            Login/Cadastro
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;