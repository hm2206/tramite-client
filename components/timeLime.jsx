import React, { Component, Fragment } from 'react';

export default class TimeLime extends Component {
    render() {

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
                                    <div id="div_historial2">
                                        <div className="time-label text-left">
                                            <span className="bg-red">Fecha Inicio: 11 Ago 2020</span>
                                        </div>

                                        <div>
                                            <i className="fas fa-university bg-blue"></i>
                                            <div className="timeline-item">
                                                <span className="time">
                                                    <i className="fas fa-clock"></i> 11 : 01
                                                </span>
                                                <h3 className="timeline-header"> 11 Agosto del 2020</h3>
                                                <div className="timeline-body">
                                                    Su trámite ha sido recibido en <b>RECURSOS HUMANOS</b>, será atendido o derivado a la oficina correspondiente en un plazo máximo de 2 día(s).
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="div_historial">
                                        <div>
                                            <i className="fas fa-reply-all bg-yellow"></i>
                                            <div className="timeline-item">
                                                <span className="time">
                                                    <i className="fas fa-clock"></i> 11 : 01
                                                </span>
                                                <h3 className="timeline-header"> 11 Agosto del 2020</h3>
                                                <div className="timeline-body"> Su trámite ha sido derivado a <b>RECURSOS HUMANOS</b> </div>
                                                <div className="timeline-footer" style={ { padding: '10px', textAlign: 'left' } }> " se rechazó "  </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
