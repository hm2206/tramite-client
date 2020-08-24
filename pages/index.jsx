import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import Show from '../components/show';
import Router from 'next/router';
import InfoTramite from '../components/infoTramite'
import TimeLine from '../components/timeLime';
import { findTramite } from '../services/request/tramite';



export default class Index extends Component {

    static getInitialProps = async (ctx) => {
        let { query, pathname } = ctx;
        let { tramite, success } = await findTramite(ctx);
        return { query, pathname, tramite, success };
    }

    state = {
        slug: ""
    };

    componentDidMount = () => {
        this.setting();
    }

    setting = () => {
        this.setState((state, props) => ({
            slug: props.query && props.query.slug || state.slug
        }));
    }

    handleSearch = () => {
        let { push, pathname, query } = Router;
        query.slug = this.state.slug;
        push({ pathname, query });
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value })
    }

    render() {

        let { slug } = this.state;
        let { success, tramite } = this.props;

        return (

            <div className="container mt-5">
                <Form>
                    <div className="row">
                        <div className="col-md-9 col-12 mb-1">
                            <Input placeholder='Ingrese Codigo de Tramite'
                                fluid className="select-convocatoria"
                                name="slug"
                                value={ slug }
                                onChange={ (e, obj) => this.handleInput(obj) }
                            />
                        </div>
                        <div className="col-md-3 mb-1">
                            <Button className="btn-convocatoria" fluid
                                onClick={ (e) => this.handleSearch() }
                            >
                                <i className="fas fa-search"></i> Buscar
                            </Button>
                        </div>
                        <Show condicion={ success }>
                            <div className="col-md-12  text-center ">
                                <div className="row">
                                    <InfoTramite tramite={ tramite } />
                                    <div className="col-md-12 mt-4">
                                        <TimeLine tramite={ tramite } { ...this.props } />
                                    </div>
                                </div>
                            </div>

                        </Show>

                    </div>
                </Form>
            </div>
        )
    }

}