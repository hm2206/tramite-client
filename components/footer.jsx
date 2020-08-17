import React, { Component } from 'react';
import Link from 'next/link';


export default class Footer extends Component
{

    render() {

        let { app } = this.props;

        return (
            <div className="container">
                <footer className="pt-4 my-md-5 pt-md-5 border-top">
                    <div className="row">
                        <div className="col-12 col-md">
                            <img className="mb-2" src="../assets/brand/bootstrap-solid.svg" alt="" width="24" height="24"/>
                            <small className="d-block mb-3 text-muted">&copy; {app.name || ""} {new Date().getFullYear()}</small>
                        </div>
                        <div className="col-6 col-md">
                            <h5>Acceso Rápido</h5>
                            <ul className="list-unstyled text-small">
                                <li>
                                    <Link href="/">
                                        <a className="text-muted">Inicio</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/my_postulacion">
                                        <a className="text-muted">Mis Postulaciones</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login">
                                        <a className="text-muted">Entrar</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register">
                                        <a className="text-muted">Regístrate</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-6 col-md">
                        </div>
                        <div className="col-6 col-md">
                            <h5>Soporte</h5>
                            <ul className="list-unstyled text-small">
                                <li><a className="text-muted" target="_blank" href={app.support_link || '#'}>{app.support_name || ''}</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }

}