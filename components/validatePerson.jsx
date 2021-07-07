import React, { useContext, useState } from 'react';
import { Card, Loader, Button, Input, Icon } from 'semantic-ui-react';
import { TramiteContext } from '../context/TramiteContext';
import { authentication } from '../services/apis';
import Show from './show';
import FormPerson from './formPerson';
import CreatePerson from './createPerson';
import IconSearch from './iconSearch';


const ValidatePerson = () => {

    // context
    const { setPerson, person, nextTab } = useContext(TramiteContext);

    // estados
    const [block, setBlock] = useState(false);
    const [query_search, setQuerySearch] = useState("");
    const [is_error, setIsError] = useState(false);
    const [current_loading, setCurrentLoading] = useState(false);
    const [is_register, setIsRegister] = useState(false);
    const [read_only, setReadOnly] = useState([]);

    const isPerson = Object.keys(person).length;

    const findPerson = async () => {
        setBlock(true);
        setCurrentLoading(true);
        await authentication.get(`person/${query_search}?type=document_number`)
        .then(res => {
            let { person } = res.data;
            setIsError(false);
            setBlock(true);
            setPerson(person);
        }).catch(async err =>  {
            await findStudent();
        });
        setCurrentLoading(false);
    }

    const findStudent = async () => {
        await authentication.get(`apis/siga/get_resolver?url=alumnos/dni/${query_search}`)
        .then(res => {
            let [{persona}] = res.data.data;
            if (!persona) throw new Error("No se encontró al estudiante");
            setPerson({
                document_type_id: '01',
                document_number: persona.numero_documento,
                ape_pat: persona.apellido_paterno,
                ape_mat: persona.apellido_materno,
                name: persona.nombres,
                date_of_birth: persona.fecha_nacimiento,
                profession: 'Est'
            });
            
            setReadOnly([
                'document_type_id', 'document_number', 'ape_pat', 
                'ape_mat', 'name', 'date_of_birth', 'profession'
            ]);

            setIsError(false); 
            setBlock(true);
            setIsRegister(true);
        }).catch(err => {
            setIsError(true);
            setBlock(false);
            setPerson({})
        });
    }

    const handleCancel = () => {
        setPerson({});
        setReadOnly([]);
        setQuerySearch("");
        setBlock(false);
        setIsRegister(false)
    }

    return (
        <Card fluid>
            <Card.Header className="card-body">
                <h5><i className="fas fa-user-friends"></i> Validar Persona</h5>
            </Card.Header>
            <Card.Content>
                <div className="card-body">
                    {/* buscar persona */}
                    <Show condicion={!isPerson && !is_register}>
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

                        <Show condicion={current_loading}>
                            <div className="col-12 text-center mt-5 mb-3" style={{ position: 'relative' }}>
                                <Loader active/>
                            </div>
                        </Show>

                        <Show condicion={!current_loading && is_error}>
                            <div className="col-12 mb-3 text-center font-15">
                                <div className="mb-3 mt-5" style={{ fontSize: '24px' }}><i className="fas fa-exclamation-circle text-warning"></i></div>
                                No se encontró a la persona con el N° Documento: <b>{query_search}</b>
                                <div className="text-center mt-3">
                                    <Button onClick={() => setIsRegister(true)}>
                                        <i className="fas fa-plus"></i> Regístrate
                                    </Button>
                                </div>
                            </div>
                        </Show>
                    </Show>

                    {/* mostar información */}
                    <Show condicion={!is_register && isPerson}>
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
                    {/* regístrar */}
                    <Show condicion={is_register}>
                        <CreatePerson readOnly={read_only} 
                            onCancel={handleCancel}
                        />
                    </Show> 
                </div>
            </Card.Content>
        </Card>
    )
}

export default ValidatePerson;