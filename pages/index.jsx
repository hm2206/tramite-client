import React, { Component, useEffect, useState } from "react";
import { Form, Button, Input, Image } from "semantic-ui-react";
import Show from "../components/show";
import Router from "next/router";
import InfoTramite from "../components/infoTramite";
import Swal from "sweetalert2";
import { findTramite, codigo_qr } from "../services/request/tramite";
import dynamic from "next/dynamic";
import TimeLine from "../components/TimeLine";

const index = (props) => {
  let { success, tramite, trackings, query } = props;
  const [slug, setslug] = useState(query.slug || "");
  const [lenght, setlenght] = useState(0);
  const [img, setimg] = useState("");

  useEffect(() => {
    if (query.slug) {
      setting();
      message(success);
    }
    setslug(query.slug || "");
  }, [query.slug]);

  const message = async (success) => {
    if (success) {
      await Swal.fire({ text: "Tramite encontrado", icon: "success" });
    } else {
      await Swal.fire({ text: "Tramite no encontrado", icon: "error" });
    }
  };
  
  const setting = async () => {
    setimg(await codigo_qr(query.slug));
    setslug((props.query && props.query.slug) || slug);
    setlenght(await parseFloat((props.query && props.query.lenght) || lenght));
  };

  const handleSearch = () => {
    try {
      let { push, query } = Router;
      query.slug = slug;
      query.lenght = lenght;
      push({ pathname: location.pathname, query });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = ({ value }) => {
    setslug(value);
    setlenght(value.length);
  };

  return (
    <div className="container mt-5">
      <Form>
        <div className="row ">
          <div className="col-md-9 col-12 mb-1">
            <Input
              placeholder="Ingrese Codigo de Tramite"
              fluid
              className="select-convocatoria"
              name="slug"
              value={slug || ""}
              onChange={(e, obj) => handleInput(obj)}
            />
          </div>
          <div className="col-md-3 mb-1">
            <Button
              className="btn-convocatoria"
              fluid
              disabled={lenght < 10}
              onClick={(e) => handleSearch()}
            >
              <i className="fas fa-search"></i> Buscar
            </Button>
          </div>

          <Show condicion={success}>
            <div className="col-md-12  text-center ">
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <InfoTramite tramite={tramite} />
                </div>

                <div className="col-md-3 col-lg-2 mt-4 col-6">
                  <img
                    src={img || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="col-md-12 mt-4">
                  <TimeLine trackings={trackings} {...props} />
                </div>
              </div>
            </div>
          </Show>
        </div>
      </Form>
    </div>
  );
};

index.getInitialProps = async (ctx) => {
  let { query, pathname } = ctx;
  let { tramite, success, trackings } = await findTramite(ctx);
  return { query, pathname, tramite, trackings, success };
};

export default index;
