import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import Show from "../components/show";
import env from "../env.json";

export default function Navbar({ app, isLoggin }) {
  return (
    <nav
      className={`navbar navbar-expand-md navbar-dark fixed-top`}
      style={{ background: "#00a28a" }}
    >
      <a className="navbar-brand" href="#">
        <img
          src={app.icon || "/img/logo.png"}
          alt="Logo"
          style={{ background: "white", borderRadius: "8px", padding: "2px" }}
          className="logo"
        />
        {app.name || "Convocatorias"}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto"></ul>
        <div className="form-inline mt-2 mt-md-0">
          <Link href={`${env.app.asset_prefix}`}>
            <a className="btn mr-2">Consulta</a>
          </Link>

          <button
            className="btn btn-outline ml-3"
            onClick={(e) => Router.push(`${env.app.asset_prefix}register`)}
          >
            <i className="fas fa-file-word"></i> Trámite
          </button>
        </div>
      </div>
    </nav>
  );
}
