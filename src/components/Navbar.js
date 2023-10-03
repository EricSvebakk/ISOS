
import React from 'react'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

export function MyNavbar() {
  return (
    <>
      <Navbar bg="dark" variant="light" fixed="top" className="my-navbar">
        <Nav className="container-fluid">
        
          
          <Navbar.Brand className="title-stuff" bsPrefix="title-stuff">
            <img
              alt="uio-logo"
              src={require("../assets/BW_UiO_logo.png")}
              width="40"
            />{" "}
            IFI emneroversikt
          </Navbar.Brand>
          
          <Nav.Item className="ml-auto">
            <a
              href='https://github.com/EricSvebakk'
              >
              <img
                alt="uio-logo"
                src={require("../assets/github-mark-white.png")}
                width="40"
              />{" "}
            </a>
          </Nav.Item>
        
        </Nav>
      </Navbar>
    </>
  );
}