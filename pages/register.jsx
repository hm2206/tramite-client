import React, { Component } from 'react';
import CreateTramite from '../components/createTramite';
import CreatePerson from '../components/createPerson';
import { Step } from 'semantic-ui-react'
import Show from '../components/show';

export default class Register extends Component {

    state = {
        pass: 1,
        complete: [],
        person: {}
    }

    nextPass = (pass, person = null) => {
        this.setState(state => ({
            pass: state.pass + 1,
            complete: [...state.complete, pass],
            person: typeof person == 'object' ? person : state.person
        }))
    }

    render() {

        let { pass, complete } = this.state;

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">

                    <div className="col-md-7 mb-5">
                        <Step.Group ordered fluid>
                            <Step active={ pass == 1 } disabled={ pass != 1 } completed={ complete.includes(1) }>
                                <Step.Content>
                                    <Step.Title>Validar</Step.Title>
                                    <Step.Description>Validar datos de persona</Step.Description>
                                </Step.Content>
                            </Step>

                            <Step active={ pass == 2 } disabled={ pass != 2 } completed={ complete.includes(2) }>
                                <Step.Content>
                                    <Step.Title>Trámite</Step.Title>
                                    <Step.Description>Crear trámite documentario</Step.Description>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </div>

                    <div className="col-md-7">
                        <Show condicion={ pass == 1 }>
                            <CreatePerson { ...this.props } onPass={ this.nextPass } />
                        </Show>

                        <Show condicion={ pass == 2 }>
                            <CreateTramite />
                        </Show>
                    </div>
                </div>
            </div>
        )
    }

}