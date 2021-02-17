import React, { Component, Fragment, useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { Form, Icon, Table } from "semantic-ui-react";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CallMissedOutgoingRoundedIcon from "@material-ui/icons/CallMissedOutgoingRounded";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import CloseIcon from "@material-ui/icons/Close";
import VerArchivo from "./VerArchivos";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ChatIcon from "@material-ui/icons/Chat";
import { tramite } from "../services/apis";
import Show from "./show";
import moment from "moment";
import CreateIcon from "@material-ui/icons/Create";
import SearchIcon from "@material-ui/icons/Search";
import InfoTramite from "./infoTramite";

const tra = tramite;

const TimeLine = ({ trackings, setLoading }) => {
  const [show_file, setshow_file] = useState(false);
  const [trackingg, settracking] = useState(trackings.data);
  const [current_tramite, setCurrentTramite] = useState({});
  const [option, setOption] = useState("");

  useEffect(() => {
    // console.log(trackingg);
  }, []);

  // const getTracking = async (page = 1, up = true) => {
  //     setLoading(true);

  //     // console.log(slug)
  //     await tra.get(`public/tramite/${slug}/tracking?page=${page}`)
  //         .then(async res => {
  //             setLoading(false);
  //             // console.log(res.data.tracking.data)
  //             let { success, message, tracking } = res.data;
  //             if (!success) throw new Error(message);
  //             let { data, lastPage } = tracking;
  //             // console.log(data)
  //             // setting tracking state
  //             // this.setState(state => {
  //             //     state.tracking = up ? [...state.tracking, ...data] : data;
  //             //     return { tracking: state.tracking };
  //             // });
  //             // console.log(data)
  //             await settracking([...data])
  //             // // validar siguiente request
  //             if (lastPage >= page + 1) getTracking(page + 1);
  //         })
  //         .catch(err => {
  //             setLoading(false);
  //             console.log(err.message)
  //         })
  // }

  const getMetadata = (status) => {
    let icons = {
      DERIVADO: {
        icon: <CallMissedOutgoingRoundedIcon style={{ color: "#fff" }} />,
        message: "La dependencia ha derivado el documento a: ",
      },
      ACEPTADO: {
        icon: (
          <CheckCircleOutlineOutlinedIcon
            fontSize="large"
            style={{ color: "#fff" }}
          />
        ),
        message: "Fue Aceptado en: ",
      },
      RECHAZADO: { icon: <CloseIcon style={{ color: "#fff" }} />, message: "" },
      ANULADO: {
        icon: <DeleteForeverIcon style={{ color: "#fff" }} />,
        message: "",
      },
      ENVIADO: {
        icon: <SendRoundedIcon style={{ color: "#fff" }} />,
        message: "",
      },
      FINALIZADO: {
        icon: <DoneAllIcon style={{ color: "#fff" }} />,
        message: "Puede ir a recoger su Documento en: ",
      },
      RESPONDIDO: {
        icon: <ChatIcon style={{ color: "#fff" }} />,
        message: "La Oficina respondió a: ",
        name: "RESPUESTA",
      },
      REGISTRADO: {
        icon: <CreateIcon style={{ color: "#fff" }} />,
        message: "Fue registrado en ",
        nanme: "REGISTRADO",
      },
    };
    // response
    return icons[status] || {};
  };

  const handleShowFile = (obj, index, estado) => {
    obj.show_file = estado;
    let newTracking = JSON.parse(JSON.stringify(trackingg));
    newTracking[index] = obj;
    settracking(newTracking);
  };

  return (
    <VerticalTimeline>
      {trackingg.map((track, iter) => (
        <Fragment key={iter}>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date={moment(track.updated_at).lang("es").format("h:mm a")}
            contentStyle={{
              border: "2px solid rgb(0, 162, 138)",
              borderRadius: "20px",
            }}
            contentArrowStyle={{ borderRight: "10px solid rgb(0, 162, 138)" }}
            iconStyle={{ background: "rgb(0, 162, 138)" }}
            icon={getMetadata(track.status).icon}
          >
            <h3 className="vertical-timeline-element-title">
              {getMetadata(track.status).name || track.status}
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              {getMetadata(track.status).message}
              <span className="badge badge-dark">
                {track &&
                  track.dependencia_destino &&
                  `${track.dependencia_destino.nombre}`.toUpperCase()}
              </span>
            </h4>
            <hr></hr>
            {track && track.description}

            <Show condicion={track.files && track.files.length}>
              <p>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={(event) => handleShowFile(track, iter, true)}
                >
                  Ver Archivos
                </button>
              </p>
            </Show>

            <p>{moment(track.updated_at).lang("es").format("LL")}</p>

            <Show condicion={Object.keys(track.tramite || {}).length}>
                <button className="btn btn-outline-primary mt-2"
                  onClick={(e) => {
                    setCurrentTramite(track.tramite)
                    setOption('INFO')
                  }}
                >
                    Información
                </button>
            </Show>
          </VerticalTimelineElement>

          {/* mostrar files */}
          <Show condicion={track.show_file == true}>
            <VerArchivo
              header="Visualizador de archivos del Seguimiento"
              onClose={(event) => handleShowFile(track, iter, false)}
            >
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Descargar</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {track &&
                    track.files.map((f, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          {`${f.name}`} <Icon name="file pdf outline" />
                        </Table.Cell>
                        <Table.Cell>
                          <a target="_blank" href={f.url}>
                            <SearchIcon />
                          </a>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </VerArchivo>
          </Show>
        </Fragment>
      ))}
      {/* mostra más información del tracking */}
      <Show condicion={option == 'INFO'}>
        <VerArchivo header="Información del trámite"
          onClose={(e) => setOption('')}
        >
          <div className="text-left">
            <Form.Field className="mb-3">
              <label htmlFor="">Dependencia Origen</label>
              <input className="capitalize" 
                type="text" 
                readOnly 
                value={current_tramite.dependencia_origen && current_tramite.dependencia_origen.nombre || ""}
              />
            </Form.Field>

            <Form.Field className="mb-3">
              <label htmlFor="">Tipo Documento</label>
              <input type="text" 
                readOnly 
                value={current_tramite.tramite_type && current_tramite.tramite_type.description || ""}
              />
            </Form.Field>

            <Form.Field className="mb-3">
              <label htmlFor="">N° Documento</label>
              <input type="text"
                readOnly 
                value={current_tramite.document_number || ""}
              />
            </Form.Field>

            <Form.Field className="mb-3">
              <label htmlFor="">Asunto</label>
              <textarea rows="3"
                readOnly 
                value={current_tramite.asunto || ""}
              />
            </Form.Field>

            <Form.Field className="mb-3">
              <label htmlFor="">N° Folio</label>
              <input type="text"
                readOnly 
                value={current_tramite.folio_count || ""}
              />
            </Form.Field>

            <Form.Field className="mb-3">
              <label htmlFor="">Observación</label>
              <textarea rows="3"
                readOnly 
                value={current_tramite.observation || ""}
              />
            </Form.Field>

            <hr/>
            <i className="fas fa-file-alt"></i> Archivos
            <hr/>

            {/* archivos */}
            <Show condicion={current_tramite.files && current_tramite.files.length || false}>
              {current_tramite && current_tramite.files ? current_tramite.files.map((f, indexF) => 
                <a href={f.url} 
                  key={`list-file-${indexF}`} 
                  className="card card-body"
                  target="__blank"
                >
                  {f.name}
                </a>
              ): null}
            </Show>
          </div>
        </VerArchivo>
      </Show>
    </VerticalTimeline>
  );
};

export default TimeLine;
