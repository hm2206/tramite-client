import React, { Fragment, useEffect, useState, useMemo } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { Form, Icon, Table, Loader, Button } from "semantic-ui-react";
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
import { getTimeline } from '../services/request/tramite';

moment().locale('es');

const options = {
  FILE: 'file[show]',
  INFO: 'info[show]',
  TRAMITE: 'tramite[show]',
};

const ItemLine = ({ tracking, onClick = null }) => {

  // props
  let { dependencia, person, tramite, info } = tracking;

  // estados
  const [option, setOption] = useState(false);

  // cambio de estado
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

  // obtener estado
  const current_status = getMetadata(tracking.status);

  // render
  return (
    <Fragment>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date={moment(tracking.updated_at).format("h:mm a")}
        contentStyle={{
          border: "2px solid rgb(0, 162, 138)",
          borderRadius: "20px",
        }}
        contentArrowStyle={{ borderRight: "10px solid rgb(0, 162, 138)" }}
        iconStyle={{ background: "rgb(0, 162, 138)" }}
        icon={current_status.icon}
      >
        <h3 className="vertical-timeline-element-title">
          {current_status.name || tracking.status}
        </h3>
        <h4 className="vertical-timeline-element-subtitle">
          {current_status.message}
          <span className="badge badge-dark">
            {dependencia && `${dependencia.nombre}`.toUpperCase()}
          </span>
        </h4>
        <hr></hr>
        {info && info.description || ""}

        <Show condicion={info && info.files && info.files.length || false}>
          <p>
            <button className="btn btn-dark btn-sm"
              onClick={(e) => setOption(options.FILE)}
            >
              Ver Archivos
            </button>
          </p>
        </Show>

        <p>{moment(tracking.updated_at).format("LL")}</p>

        <Show condicion={Object.keys(tramite || {}).length}>
            <button className="btn btn-outline-primary mt-2"
              onClick={(e) => typeof onClick == 'function' ? onClick(tramite) : null}
            >
                Información
            </button>
        </Show>
      </VerticalTimelineElement>

      {/* mostrar files */}
      <Show condicion={option == options.FILE}>
        <VerArchivo
          header="Visualizador de archivos del Seguimiento"
          onClose={() => setOption("")}
        >
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Descargar</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {info && 
                info.files && 
                info.files.map((f, i) => (
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
                )) || null}
            </Table.Body>
          </Table>
        </VerArchivo>
      </Show>
    </Fragment>
  )
}

const TimeLine = ({ tramite = {}, last_updated = null }) => {

  // estados
  const [current_loading, setCurrentLoading] = useState(false);
  const [option, setOption] = useState("");
  const [datos, setDatos] = useState([]);
  const [page, setPage] = useState(1);
  const [last_page, setLastPage] = useState(0);

  const fetchTimeline = async (add = false) => {
    setCurrentLoading(true);
    await getTimeline (tramite.slug, page)
    .then(res => {
      let { trackings } = res;
      setPage(trackings.page || 1);
      setLastPage(trackings.lastPage || 0);
      setDatos(add ? [...datos, ...trackings.data] : trackings.data);
    })
    .catch(err => console.log(err));
    setCurrentLoading(false);
  }

  const clearDatos = () => {
    setPage(1);
    setDatos([]);
    setLastPage(0);
  }

  const isNextPage = useMemo(() => {
    return last_page >= (page + 1);
  }, [datos]);

  useEffect(() => {
    if (tramite.id) fetchTimeline();
    return () => clearDatos();
  }, [tramite.id, last_updated]);

  useEffect(() => {
    if (page > 1) fetchTimeline(true);
  }, [page]);

  // render
  return (
    <>
      <VerticalTimeline>
        {datos?.map((track, iter) => (
          <ItemLine tracking={track}
            key={`list-line-${iter}`}
            onClick={(tra) => {
              setOption(options.TRAMITE)
              setCurrentTramite(tra);
            }}
          />
        ))}
        {/* mostra más información del tracking */}
        <Show condicion={option == options.TRAMITE}>
          <VerArchivo header="Información del trámite"
            onClose={(e) => setOption('')}
          >
            <div className="text-left">
              <Form.Field className="mb-3">
                <label htmlFor="">Dependencia Origen</label>
                <input className="capitalize" 
                  type="text" 
                  readOnly 
                  value={tramite.dependencia.nombre || "Exterior"}
                />
              </Form.Field>

              <Form.Field className="mb-3">
                <label htmlFor="">Tipo Documento</label>
                <input type="text" 
                  readOnly 
                  value={tramite.tramite_type.description || ""}
                />
              </Form.Field>

              <Form.Field className="mb-3">
                <label htmlFor="">N° Documento</label>
                <input type="text"
                  readOnly 
                  value={tramite?.document_number || ""}
                />
              </Form.Field>

              <Form.Field className="mb-3">
                <label htmlFor="">Asunto</label>
                <textarea rows="3"
                  readOnly 
                  value={tramite?.asunto || ""}
                />
              </Form.Field>

              <Form.Field className="mb-3">
                <label htmlFor="">N° Folio</label>
                <input type="text"
                  readOnly 
                  value={tramite?.folio_count || ""}
                />
              </Form.Field>

              <Form.Field className="mb-3">
                <label htmlFor="">Observación</label>
                <textarea rows="3"
                  readOnly 
                  value={tramite?.observation || ""}
                />
              </Form.Field>

              <hr/>
              <i className="fas fa-file-alt"></i> Archivos
              <hr/>

              {/* archivos */}
              <Show condicion={tramite?.files?.length || false}>
                {tramite?.files.map((f, indexF) => 
                  <a href={f.url} 
                    key={`list-file-${indexF}`} 
                    className="card card-body"
                    target="__blank"
                  >
                    {f.name}
                  </a>
                )}
              </Show>
            </div>
          </VerArchivo>
        </Show>
      </VerticalTimeline>
      {/* loading */}
      <Show condicion={current_loading}>
        <br /><br />
        <div className="mt-5 pt-5">
          <Loader active/>
        </div>
      </Show>
      {/* obtener más registros */}
      <Show condicion={isNextPage}>
          <Button className="mt-3" 
            onClick={() => setPage(prev => prev + 1)}
            color="black" 
            basic
          >
            <i className="fas fa-arrow-down"></i> Obtener más datos
          </Button>
      </Show>
    </>
  );
};

export default TimeLine;
