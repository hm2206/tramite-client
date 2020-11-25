import React, { Component, useState } from 'react';
import CreateTramite from '../components/createTramite';
import CreatePerson from '../components/createPerson';
import { Step } from 'semantic-ui-react'
import Show from '../components/show';
const register = (props) => {
    const [pass, setpass] = useState(1);
    const [complete, setcomplete] = useState([]);
    const [person, setperson] = useState({});

    const nextPass = (pass, person = null) => {
        setpass(pass + 1)
        setcomplete([...complete, pass])
        setperson(typeof person == 'object' ? person : person)
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">

                <div className="col-md-7 mb-5">
                    <Step.Group ordered fluid>
                        <Step active={pass == 1} disabled={pass != 1} completed={complete.includes(1)}>
                            <Step.Content>
                                <Step.Title>Validar</Step.Title>
                                <Step.Description>Validar datos de persona</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active={pass == 2} disabled={pass != 2} completed={complete.includes(2)}>
                            <Step.Content>
                                <Step.Title>Trámite</Step.Title>
                                <Step.Description>Crear trámite documentario</Step.Description>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                </div>

                <div className="col-md-7">
                    <Show condicion={pass == 1}>
                        <CreatePerson {...props} onPass={nextPass} />
                    </Show>

                    <Show condicion={pass == 2}>
                        <CreateTramite {...props} person={person} />
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default register;