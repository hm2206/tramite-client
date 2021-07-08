import React, { useEffect, useState } from "react";
import { Form, Button, Input } from "semantic-ui-react";
import Show from "../components/show";
import Router from "next/router";
import InfoTramite from "../components/infoTramite";
import { findTramite } from "../services/request/tramite";
import TimeLine from "../components/TimeLine";
import moment from "moment";

const index = (props) => {
  let { success, tramite, trackings, query } = props;
  const [slug, setslug] = useState(query.slug || "");
  const [lenght, setlenght] = useState(0);

  useEffect(() => {
    if (query.slug) {
      setting();
    }

    setslug(query.slug || "");
  }, [query.slug]);
  
  const setting = async () => {
    setslug((props.query && props.query.slug) || slug);
    setlenght(await parseFloat((props.query && props.query.lenght) || lenght));
  };

  const handleSearch = () => {
    try {
      let { push, query } = Router;
      query.slug = slug;
      query.lenght = lenght;
      query.last_updated = moment().valueOf();
      push({ pathname: location.pathname, query });
    } catch (error) {}
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
                    src={tramite?.code_qr || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="col-md-12 mt-4">
                  <TimeLine tramite={tramite} last_updated={query?.last_updated} {...props} />
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
