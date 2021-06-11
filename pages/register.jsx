import React, { useContext, useMemo, useState } from 'react';
import CreateTramite from '../components/createTramite';
import CreatePerson from '../components/createPerson';
import { Step } from 'semantic-ui-react'
import { TramiteContext, TramiteProvider } from '../context/TramiteContext';

const ItemRegister = () => {

    const { Component, tab, complete } = useContext(TramiteContext);

    // render
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">

                <div className="col-md-7 mb-5">
                    <Step.Group ordered fluid>
                        <Step active={tab == 'validate'} 
                            disabled={tab != 'validate'} 
                            completed={complete.includes('validate')}
                        >
                            <Step.Content>
                                <Step.Title>Validar</Step.Title>
                                <Step.Description>Validar datos de persona</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active={tab == 'tramite'} 
                            disabled={tab != 'tramite'} 
                            completed={complete.includes('tramite')}
                        >
                            <Step.Content>
                                <Step.Title>Trámite</Step.Title>
                                <Step.Description>Crear trámite documentario</Step.Description>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                </div>

                <div className="col-md-7">
                    {Component}
                </div>
            </div>
        </div>
    )
}

const register = () => {

    return (
        <TramiteProvider>
            <ItemRegister/>
        </TramiteProvider>
    );
}

export default register;