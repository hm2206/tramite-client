import React, { Component, Fragment } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import VerArchivos from './VerArchivos';
import { tramite } from '../services/apis';
import Show from './show';
export default class infoTramite extends Component {

    state = {
        show_file: false
    }
    /* getFiles = async (page = 1) => {
         await tramite.get().then(
 
         ).catch(err => console.log(err.message)
         )
 
}
*/

    render() {

        let { tramite } = this.props;
        let { files } = this.props.tramite;

        let { show_file } = this.state;

        return (
            <div className="row">
                <div className="col-md-6" >
                    <Table className="mt-5" celled >
                        <Table.Header >
                            <Table.Row >
                                <Table.HeaderCell style={ { background: '#00a28a', color: '#fff', textAlign: 'center' } } colSpan="2">
                                    <i className="fas fa-male"></i>  Datos del Remitente
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row >
                                <Table.Cell width="5"><i className="fas fa-passport"></i> Tipo de Documento</Table.Cell>
                                <Table.Cell>{ tramite && tramite.person && tramite.person.document_type_text }</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="far fa-id-card" style={ { textAlign: "left" } }></i> Nro de Documento</Table.Cell>
                                <Table.Cell>{ tramite && tramite.person && tramite.person.document_number }</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="far fa-user"></i> Nombres y Apellidos
                                    </Table.Cell>
                                <Table.Cell>{ tramite && tramite.person && tramite.person.fullname }</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="fas fa-map-marker-alt"></i> Direccion</Table.Cell>
                                <Table.Cell>{ tramite && tramite.person && tramite.person.address }</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell className="text-left"><i className="fas fa-inbox " ></i> E-Mail</Table.Cell>
                                <Table.Cell>{ tramite && tramite.person && tramite.person.email_contact }</Table.Cell>

                            </Table.Row>

                        </Table.Body>

                    </Table>

                </div>

                <div className="col-md-6">
                    <Table celled className="mt-5 ">
                        <Table.Header>
                            <Table.Row >
                                <Table.HeaderCell style={ { background: '#00a28a', color: '#fff', textAlign: 'center' } } colSpan="2"><i className="fas fa-file-pdf"></i>  Datos del Documento</Table.HeaderCell>


                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row >
                                <Table.Cell width="5"><i className="fas fa-passport "></i> Entidad</Table.Cell>
                                <Table.Cell className="capitalize">{ tramite && tramite.entity && tramite.entity.name }</Table.Cell>
                            </Table.Row>

                            <Table.Row >
                                <Table.Cell width="5"><i className="fas fa-passport "></i> Tipo Documento</Table.Cell>
                                <Table.Cell>{ tramite && tramite.tramite_type && tramite.tramite_type.description }</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="fas fa-file-pdf"></i> Nro Documento</Table.Cell>
                                <Table.Cell>{ tramite && tramite.document_number }</Table.Cell>

                            </Table.Row>
                            <Table.Row >
                                <Table.Cell><i className="far fa-comment-dots"></i> Asunto</Table.Cell>
                                <Table.Cell>{ tramite && tramite.asunto }</Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.Cell><i className="far fa-file-alt"></i> Archivo</Table.Cell>
                                <Table.Cell>
                                    <button className="btn btn-dark btn-sm" onClick={ (e) => this.setState({ show_file: true }) }>Ver Archivos</button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>


                    </Table >

                </div >

                <Show condicion={ show_file }>
                    <VerArchivos header="Visualizador de archivos" onClose={ (e) => this.setState({ show_file: false }) } >
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                                    <Table.HeaderCell>Descargar</Table.HeaderCell>

                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                { files.map((e, iter) =>
                                    <Table.Row>
                                        <Table.Cell>{ `${e}`.split('/').pop() }</Table.Cell>
                                        <Table.Cell>
                                            <a target="_blank" href={ e }>ver</a>
                                        </Table.Cell>

                                    </Table.Row>
                                ) }
                            </Table.Body>
                        </Table>
                    </VerArchivos>
                </Show>
            </div >



        )
    }
}
