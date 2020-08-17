import React, { Component, Fragment } from 'react';
import { Table } from 'semantic-ui-react';

export default class infoTramite extends Component {
    render() {

        return (
            <Fragment>

                <div className="col" >
                    <Table className="mt-5" celled >
                        <Table.Header >
                            <Table.Row >
                                <Table.HeaderCell style={ { background: '#00a28a', color: '#fff', textAlign: 'center' } } colSpan="2"><i className="fas fa-male"></i>  Datos del Remitente</Table.HeaderCell>


                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row >
                                <Table.Cell width="5"><i className="fas fa-passport"></i> Tipo de Documento</Table.Cell>
                                <Table.Cell>Dni</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="far fa-id-card" style={ { textAlign: "left" } }></i> Nro de Documento</Table.Cell>
                                <Table.Cell>75831335</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="far fa-user"></i> Nombres y Apellidos
                                    </Table.Cell>
                                <Table.Cell>Jean Flores Alvarez</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="fas fa-map-marker-alt"></i> Direccion</Table.Cell>
                                <Table.Cell>av union mz b lt 5</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell className="text-left"><i className="fas fa-inbox " ></i> E-Mail</Table.Cell>
                                <Table.Cell>jeanflores@gmail.com</Table.Cell>

                            </Table.Row>

                        </Table.Body>

                    </Table>

                </div>

                <div className="col">
                    <Table celled className="mt-5 ">
                        <Table.Header>
                            <Table.Row >
                                <Table.HeaderCell style={ { background: '#00a28a', color: '#fff', textAlign: 'center' } } colSpan="2"><i className="fas fa-file-pdf"></i>  Datos del Documento</Table.HeaderCell>


                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row >
                                <Table.Cell width="5"><i className="fas fa-passport "></i> Tipo Documento</Table.Cell>
                                <Table.Cell>Carta</Table.Cell>

                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><i className="fas fa-file-pdf"></i> Nro Documento</Table.Cell>
                                <Table.Cell>0001</Table.Cell>

                            </Table.Row>
                            <Table.Row >
                                <Table.Cell><i className="far fa-comment-dots"></i> Asunto</Table.Cell>
                                <Table.Cell>Esto es un asunto de prueba</Table.Cell>
                            </Table.Row>
                        </Table.Body>

                    </Table >

                </div >





            </Fragment >



        )
    }
}
