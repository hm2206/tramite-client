import React, { useContext, useState } from 'react';
import { Card, Loader, Button, Input, Icon } from 'semantic-ui-react';
import { TramiteContext } from '../context/TramiteContext';
import { authentication } from '../services/apis';
import Show from './show';
import FormPerson from './formPerson';
import CreatePerson from './createPerson';
import IconSearch from './iconSearch';


const ValidatePerson = () => {

    const square = { width: 175, height: 175 };
    const options = {
        search: 'Buscar',
        register: 'Registrar'
    }

    // context
    const { setPerson, person, nextTab } = useContext(TramiteContext);

    // estados
    const [option, setOption] = useState("");
    const [block, setBlock] = useState(false);
    const [query_search, setQuerySearch] = useState("");
    const [is_error, setIsError] = useState(false);
    const [current_loading, setCurrentLoading] = useState(false);

    const findPerson = async () => {
        setBlock(true);
        setCurrentLoading(true);
        await authentication.get(`person/${query_search}?type=document_number`)
        .then(res => {
            let { person } = res.data;
            setIsError(false);
            setBlock(true);
            setPerson(person);
        }).catch(err =>  {
            setIsError(true);
            setBlock(false);
            setPerson({})
        });
        setCurrentLoading(false);
    }

    const handleBack = () => {
        setOption("");
        setPerson({});
        setQuerySearch("");
    }

    const handleCancel = () => {
        setPerson({});
        setQuerySearch("");
        setBlock(false);
    }

    return (
        <Card fluid>
            <Card.Header className="card-body">
                <h5><i className="fas fa-user-friends"></i> Validar Persona</h5>
            </Card.Header>
            <Card.Content>
                <div className="row">
                    <Show condicion={!option}>
                        <div className="col-6 text-center mb-3">
                            <Button className="switch-circle" 
                                style={square}
                                onClick={() => setOption(options.search)}
                                title="Validar mis datos"
                            >
                                <h1 className="text-dark"><i className="fas fa-check"></i></h1>
                                <div className="text-muted">Valídar</div>
                            </Button>
                        </div>
                        <div className="col-6 text-center mb-3">
                            <Button className="switch-circle" 
                                style={square}
                                onClick={() => setOption(options.register)}
                                title="Registrate como persona"
                            >
                                <h1 className="text-dark"><i className="fas fa-user"></i></h1>
                                <div className="text-muted">Regístrate</div>
                            </Button>
                        </div>
                    </Show>
                    {/* buscar persona */}
                    <Show condicion={options.search == option}>
                        <div className="col-12">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <Button onClick={handleBack} disabled={block}>
                                            <i className="fas fa-arrow-left"></i>
                                        </Button>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <Input name="query_search"
                                            fluid
                                            disabled={current_loading || block}
                                            icon={
                                                <IconSearch 
                                                    disabled={query_search <= 3 || current_loading || block} 
                                                    onClick={findPerson}
                                                />
                                            }
                                            placeholder='Ingrese su N° de Documento'
                                            value={query_search || ""}
                                            onChange={(e, obj) => {
                                                setIsError(false)
                                                setQuerySearch(obj.value)
                                            }}
                                        />
                                    </div>

                                    <Show condicion={!current_loading && is_error}>
                                        <div className="col-12 mb-3 text-center font-15">
                                            <div className="mb-3 mt-5" style={{ fontSize: '24px' }}><i className="fas fa-exclamation-circle text-warning"></i></div>
                                            No se encontró a la persona con el N° Documento: <b>{query_search}</b>
                                        </div>
                                    </Show>

                                    <Show condicion={current_loading}>
                                        <div className="col-12 text-center mt-5 mb-3" style={{ position: 'relative' }}>
                                            <Loader active/>
                                        </div>
                                    </Show>

                                    <Show condicion={Object.keys(person).length}>
                                        <div className="col-12">
                                            <FormPerson form={person} disabled>
                                                <div className="col-12 text-right">
                                                    <hr />
                                                    <Button color="teal" 
                                                        color="red" 
                                                        basic
                                                        onClick={handleCancel}
                                                    >
                                                        <i className="fas fa-times"></i> Cancelar
                                                    </Button>

                                                    <Button color="teal"
                                                        onClick={() => nextTab('validate', 'tramite')}
                                                    >
                                                        <i className="fas fa-arrow-right"></i> Continuar
                                                    </Button>
                                                </div>
                                            </FormPerson>
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </Show>
                    {/* regístrar */}
                    <Show condicion={option == options.register}>
                        <div className="col-12 mb-3">
                            <Button onClick={handleBack} disabled={block}>
                                <i className="fas fa-arrow-left"></i>
                            </Button>
                        </div>
                        <div className="col-12">
                            <CreatePerson/>
                        </div>
                    </Show> 
                </div>
            </Card.Content>
        </Card>
    )
}

export default ValidatePerson;