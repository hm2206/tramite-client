import React, { Component } from 'react';
import { Form, Button, List, Image } from 'semantic-ui-react';
import Router from 'next/dist/client/router';


export default class ListOferta extends Component
{

    go = async (slug) => {
        let { push, pathname } = Router;
        await push({ pathname: `/oferta/${slug}` });
    }

    render() {

        let { slug, titulo, fecha_inicio, estado, honorarios, money } = this.props;

        return (
            <List.Item>
                <List.Content floated='right'>
                    <Button className={`mt-2 ${estado == 'TERMINADO' ? 'btn-red' : 'btn-mas-info'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.go(slug);
                        }}
                    >
                        Más Información <i className="fas fa-arrow-right"></i>
                    </Button>
                </List.Content>
                <Image src='/img/base.png' size="mini" style={{ height: "100px", width: "100px" }}/>
                <List.Content>
                    <List.Header as='a'>
                    <h3>{titulo || "Nombre"}</h3>
                    </List.Header>
                    <List.Content>
                        <div className="row">
                            {/* <div className="col-md-12 mt-1">
                                <b className="text-muted">
                                    <i className="fas fa-thumbtack"></i> Sede:
                                </b>
                            </div> */}
                            {/* <div className="col-md-12 mt-1">
                                <b className="text-muted">
                                    <i className="fas fa-building"></i> Dependencia/Oficina: {dependencia}
                                </b>
                            </div> */}
                            <div className="col-md-12 mt-1">
                                <b className="text-muted">
                                    <i className="fas fa-briefcase"></i> Perfil Laboral: {titulo}
                                </b>
                            </div>
                            <div className="col-md-12 mt-1">
                                <b className="text-muted">
                                    <i className="fas fa-coins"></i> Honorarios: {money} {honorarios}
                                </b>
                            </div>
                            <div className="col-md-12 mt-1">
                                <b className="text-muted">
                                    <i className="fas fa-clock"></i> F. Inicio: {fecha_inicio}
                                </b>
                            </div>
                        </div>
                    </List.Content>
                </List.Content>
            </List.Item>
        )
    }

}