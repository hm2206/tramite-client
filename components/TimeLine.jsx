import React, { Component } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Icon, Table } from 'semantic-ui-react';
import AddIcon from '@material-ui/icons/Add';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import CallMissedOutgoingRoundedIcon from '@material-ui/icons/CallMissedOutgoingRounded';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import VerArchivo from './VerArchivos';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ChatIcon from '@material-ui/icons/Chat';
import { tramite } from '../services/apis';
import Show from './show';
import moment from 'moment';

export default class Index extends Component {
    state = {
        show_file: false,
        tracking: []
    }

    componentDidMount = async () => {
        await this.getTracking(1);

    }

    getTracking = async (page = 1, up = true) => {
        this.props.setLoading(true);
        let { slug } = this.props.tramite;
        await tramite.get(`public/tramite/${slug}/tracking?page=${page}`)
            .then(async res => {
                this.props.setLoading(false);
                let { success, message, tracking } = res.data;
                if (!success) throw new Error(message);
                let { data, lastPage } = tracking;
                // setting tracking state
                this.setState(state => {
                    state.tracking = up ? [...state.tracking, ...data] : data;
                    return { tracking: state.tracking };
                });
                // validar siguiente request
                if (lastPage >= page + 1) this.getTracking(page + 1);
            })
            .catch(err => {
                this.props.setLoading(false);
                console.log(err.message)
            })


    }

    getMetadata = (status) => {
        let icons = {
            DERIVADO: { icon: <CallMissedOutgoingRoundedIcon style={ { color: '#fff' } } />, message: "La dependencia ha derivado el documento a: " },
            ACEPTADO: { icon: <CheckCircleOutlineOutlinedIcon fontSize="large" style={ { color: '#fff' } } />, message: "Fue Aceptado en: " },
            RECHAZADO: { icon: <CloseIcon style={ { color: '#fff' } } />, message: "" },
            ANULADO: { icon: <DeleteForeverIcon style={ { color: '#fff' } } />, message: "" },
            ENVIADO: { icon: <SendRoundedIcon style={ { color: '#fff' } } />, message: "" },
            FINALIZADO: { icon: <DoneAllIcon style={ { color: '#fff' } } />, message: "Puede ir a recoger su Documento en: " },
            RESPONDIDO: { icon: <ChatIcon style={ { color: '#fff' } } />, message: "La Oficina respondió a: ", name: "RESPUESTA" }

        };
        // response
        return icons[status] || {};
    }

    render() {
        let { tracking, show_file } = this.state;
        let { tramite } = this.props

        return (
            < VerticalTimeline >
                <VerticalTimelineElement

                    className="vertical-timeline-element--work"
                    date={ moment(tramite.created_at).lang('es').format('h:mm a') }
                    contentStyle={ { border: "2px solid rgb(0, 162, 138)", borderRadius: "20px" } }
                    contentArrowStyle={ { borderRight: '10px solid rgb(0, 162, 138)' } }
                    iconStyle={ { background: 'rgb(0, 162, 138)' } }
                    icon={ <SendRoundedIcon style={ { color: '#fff' } } /> }
                >
                    <h3 className="vertical-timeline-element-title">ENVIADO</h3>
                    <h4 className="vertical-timeline-element-subtitle">   Lugar de destino: <span className="badge badge-dark mr-1">{ `${tramite.dependencia && tramite.dependencia.nombre}`.toUpperCase() }</span></h4>


                    <p>
                        { moment(tramite.created_at).lang('es').format('LL') }
                    </p>
                </VerticalTimelineElement >
                {
                    tracking.map((e, iter) =>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            date={ moment(e.updated_at).lang('es').format('h:mm a') }
                            contentStyle={ { border: "2px solid rgb(0, 162, 138)", borderRadius: "20px" } }
                            contentArrowStyle={ { borderRight: '10px solid rgb(0, 162, 138)' } }
                            iconStyle={ { background: 'rgb(0, 162, 138)' } }

                            icon={ this.getMetadata(e.status).icon }

                        >
                            <h3 className="vertical-timeline-element-title">{ this.getMetadata(e.status).name || e.status }</h3>
                            <h4 className="vertical-timeline-element-subtitle">{ this.getMetadata(e.status).message }<span className="badge badge-dark">{ e && e.dependencia_destino && `${e.dependencia_destino.nombre}`.toUpperCase() }</span></h4>
                            <hr></hr>
                            { e && e.description }
                            <p><button className="btn btn-dark btn-sm" onClick={ (e) => this.setState({ show_file: true }) }>Ver Archivos</button></p>



                            <p>
                                { moment(e.updated_at).lang('es').format('LL') }
                            </p>
                        </VerticalTimelineElement>)
                }
                <Show condicion={ show_file }>
                    <VerArchivo header="Visualizador de archivos" onClose={ (e) => this.setState({ show_file: false }) } >
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                                    <Table.HeaderCell>Descargar</Table.HeaderCell>

                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { tracking.map((e, iter) =>
                                    <Table.Row>
                                        <Table.Cell>{ `${e.files}`.split('/').pop() }</Table.Cell>
                                        <Table.Cell>
                                            <a target="_blank" href={ e.files }>ver</a>
                                        </Table.Cell>

                                    </Table.Row>
                                ) }
                            </Table.Body>

                        </Table>
                    </VerArchivo>
                </Show>
            </VerticalTimeline >
        )
    }
}
