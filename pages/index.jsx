import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input } from "semantic-ui-react";
import Show from "../components/show";
import Router from "next/router";
import InfoTramite from "../components/infoTramite";
import { findTramite } from "../services/request/tramite";
import TimeLine from "../components/TimeLine";
import moment from "moment";

const Index = (props) => {
  const router = useRouter();
  const { query } = router;

  const [slug, setslug] = useState("");
  const [lenght, setlenght] = useState(0);
  const [success, setSuccess] = useState(false);
  const [tramite, setTramite] = useState({});
  const [trackings, setTrackings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.slug) {
      setslug(query.slug);
      setlenght(query.slug.length);
      fetchTramite(query.slug);
    }
  }, [query.slug]);

  const fetchTramite = async (slugParam) => {
    setLoading(true);
    const result = await findTramite(slugParam);
    setSuccess(result.success);
    setTramite(result.tramite || {});
    setTrackings(result.trackings || {});
    setLoading(false);
  };

  const handleSearch = () => {
    try {
      let newQuery = { ...query };
      newQuery.slug = slug;
      newQuery.lenght = lenght;
      newQuery.last_updated = moment().valueOf();
      Router.push({ pathname: location.pathname, query: newQuery });
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
              disabled={lenght < 10 || loading}
              onClick={(e) => handleSearch()}
              loading={loading}
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

export default Index;
