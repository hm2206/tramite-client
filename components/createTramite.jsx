import React, { Component } from 'react';
import { Button, Form, TextArea, Card, FormField } from 'semantic-ui-react';
import { authentication, tramite } from '../services/apis';
import Swal from 'sweetalert2';
import Show from '../components/show';
import Router from 'next/router';
import DropZone from '../components/dropzone';

class CreateTramite extends Component {

    state = {
        entities: [],
        dependencias: [],
        tramite_types: [],
        errors: {},
        file: { size: 0, data: [] },
        form: {
            entity_id: "",
            dependencia_id: "",
            document_number: "",
            tramite_type_id: "",
            folio_count: "",
            asunto: "",
            termino: false
        }
    }

    componentDidMount = async () => {
        this.props.setLoading(true);
        await this.getEntity();
        await this.getTypeDocument();
        this.props.setLoading(false);
    }

    handleInput = async ({ name, value }) => {
        await this.setState(state => {
            state.form[name] = value;
            state.errors[name] = [];
            return { form: state.form, errors: state.errors }
        });
        // handle change
        this.listenerChange({ name, value });
    }

    handleFiles = ({ files }) => {
        let { file } = this.state;
        let size_total = file.size;
        let size_limit = 2 * 1024;
        for (let f of files) {
            size_total += f.size;
            if ((size_total / 1024) <= size_limit) {
                this.setState(state => {
                    state.file.size += size_total;
                    state.file.data.push(f);
                    return { file: state.file }
                });
            } else {
                Swal.fire({ icon: 'error', text: `El limíte máximo es de 2MB, tamaño actual(${(size_total / (1024 * 1024)).toFixed(2)} MB` })
            }
        }
        return false;
    }

    setErrors = ({ name, message }) => {
        this.setState(state => {
            state.errors[name] = [message];
            return { errors: state.errors }
        });
    }

    handleFile = async ({ name, files = [] }) => {

        if (files && files.length) {
            let formats = ['docx', 'pdf'];
            let limite_size = 1 * 1024;
            let current_size = this.state.form.files.size || 0;
            for (let file of files) {
                let filename = file.name;
                current_size += file.size;
                // validar peso
                if (limite_size >= (current_size / 1024)) {
                    //validar formato
                    if (formats.includes(`${filename}`.split('.').pop())) {
                        //validar nombre del archivo
                        if (!this.fileExists(name, file.name)) {
                            this.setState(state => {
                                state.form[name].data.push(file);
                                state.form[name].size = current_size;
                                state.errors[name] = [];
                                return { form: state.form, errors: state.errors }
                            });
                        } else this.setErrors({ name, message: `El archivo "${file.name}" ya está agregrado` })
                    } else this.setErrors({ name, message: `El formato es incorrecto, solo *.docx y *.pdf` })
                } else this.setErrors({ name, message: `El archivo debe pesar como máximo 4MB` })
            }
        }
        // eliminar memoria del input file
        let selectFile = document.getElementById(name);
        selectFile.value = null;
    }

    fileExists = (name, nameFile) => {
        let { data } = this.state.form[name];
        for (let file of data) {
            if (file.name == nameFile) return true;
        }
        // response
        return false;
    }

    listenerChange = async ({ name, value }) => {
        switch (name) {
            case 'entity_id':
                await this.getDependencia(value);
                break;
            default:
                break;
        }
    }

    getEntity = async (page = 1) => {
        await authentication.get(`entity?page=${page}`)
            .then(async res => {
                let { lastPage, data } = res.data;
                let newData = [];
                await data.filter(async d => await newData.push({
                    key: `entity-${d.id}`,
                    value: d.id,
                    text: `${d.name}`.toUpperCase()
                }));
                // setting state
                await this.setState(state => ({
                    entities: [...state.entities, ...newData]
                }));
                // validar para volver a traer más datos
                if (lastPage > page + 1) await this.getEntity(page + 1);
            })
            .catch(err => console.log(err.message));

    }

    getDependencia = async (entity_id, page = 1) => {
        if (entity_id) {
            this.props.setLoading(true);
            await tramite.get(`public/dependencia/${entity_id}?page=${page}`)
                .then(async res => {
                    let { success, message, dependencia } = res.data;
                    if (!success) throw new Error(message);
                    // setting dependencias
                    let { lastPage, data } = dependencia;
                    let newData = [];
                    await data.filter(async d => await newData.push({
                        key: `dependencia-${d.id}`,
                        value: d.id,
                        text: `${d.nombre}`.toUpperCase()
                    }));

                    // setting state
                    await this.setState(state => ({
                        dependencias: [...state.dependencias, ...newData]
                    }));
                    // validar para volver a traer más datos
                    if (lastPage > page + 1) await this.getDependencia(page + 1);
                })
                .catch(err => console.log(err.message));
            this.props.setLoading(false);
        } else this.setState({ dependencias: [] });
    }

    getTypeDocument = async (page = 1) => {
        await tramite.get(`tramite_type?page=${page}`)
            .then(async res => {
                let { success, message, tramite_type } = res.data;
                if (!success) throw new Error(message);
                // setting dependencias
                let { lastPage, data } = tramite_type;
                let newData = [];
                await data.filter(async d => await newData.push({
                    key: `tramite_type-${d.id}`,
                    value: d.id,
                    text: `${d.description}`.toUpperCase()
                }));
                // setting state

                await this.setState(state => ({
                    tramite_types: [...state.tramite_types, ...newData]
                }));
                // validar para volver a traer más datos
                if (lastPage > page + 1) await this.getTypeDocument(page + 1);
            })
            .catch(err => console.log(err.message));
    }

    generateCode = async () => {
        let { person } = this.props;
        this.handleInput({ name: 'code', value: "" });
        this.props.setLoading(true);
        await tramite.post('code_verify', {
            person_id: person.id || "_error"
        }).then(async res => {
            this.props.setLoading(false);
            let { success, message } = res.data;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message });
        }).catch(async err => {
            this.props.setLoading(false);
            await Swal.fire({ icon: 'error', text: 'No se pudo generar el código' })
        });
    }

    deleteFile = (index, file) => {
        this.setState(state => {
            state.file.data.splice(index, 1);
            state.file.size = state.file.size - file.size;
            return { file: state.file };
        });
    }

    saveTramite = async () => {
        this.props.setLoading(true);
        let { person } = this.props;
        let { form, file } = this.state;
        let data = new FormData;
        // data person
        data.append('person_id', person.id);
        // datos
        for (let attr in form) {
            if (attr != 'files') data.append(attr, form[attr])
        }
        // add files
        file.data.filter(f => data.append('files', f));
        // send data
        await tramite.post('public/tramite', data)
            .then(async res => {
                this.props.setLoading(false);
                let { success, message, tramite } = res.data;
                if (!success) throw new Error(message);
                await Swal.fire({ icon: 'success', text: message });
                let { push } = Router;
                push({ pathname: '/', query: { slug: tramite.slug } })
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

    formValidation = () => {
        let { form } = this.state;
        for (let attr in form) {
            if (!form[attr]) return false;
        }
        // reponse default
        return true;
    }

    render() {

        let { form, dependencias, tramite_types, errors, file } = this.state;

        return (
            <Card fluid>
                <Card.Header>
                    <div className="card-body">
                        <h3 className="">Regístro de Tramite</h3>
                    </div>
                </Card.Header>
                <Card.Content>
                    <Form >
                        <div className="form-group row">
                            <Form.Field className="col-md-12" error={ errors.entity_id && errors.entity_id[0] || "" }>
                                <label for="c_fname">Código de Verificación <span className="text-danger">*</span></label>
                                <div className="row">
                                    <div className="col-md-10">
                                        <input
                                            placeholder="Ingrese el código de 8 cífras"
                                            value={ form.code || "" }
                                            name="code"
                                            onChange={ (e) => this.handleInput(e.target) }
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <button className="btn btn-success btn-sm"
                                            onClick={this.generateCode}
                                        >
                                            <i className="fas fa-sync"></i>
                                        </button>
                                    </div>
                                </div>
                                <label htmlFor="">{ errors.entity_id && errors.entity_id[0] || "" }</label>
                            </Form.Field>

                            <Form.Field className="col-md-12" error={ errors.entity_id && errors.entity_id[0] || "" }>
                                <label for="c_fname">Entidad <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione la Entidad"
                                    options={ this.state.entities }
                                    value={ form.entity_id || "" }
                                    name="entity_id"
                                    onChange={ (e, obj) => this.handleInput(obj) }
                                />
                                <label htmlFor="">{ errors.entity_id && errors.entity_id[0] || "" }</label>
                            </Form.Field>
                            <Form.Field className="col-md-6" error={ errors.dependencia_id && errors.dependencia_id[0] || "" }>
                                <label for="c_fname">Destino del Documento <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione la Procedencia"
                                    name="dependencia_id"
                                    options={ dependencias }
                                    value={ form.dependencia_id || "" }
                                    onChange={ (e, obj) => this.handleInput(obj) }
                                />
                                <label htmlFor="">{ errors.dependencia_id && errors.dependencia_id[0] || "" }</label>
                            </Form.Field>
                            <Form.Field className="col-md-6" error={ errors.tramite_type_id && errors.tramite_type_id[0] || "" } >
                                <label for="c_fname">Tipo del Documento <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione el Tipo de Documento"
                                    options={ tramite_types }
                                    name="tramite_type_id"
                                    value={ form.tramite_type_id || "" }
                                    onChange={ (e, obj) => this.handleInput(obj) }
                                />
                                <label htmlFor="">{ errors.tramite_type_id && errors.tramite_type_id[0] || "" }</label>
                            </Form.Field>
                            <Form.Field className="col-md-6" error={ errors.document_number && errors.document_number[0] || "" } >
                                <label for="c_fname">N° Documento <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="document_number"
                                    value={ form.document_number || "" }
                                    onChange={ (e) => this.handleInput(e.target) }
                                />
                                <label>{ errors.document_number && errors.document_number[0] || "" }</label>
                            </Form.Field>
                            <Form.Field className="col-md-6" error={ errors.folio_count && errors.folio_count[0] || "" }>
                                <label for="c_fname">N° Folios <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="folio_count"
                                    value={ form.folio_count || "" }
                                    onChange={ (e) => this.handleInput(e.target) }
                                />
                                <label>{ errors.folio_count && errors.folio_count[0] || "" }</label>
                            </Form.Field>
                            <Form.Field className="col-md-12" error={ errors.asunto && errors.asunto[0] || "" }>
                                <label for="c_fname">Asunto del Tramite <span className="text-danger">*</span></label>
                                <TextArea
                                    type="text"
                                    name="asunto"
                                    value={ form.asunto || "" }
                                    onChange={ (e) => this.handleInput(e.target) }
                                />
                                <label>{ errors.asunto && errors.asunto[0] || "" }</label>
                            </Form.Field>

                            <Form.Field className="col-md-12">
                                <DropZone id="files"
                                    name="files"
                                    onChange={ (e) => this.handleFiles(e) }
                                    icon="save"
                                    result={ file.data }
                                    title="Select. Archivo (*.docx, *.pdf)"
                                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onDelete={ (e) => this.deleteFile(e.index, e.file) }
                                />
                            </Form.Field>

                            <Form.Field className="col-md-12">
                                <Form.Checkbox label='Declaro bajo penalidad de perjurio, que toda la informacion proporcionada es correcta y verídica' toggle
                                    checked={ form.termino || false }
                                    name="termino"
                                    onChange={ (e, obj) => this.handleInput({ name: obj.name, value: obj.checked }) }
                                />
                            </Form.Field>

                        </div>

                        <div className="form-group row">
                            <div className="col-lg-12 text-right">

                                <hr />

                                <Button color="teal"
                                    onClick={ this.saveTramite }
                                    disabled={ !this.formValidation() }
                                >
                                    Registrar
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card.Content >
            </Card >

        )
    }
}




export default CreateTramite