import React, { Component } from 'react';
import { app }  from '../env.json';


export default class LoaderPage extends Component
{

    render() {

        let { message } = this.props;

        return <div style={{ position: 'fixed', top: '0px', left: '0px', width: "100%", height: "100%", fontFamily: "arial" }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:"100%", height: "100%", flexDirection: "column" }}>
                <img src="https://sis.unia.edu.pe/api_authentication/find_file_local?path=app%2Fimg%2Fintegracion_icon.png&size=200x200&fbclid=IwAR0GR0ZEaHe-jm0pyz1gy9-QpaEa_ZfEne2wZSuZ_sJDVgFePi7vyhdqd_E" alt="soporte"/>
                <h3 style={{ color: "#455a64" }}>{message || ""}</h3>
            </div>
        </div>
    }

}