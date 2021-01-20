import React, { Component, Fragment, useState } from "react";
import { Table, Icon } from "semantic-ui-react";
import VerArchivos from "./VerArchivos";
import { tramite } from "../services/apis";
import SearchIcon from "@material-ui/icons/Search";
import Show from "./show";

export default function infoTramite({ tramite }) {
  const [show_file, setshow_file] = useState(false);
  let { files } = tramite;
  return (
    <div className="row">
      <div className="col-md-6">
        <Table className="mt-5" celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                style={{
                  background: "#00a28a",
                  color: "#fff",
                  textAlign: "center",
                }}
                colSpan="2"
              >
                <i className="fas fa-male"></i> Datos del Remitente
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell width="5">
                <i className="fas fa-passport"></i> Tipo de Documento
              </Table.Cell>
              <Table.Cell>
                {tramite && tramite.person && tramite.person.document_type}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="far fa-id-card" style={{ textAlign: "left" }}></i>{" "}
                Nro de Documento
              </Table.Cell>
              <Table.Cell>
                {tramite && tramite.person && tramite.person.document_number}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="far fa-user"></i> Nombres y Apellidos
              </Table.Cell>
              <Table.Cell>
                {tramite &&
                  tramite.person &&
                  tramite.person.fullname.toUpperCase()}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="fas fa-map-marker-alt"></i> Direccion
              </Table.Cell>
              <Table.Cell>
                {tramite && tramite.person && tramite.person.address}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="text-left">
                <i className="fas fa-inbox "></i> E-Mail
              </Table.Cell>
              <Table.Cell>
                {tramite && tramite.person && tramite.person.email_contact}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>

      <div className="col-md-6">
        <Table celled className="mt-5 ">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                style={{
                  background: "#00a28a",
                  color: "#fff",
                  textAlign: "center",
                }}
                colSpan="2"
              >
                <i className="fas fa-file-pdf"></i> Datos del Documento
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell width="5">
                <i className="fas fa-passport "></i> Entidad
              </Table.Cell>
              <Table.Cell className="capitalize">
                {tramite && tramite.entity && tramite.entity.name}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell width="5">
                <i className="fas fa-passport "></i> Tipo Documento
              </Table.Cell>
              <Table.Cell>
                {tramite &&
                  tramite.tramite_type &&
                  tramite.tramite_type.description}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="fas fa-file-pdf"></i> Nro Documento
              </Table.Cell>
              <Table.Cell>{tramite && tramite.document_number}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="far fa-comment-dots"></i> Asunto
              </Table.Cell>
              <Table.Cell>{tramite && tramite.asunto}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <i className="far fa-file-alt"></i> Archivo
              </Table.Cell>
              <Table.Cell>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={(e) => setshow_file(true)}
                >
                  <Icon name="file pdf" />
                  Ver Archivos
                </button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>

      <Show condicion={show_file}>
        <VerArchivos
          header="Visualizador de archivos"
          onClose={(e) => setshow_file(false)}
        >
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Descargar</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {files.map((e, iter) => (
                <Table.Row key={iter}>
                  <Table.Cell>
                    {`${e.name}`} <Icon name="file pdf outline" />
                  </Table.Cell>
                  <Table.Cell>
                    <a target="_blank" href={e.url}>
                      <SearchIcon />
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </VerArchivos>
      </Show>
    </div>
  );
}
