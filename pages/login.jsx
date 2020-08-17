import React, { Component } from 'react';
import { Form, Card, Button } from 'semantic-ui-react';
import { recursoshumanos } from '../services/apis';
import Swal from 'sweetalert2';
import Show from '../components/show';
import Cookies from 'js-cookie';
import { GUEST } from '../services/auth';

export default class Login extends Component 
{

    static getInitialProps = async (ctx) => {
        await GUEST(ctx);
        let { query, pathname } = ctx;
        return { query, pathname };
    }

    state = {
        email: "",
        code: "",
        errors: {},
        block: false,
        time: 0
    }   

    componentDidMount = () => {
        this.config();
    }

    config = () => {
        this.setState((state, props) => {
            let { query } = props;
            state.email = query.email || state.email;
            return { email: state.email };
        })
    }

    handleInput = ({ name, value }) => {
        this.setState(state => {
            state.errors[name] = "";
            return { [name]: value }
        });
    }

    waitCode = async (seg) => {
        await this.setState({ time: seg })
        this.timer = setInterval(() => {
            let { time } = this.state;
            if (time > 0) {
                this.setState(state => ({ time:  state.time - 1 }));
            } else {
                clearInterval(this.timer);
            }
        }, 1000);
    }

    login = async () => {
        let { email } = this.state;
        this.props.setLoading(true);
        await recursoshumanos.post('public/login', { email })
        .then(res => {
            this.props.setLoading(false);
            let { success, message } = res.data;
            if (!success) throw new Error(message);
            Swal.fire({ icon: 'success', text: message });
            this.setState({ block: true });
            this.waitCode(30);
        }).catch(err => {
            try {
                this.props.setLoading(false);
                let response = JSON.parse(err.message);
                Swal.fire({ icon: 'warning', text: response.message });
                this.setState({ errors: response.errors });
            } catch (error) {
                Swal.fire({ icon: 'error', text: err.message });
            }
        });
    }

    handleCancel = async () => {
        this.setState({ time: 0, block: false, email: "" });
        clearInterval(this.timer);
    }

    verification = async () => {
        let { email, code } = this.state;
        this.props.setLoading(true);
        await recursoshumanos.post('public/verification', { email, code })
        .then(async res => {
            this.props.setLoading(false);
            let { success, message, token } = res.data;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message });
            await Cookies.set('convocatoria_token', token);
            history.go(`/my_postulacion`);
        }).catch(err => {
            try {
                this.props.setLoading(false);
                let response = JSON.parse(err.message);
                Swal.fire({ icon: 'warning', text: response.message });
                this.setState({ errors: response.errors });
            } catch (error) {
                Swal.fire({ icon: 'error', text: err.message });
            }
        });
    }

    render () {

        let { state, props } = this;

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Card fluid>
                            <Card.Header>
                                <div className="card-body text-center">
                                    <h3 className="">Iniciar Sesión</h3>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <div className="row mt-4 justify-content-center pb-5 mb-5">
                                        
                                        <div className="col-md-12 text-center">
                                            <div className="row justify-content-center">
                                                <div style={{ 
                                                    width: "150px", 
                                                    height: "150px", 
                                                    background: "rgba(0,0,0,.1)", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center",
                                                    borderRadius: "50%",
                                                    color: "#37474f"
                                                }}>
                                                    <i className="fas fa-user" style={{ fontSize: "4em" }}></i>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-10 mb-2 mt-3">
                                            <div className="row justify-content-center">
                                                <div className="col-md-12 mb-2">
                                                    <Form.Field error={state.errors.email && state.errors.email[0] || ""}>
                                                        <label className="text-muted">Correo Electrónico</label>
                                                        <input type="text"
                                                            name="email"
                                                            className="input-theme"
                                                            value={state.email || ""}
                                                            onChange={(e) => this.handleInput(e.target)}
                                                            disabled={state.block}
                                                            placeholder="ejemplo@entity.com"
                                                        />
                                                        <label htmlFor="">{state.errors.email && state.errors.email[0] || ""}</label>
                                                    </Form.Field>
                                                </div>
                                                
                                                <Show condicion={state.block}>
                                                    <div className="col-md-12 mb-2">
                                                        <Form.Field error={state.errors.code && state.errors.code[0] || ""}>
                                                            <label className="text-muted">Código</label>
                                                            <input type="text"
                                                                name="code"
                                                                className="input-theme"
                                                                value={state.code || ""}
                                                                onChange={(e) => this.handleInput(e.target)}
                                                                autoComplete="Off"
                                                                placeholder="000000"
                                                            />
                                                            <label htmlFor="">{state.errors.code && state.errors.code[0] || ""}</label>
                                                        </Form.Field>
                                                    </div>
                                                </Show>

                                                <div className="col-md-12 mb-2 text-right">
                                                    <Show condicion={!state.block}>
                                                        <Button
                                                            className="btn-convocatoria bg-theme"
                                                            disabled={!state.email}
                                                            onClick={this.login}
                                                        >
                                                            Generar Código
                                                        </Button>
                                                    </Show>

                                                    <Show condicion={state.block}>
                                                        <Show condicion={state.time}>
                                                            Volver a reenviar código en: {state.time} seg
                                                        </Show>
                                                        <Show condicion={!state.time}>
                                                            <a href="#" onClick={this.login}><u>Reenviar código</u></a>
                                                        </Show>
                                                    </Show>
                                                </div>

                                                <Show condicion={state.block}>
                                                    <div className="col-md-12 mb-2 text-right mt-3">
                                                        <Button
                                                            className="btn-cancel"
                                                            onClick={this.handleCancel}
                                                        >
                                                            Cancelar
                                                        </Button>

                                                        <Button
                                                            disabled={!state.code}
                                                            className="btn-convocatoria bg-theme"
                                                            onClick={this.verification}
                                                        >
                                                            Verificar
                                                        </Button>
                                                    </div>
                                                </Show>
                                            </div>
                                        </div>

                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

}