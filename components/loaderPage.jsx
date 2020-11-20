import React, { Component } from 'react';
import { app }  from '../env.json';


export default class LoaderPage extends Component
{

    render() {

        let { message } = this.props;

        return <div style={{ position: 'fixed', top: '0px', left: '0px', width: "100%", height: "100%", fontFamily: "arial" }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:"100%", height: "100%", flexDirection: "column" }}>
                <img src={`${app.asset_prefix}img/loading_page.png`} alt="soporte"/>
                <h3 style={{ color: "#455a64" }}>{message || ""}</h3>
            </div>
        </div>
    }

}