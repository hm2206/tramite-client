import React, { Component } from 'react';
import { app } from '../env.json';

export default class LoadingGlobal extends Component {

    render() {

        let { display, id, message } = this.props;

        return (
            <div style={{
                width: "100%",
                height: "100%",
                background: 'rgba(255, 255, 255, 0.8)',
                position: 'fixed',
                top: '0px',
                left: '0px',
                zIndex: '5000',
                display: display ? display : 'block'
            }} id={id ? id : 'id-loading-brand'}>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="https://sis.unia.edu.pe/api_authentication/find_file_local?path=app%2Fimg%2Fintegracion_icon.png&size=200x200&fbclid=IwAR0GR0ZEaHe-jm0pyz1gy9-QpaEa_ZfEne2wZSuZ_sJDVgFePi7vyhdqd_E" alt="loader" className="loading-brand" />
                </div>
            </div>
        )
    }

}