import React, { Component } from 'react';
import { Button, Form, TextArea, Card } from 'semantic-ui-react';
import { authentication } from '../services/apis';


const countryOptions = [
    { key: 'af', value: 'af', text: 'Afghanistan' },
    { key: 'ax', value: 'ax', text: 'Aland Islands' },
    { key: 'al', value: 'al', text: 'Albania' },
    { key: 'dz', value: 'dz', text: 'Algeria' },
    { key: 'as', value: 'as', text: 'American Samoa' },
    { key: 'ad', value: 'ad', text: 'Andorra' },
    { key: 'ao', value: 'ao', text: 'Angola' },
    { key: 'ai', value: 'ai', text: 'Anguilla' },
    { key: 'ag', value: 'ag', text: 'Antigua' },
    { key: 'ar', value: 'ar', text: 'Argentina' },
    { key: 'am', value: 'am', text: 'Armenia' },
    { key: 'aw', value: 'aw', text: 'Aruba' },
    { key: 'au', value: 'au', text: 'Australia' },
    { key: 'at', value: 'at', text: 'Austria' },
    { key: 'az', value: 'az', text: 'Azerbaijan' },
    { key: 'bs', value: 'bs', text: 'Bahamas' },
    { key: 'bh', value: 'bh', text: 'Bahrain' },
    { key: 'bd', value: 'bd', text: 'Bangladesh' },
    { key: 'bb', value: 'bb', text: 'Barbados' },
    { key: 'by', value: 'by', text: 'Belarus' },
    { key: 'be', value: 'be', text: 'Belgium' },
    { key: 'bz', value: 'bz', text: 'Belize' },
    { key: 'bj', value: 'bj', text: 'Benin' },
];

class CreateTramite extends Component {

    state = {
        entities: []

    }

    componentDidMount = () => {
        this.getEntity();
    }
    validarRegistro() {
        console.log("diste click")
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

    render() {
        return (
            <Card fluid>
                <Card.Header>
                    <div className="card-body">
                        <h3 className="">Regístro de Persona</h3>
                    </div>
                </Card.Header>
                <Card.Content>
                    <Form>
                        <div className="form-group row">
                            <Form.Field className="col-md-12" >
                                <label for="c_fname">Entidad <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione la Entidad"
                                    options={ this.state.entities }
                                />
                            </Form.Field>
                            <Form.Field className="col-md-6" >
                                <label for="c_fname">Destino del Documento <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione la Procedencia"
                                    options={ countryOptions }
                                />
                            </Form.Field>
                            <Form.Field className="col-md-6" >
                                <label for="c_fname">Tipo del Documento <span className="text-danger">*</span></label>
                                <Form.Select
                                    placeholder="Seleccione el Tipo de Documento"

                                />
                            </Form.Field>
                            <Form.Field className="col-md-6" >
                                <label for="c_fname">N° Documento <span className="text-danger">*</span></label>
                                <input type="text" name="" />
                            </Form.Field>
                            <Form.Field className="col-md-6" >
                                <label for="c_fname">N° Folios <span className="text-danger">*</span></label>
                                <input type="text" name="" />
                            </Form.Field>
                            <Form.Field className="col-md-12" >
                                <label for="c_fname">Asunto del Tramite <span className="text-danger">*</span></label>
                                <TextArea type="text" name="" />
                            </Form.Field>
                            <Form.Field className="col-md-12" >
                                <label for="c_fname">Adjuntar Documento <span className="text-danger">*</span></label>
                                <label htmlFor="adjuntar" className="ui button">
                                    <input type="file" id="adjuntar" name="file" hidden />
                                    <i className="fas fa-upload"></i> Adjuntar Documento
                                    </label>
                            </Form.Field>
                            <Form.Field className="col-md-12">
                                <Form.Checkbox label='Declaro bajo penalidad de perjurio, que toda la informacion proporcionada es correcta y verídica' toggle />
                            </Form.Field>

                        </div>

                        <div className="form-group row">
                            <div className="col-lg-12 text-right">

                                <hr />

                                <Button color="teal" onClick={ () => this.validarRegistro() }>
                                    Registrar
                            </Button>
                            </div>
                        </div>
                    </Form>
                </Card.Content>
            </Card>

        )
    }
}




export default CreateTramite