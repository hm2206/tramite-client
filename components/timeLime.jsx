import React, { Component, Fragment } from 'react';
import Show from '../components/show';
import moment from 'moment';
import { tramite } from '../services/apis';


export default class TimeLime extends Component {
    state = {
        tracking: []
    }

    componentDidMount = async () => {
        await this.getTracking(1);
        console.log(this.state.tracking)
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

    ImprimirEstado = (state) => {

        let { tramite } = this.props;
        switch (state) {
            case 1:
                return (
                    < div className="timeline-body">
                        Su trámite ha sido Enviado a <b>{ tramite && tramite.dependencia && tramite.dependencia.nombre }</b>
                    </div>)
                break;
            case 2:
                return (
                    < div className="timeline-body">
                        Su trámite ha sido Aceptado en <b>{ tramite && tramite.dependencia && tramite.dependencia.nombre }</b>
                    </div>)
                break;
            case 3:
                return (
                    < div className="timeline-body">
                        Su trámite ha sido Rechazado en <b>{ tramite && tramite.dependencia && tramite.dependencia.nombre }</b>
                    </div>)
                break;


        }

    }
    render() {

        let { tracking } = this.state;
        let { tramite } = this.props

        return (
            <Fragment>
                <div className="card card-primary">
                    <div className="card-header" style={ { background: '#00a28a', color: '#fff' } }>
                        <h3 className="card-title" ><b>Seguimiento Trámite</b></h3>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="timeline">
                                    <div id="div_historial">
                                        <div className="time-label text-left">
                                            <span className="bg-red">Fecha Inicio: { moment(tramite.created_at).lang('es').format('LL') }</span>
                                        </div>
                                        <div>
                                            <i className="far fa-arrow-alt-circle-right"></i>
                                            <div className="timeline-item">
                                                <span className="time">
                                                    { moment(tramite.created_at).format('LT') }&nbsp;
                                                    <i className="fas fa-clock"></i>
                                                </span>
                                                <h3 className="timeline-header">{ moment(tramite.created_at).lang('es').format('LL') }</h3>
                                                < div className="timeline-body">
                                                    Su trámite ha sido enviado a <span className="badge badge-dark mr-1">{ `${tramite.dependencia && tramite.dependencia.nombre}`.toUpperCase() }</span>
                                                    Será atendido o derivado a la dependencia correspondiente!!!
                                                </div>


                                            </div>
                                        </div>
                                        { tracking.map((e, iter) =>
                                            <div>
                                                <i className="far fa-arrow-alt-circle-right"></i>
                                                <div className="timeline-item">
                                                    <span className="time">
                                                        { moment(e.created_at).format('LT') }&nbsp;
                                                        <i className="fas fa-clock"></i>
                                                    </span>
                                                    <h3 className="timeline-header">{ moment(e.created_at).lang('es').format('LL') }</h3>
                                                    < div className="timeline-body">
                                                        Su trámite ha sido { e.status } en <span className="badge badge-dark">{ `${e.dependencia_destino.nombre}`.toUpperCase() }</span>
                                                    </div>


                                                </div>
                                            </div>
                                        ) }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment >
        )
    }
}
