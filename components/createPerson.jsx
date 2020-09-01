import React, { Component } from 'react';
import { Form, Card, Button, Icon } from 'semantic-ui-react';
import { authentication } from '../services/apis';
import Swal from 'sweetalert2';
import Show from './show';

export default class CreatePerson extends Component {

    state = {
        is_search: true,
        enable_register: false,//habilita el boton de registrate
        documento: "",
        block: true,
        loading: false,
        document_types: [],
        departamentos: [],
        provincias: [],
        distritos: [],
        cod_dep: "",
        cod_pro: "",
        cod_dis: "",
        errors: {},
        //errorFind: false, //si encontro o no a la
        form: {
            condicion: false
        },

        enviado: false

    }

    componentDidMount = () => {
        this.getDocumentType();
        this.getDepartamentos();
        this.setState({
            block: true
        })

    }

    componentDidUpdate = async (prevProps, prevState) => {
        let { state, props } = this;
        if (prevState.cod_dep != state.cod_dep) await this.getProvincias(state.cod_dep);
        if (prevState.cod_pro != state.cod_pro) await this.getDistritos(state.cod_dep, state.cod_pro);
    }

    getDocumentType = async () => {
        await authentication.get('get_document_type')
            .then(res => this.setState({ document_types: res.data || [] }))
            .catch(err => console.log(err.message));
    }

    getDepartamentos = async () => {
        this.setState({ block: true });
        await authentication.get('badge')
            .then(res => this.setState({ departamentos: res.data }))
            .catch(err => console.log(err.message));
        this.setState({ block: false });
    }

    getProvincias = async (cod_dep) => {
        this.setState(state => {
            state.provincias = [];
            for (let dep of state.departamentos) {
                if (dep.cod_dep == cod_dep) {
                    state.provincias = dep.provincias;
                    break;
                }
            }
            // response
            return { provincias: state.provincias || [], cod_pro: state.cod_pro };
        });
    }

    getDistritos = async (cod_dep, cod_pro) => {
        let datos = await authentication.get(`get_distritos/${cod_dep}/${cod_pro}`)
            .then(res => res.data)
            .catch(err => []);
        this.setState({ distritos: datos });
    }

    handleSelect = async ({ name, value }) => {

        await this.setState({ [name]: value });


    }

    handleInput = async ({ name, value }, label = null) => {
        await this.setState(state => {
            state.form[name] = value;
            state.errors[name] = "";
            return { form: state.form, errors: state.errors };
        });
        // validaciones de los inputs
        this.val_empty({ name, value, label });
        this.validation({ name, value, label });
    }

    continuar = () => {
        let { onPass } = this.props;
        let { form } = this.state;
        if (typeof onPass == 'function') onPass(1, form)
    }

    setErrors = (name, message) => {
        this.setState(state => {
            state.errors[name] = [message];
            return { errors: state.errors };
        });
    }

    validation = ({ name, value, label }) => {
        let { document_type } = this.state.form;
        switch (name) {
            case 'document_number':
                if (document_type == "01") {//Dni
                    this.val_min({ name, value, label }, 8)
                    this.val_max({ name, value, label }, 8)
                }
                else {//Car Ext
                    this.val_min({ name, value, label }, 12)
                    this.val_max({ name, value, label }, 12)
                }
                this.val_number({ name, value, label });
                break;


            default:
                break;
        }
    }

    val_empty = ({ name, value, label }) => {
        if (!value) {
            this.setErrors(name, `El campo ${label} es obligatorio`)
            // response false 
            return false
        }
        // return  success
        return true;
    }

    val_number = ({ name, value, label }) => {
        if (!/^[0-9]+$/.test(value)) {
            this.setErrors(name, `El campo ${label} debe ser numérico`)
            return false;
        }
        return true;
    }

    val_min = ({ name, value, label }, num = 8) => {
        if (`${value}`.length < num) {
            this.setErrors(name, `El campo ${label} debe tener como mínimo ${num} caracteres`)
            return false;
        }
        return true;
    }

    val_max = ({ name, value, label }, num = 8) => {
        if (`${value}`.length > num) {
            this.setErrors(name, `El campo ${label} debe tener como máximo ${num} caracteres`)
            return false;
        }
        return true;
    }


    register = async () => {
        this.props.setLoading(true);
        let { state } = this;
        let form = Object.assign({}, state.form);//clona el form
        form.cod_dep = state.cod_dep
        form.cod_pro = state.cod_pro
        form.cod_dis = state.cod_dis
        console.log("hola")
        // send form
        await authentication.post('person', form)
            .then(async res => {
                this.props.setLoading(false);
                let { success, message, person } = res.data;
                if (!success) throw new Error(message);
                await Swal.fire({ icon: 'success', text: message });
                await this.setState({ form: person });
                this.continuar();
            })
            .catch(async err => {
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

    findPerson = async () => {
        this.props.setLoading(true);
        let { documento } = this.state;
        await authentication.get(`find_person/${documento}?type=document`)
            .then(async res => {
                this.props.setLoading(false);
                if (!Object.keys(res.data).length) throw new Error('No se encontró la persona');
                Swal.fire({ icon: 'success', text: 'Persona encontrada' })
                await this.setState({
                    enable_register: false,
                    is_search: false,
                    form: res.data,
                    block: true,
                    cod_dep: res.data.cod_dep,
                    errors: {}

                })
                // execute provincia
                await this.getProvincias(res.data.cod_dep);
                this.setState({ cod_pro: res.data.cod_pro });
                // execute distrito
                await this.getDistritos(res.data.cod_dep, res.data.cod_pro);
                this.setState({ cod_dis: res.data.cod_dis });

            })
            .catch(err => {
                this.props.setLoading(false);
                this.setState({ enable_register: true, is_search: true, form: {}, block: false, cod_dep: "", cod_pro: "", cod_dis: "" })
                Swal.fire({ icon: 'error', text: err.message })


            });
    }

    render() {

        let { form, block, loading, document_types, departamentos, provincias, distritos, errors } = this.state;

        return (
            <Card fluid>
                <Card.Header>
                    <div className="card-body">
                        <h3 className="">Regístro de Persona</h3>
                    </div>
                </Card.Header>
                <Card.Content>
                    <Form>
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <Form.Input
                                    icon={ <Icon name='search' inverted circular link onClick={ this.findPerson } disabled={ !this.state.documento } /> }
                                    placeholder='Ingrese su N° de Documento'
                                    name="documento"
                                    value={ this.state.documento }
                                    onChange={ (e, obj) => this.handleSelect(obj) }
                                />

                                <hr />
                            </div>

                            <div className="col-md-12 mt-4"></div>

                            <Show condicion={ this.state.enable_register && this.state.is_search }>
                                <div className="col-md-12 text-center">
                                    <Button basic className="bg"
                                        onClick={ (e) => this.setState({ is_search: false }) }
                                    >
                                        <i className="fas fa-plus"></i> Registrate
                                    </Button>
                                </div>
                            </Show>

                            <Show condicion={ !this.state.is_search }>
                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.document_type && errors.document_type[0] }>
                                        <label className="text-muted">Tip. Documento <b className="text-danger">*</b></label>
                                        <select name="document_type" value={ form.document_type || "" }
                                            onChange={ (e) => this.handleInput(e.target) }
                                            disabled={ loading || block }
                                        >
                                            <option value="">Seleccionar Tip. Documento</option>
                                            { document_types.map(ty =>
                                                <option value={ ty.value } key={ `docs-${ty.key}` }>{ ty.text }</option>
                                            ) }
                                        </select>
                                        <label>{ errors.document_type && errors.document_type[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.document_number && errors.document_number[0] }>
                                        <label className="text-muted">N° de Documento <b className="text-danger">*</b></label>
                                        <input type="text"
                                            name="document_number"
                                            value={ form.document_number || "" }
                                            onChange={ (e) => this.handleInput(e.target, "N° de Documento") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.document_number && errors.document_number[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.ape_pat && errors.ape_pat[0] }>
                                        <label className="text-muted">Apellido Paterno <b className="text-danger">*</b></label>
                                        <input type="text"
                                            name="ape_pat"
                                            value={ form.ape_pat || "" }
                                            onChange={ (e) => this.handleInput(e.target, "Apellido Paterno") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.ape_pat && errors.ape_pat[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.ape_mat && errors.ape_mat[0] }>
                                        <label className="text-muted">Apellido Materno <b className="text-danger">*</b></label>
                                        <input type="text"
                                            name="ape_mat"
                                            value={ form.ape_mat || "" }
                                            onChange={ (e) => this.handleInput(e.target, "Apellido Materno") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.ape_mat && errors.ape_mat[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <Form.Field error={ errors.name && errors.name[0] }>
                                        <label className="text-muted">Nombres <b className="text-danger">*</b></label>
                                        <input type="text"
                                            name="name"
                                            value={ form.name || "" }
                                            onChange={ (e) => this.handleInput(e.target, "Nombre") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.name && errors.name[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.date_of_birth && errors.date_of_birth[0] }>
                                        <label className="text-muted">Fecha de Nacimiento <b className="text-danger">*</b></label>
                                        <input type="date"
                                            name="date_of_birth"
                                            value={ form.date_of_birth || block }
                                            onChange={ (e) => this.handleInput(e.target, "Fecha de Nacimiento") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.date_of_birth && errors.date_of_birth[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.gender && errors.gender[0] }>
                                        <label className="text-muted">Género <b className="text-danger">*</b></label>
                                        <select name="gender"
                                            value={ form.gender || block }
                                            onChange={ (e) => this.handleInput(e.target, "Genero") }
                                            disabled={ loading || block }
                                        >
                                            <option value="">Seleccionar Género</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                            <option value="I">No Binario</option>
                                        </select>
                                        <label>{ errors.gender && errors.gender[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-12 mt-4">
                                    <hr />
                                    <h4><i className="fas fa-thumbtack"></i> Ubicación</h4>
                                    <hr />
                                </div>

                                <div className="col-md-12 mb-2">
                                    <Form.Field error={ errors.cod_dep && errors.cod_dep[0] }>
                                        <label className="text-muted">Departamento <b className="text-danger">*</b></label>
                                        <select name="cod_dep"
                                            value={ this.state.cod_dep || "" }
                                            onChange={ (e) => this.handleSelect(e.target, "Departamento") }
                                            disabled={ loading || block }
                                        >
                                            <option value="">Seleccionar Departamento</option>
                                            { departamentos.map(dep =>
                                                <option value={ dep.cod_dep }
                                                    key={ `dep-${dep.cod_dep}` }
                                                >
                                                    { dep.departamento }
                                                </option>
                                            ) }
                                        </select>
                                        <label>{ errors.ubigeo_id && errors.ubigeo_id[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.cod_pro && errors.cod_pro[0] }>
                                        <label className="text-muted">Provincia <b className="text-danger">*</b></label>
                                        <select name="cod_pro"
                                            value={ this.state.cod_pro || "" }
                                            onChange={ (e) => this.handleSelect(e.target, "Provincia") }
                                            disabled={ !this.state.cod_dep || loading || block }
                                        >
                                            <option value="">Seleccionar Provincias</option>
                                            { provincias.map(pro =>
                                                <option value={ pro.cod_pro }
                                                    key={ `pro-${pro.cod_pro}` }
                                                >
                                                    { pro.provincia }
                                                </option>
                                            ) }
                                        </select>
                                        <label>{ errors.cod_pro && errors.cod_pro[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.cod_dis && errors.cod_dis[0] }>
                                        <label className="text-muted">Distrito <b className="text-danger">*</b></label>
                                        <select name="cod_dis"
                                            value={ this.state.cod_dis || "" }
                                            onChange={ (e) => this.handleSelect(e.target, "Distrito") }
                                            disabled={ !this.state.cod_pro || loading || block }
                                        >
                                            <option value="">Seleccionar Distrito</option>
                                            { distritos.map(dis =>
                                                <option value={ dis.cod_dis }
                                                    key={ `dis-${dis.cod_dis}` }
                                                >
                                                    { dis.distrito }
                                                </option>
                                            ) }
                                        </select>
                                        <label>{ errors.cod_dis && errors.cod_dis[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <Form.Field error={ errors.address && errors.address[0] }>
                                        <label className="text-muted">Dirección <b className="text-danger">*</b></label>
                                        <input type="text"
                                            name="address"
                                            value={ form.address || "" }
                                            onChange={ (e) => this.handleInput(e.target, "Direccion") }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.address && errors.address[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-12 mt-4">
                                    <hr />
                                    <h4><i className="fas fa-phone-alt"></i> Contacto</h4>
                                    <hr />
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.email_contact && errors.email_contact[0] }>
                                        <label className="text-muted">Correo Electrónico <b className="text-danger">*</b></label>
                                        <input type="email"
                                            name="email_contact"
                                            value={ form.email_contact || "" }
                                            onChange={ (e) => this.handleInput(e.target) }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.email_contact && errors.email_contact[0] }</label>
                                    </Form.Field>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Form.Field error={ errors.phone && errors.phone[0] }>
                                        <label className="text-muted">Teléfono <b className="text-danger">*</b></label>
                                        <input type="tel"
                                            name="phone"
                                            value={ form.phone || "" }
                                            onChange={ (e) => this.handleInput(e.target) }
                                            disabled={ loading || block }
                                        />
                                        <label>{ errors.phone && errors.phone[0] }</label>
                                    </Form.Field>
                                </div>

                                <Form.Field className="col-md-12 mt-3">
                                    <Form.Checkbox label='Declaro bajo penalidad de perjurio, que toda la informacion proporcionada es correcta y verídica' toggle
                                        checked={ form.condicion || false }
                                        name="condicion"
                                        onChange={ (e, obj) => this.handleInput({ name: obj.name, value: obj.checked }) }
                                    />
                                </Form.Field>

                                <div className="col-md-12">
                                    <hr />
                                </div>

                                <div className="col-md-12 mt-4 text-right">
                                    <Show condicion={ block }>
                                        <Button className="btn-mas-info"
                                            disabled={ !form.condicion || loading }
                                            onClick={ this.continuar }
                                        >
                                            <i className="fas fa-arrow-right"></i> Continuar
                                    </Button>
                                    </Show>
                                    <Show condicion={ !block }>
                                        <Button className="btn-mas-info"

                                            onClick={ this.register }
                                        >
                                            <i className="fas fa-arrow-right"></i> Registrar
                                        </Button>
                                    </Show>
                                </div>
                            </Show>
                        </div>
                    </Form>
                </Card.Content>
            </Card>
        )
    }

}