import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'semantic-ui-react';
import FormPerson from './formPerson';
import Show from './show';
import InputSearchAcademico from './inputSearchAcademico';
import { authentication } from '../services/apis';
import { TramiteContext } from '../context/TramiteContext';
import Swal from 'sweetalert2';

const CreatePerson = () => {

    // tramite
    const { setPerson, setTab, setComplete } = useContext(TramiteContext);

    // estados
    const [option, setOption] = useState("");
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [current_loading, setCurrentLoading] = useState(false);
    const [estudiante, setEstudiante] = useState({});
    const isEstudiante = Object.keys(estudiante).length;

    const square = { width: 175, height: 175 };
    const options = {
        externo: 'externo',
        estudiante: 'estudiante'
    }

    const showForm = useMemo(() => {
        if (option == options.externo) return true;
        return isEstudiante;
    }, [option, estudiante]);

    const readOnly = useMemo(() => {
        if (option == options.externo) return [];
        return ['document_type_id', 'document_number', 'ape_pat', 'ape_mat', 'name'];
    }, [option]);

    const handleInput = (e, { name, value }) => {
        let newForm = Object.assign({}, form);
        newForm[name] = value;
        setForm(newForm);
        let newErrors = Object.assign({}, errors);
        newErrors[name] = [];
        setErrors(newErrors);
    }

    const onEstudiante = (newEstudiante, dni) => {
        setEstudiante(newEstudiante);
        setErrors({});
        setForm({
            document_type_id: '01',
            document_number: dni,
            ape_pat: newEstudiante.apellido_paterno,
            ape_mat: newEstudiante.apellido_materno,
            name: newEstudiante.nombres
        });
    }

    const handleCancel = () => {
        setEstudiante({});
        setForm({});
        setOption("");
    }

    const handleSave = async () => {
        setCurrentLoading(true);
        let payload = Object.assign({}, form);
        await authentication.post(`public/people`, payload)
        .then(async res => {
            let { message, person } = res.data;
            setPerson(person);
            setForm({});
            setOption("");
            setEstudiante();
            setErrors();
            await Swal.fire({ icon: 'success', text: message });
            setTab('tramite');
            setComplete((prev) => [...prev, 'validate']);
        }).catch(err => {
            try {
                let { response } = err;
                if (typeof response != 'object') throw new Error("No se pudó gardar los datos");
                let { data } = response;
                if (typeof data != 'object') throw new Error(err.message);
                Swal.fire({ icon: 'warning', text: data.message || err.message });
                setErrors(data.errors || {});
            } catch (ex) {
                Swal.fire({ icon: 'error', text: ex.message });
            }
        });
        setCurrentLoading(false);
    }

    useEffect(() => {
        setForm({});
        setErrors({});
        setEstudiante({});
    }, [option]);
    
    // render
    return (
        <div className="card-body">
            <div className="row">
                <div className="col-6 text-center mb-3">
                    <Button className="switch-circle" style={square}
                        onClick={() => setOption(options.externo)}
                        active={option == options.externo}
                        disabled={isEstudiante || current_loading}
                    >
                        <h1 className="text-dark"><i className="fas fa-user"></i></h1>
                        <div className="text-muted">Soy Externo</div>
                    </Button>
                </div>
                <div className="col-6 text-center mb-3">
                    <Button className="switch-circle" style={square}
                        onClick={() => setOption(options.estudiante)}
                        active={option == options.estudiante}
                        disabled={isEstudiante || current_loading}
                    >
                        <h1 className="text-dark"><i className="fas fa-user-graduate"></i></h1>
                        <div className="text-muted">Soy Estudiante</div>
                    </Button>
                </div>
            </div>
            {/* estudiante */}
            <Show condicion={option == options.estudiante && !isEstudiante}>
                <div className="col-12 mt-5">
                    <hr />
                    <InputSearchAcademico onResult={onEstudiante}
                        disabled={isEstudiante}
                    />
                </div>
            </Show>
            {/* formulario de regístro */}
            <Show condicion={showForm}>
                <div className="mt-5">
                    <hr />
                    <FormPerson
                        form={form}
                        onChange={handleInput}
                        readOnly={readOnly}
                        errors={errors}
                    >
                        <div className="col-12 text-right">
                            <hr />
                            <Button color="red"
                                basic
                                disabled={current_loading}
                                onClick={handleCancel}
                            >
                                <i className="fas fa-times"></i> Cancelar
                            </Button>

                            <Button color="teal"
                                disabled={current_loading}
                                loading={current_loading}
                                onClick={handleSave}
                            >
                                <i className="fas fa-save"></i> Guardar Datos
                            </Button>
                        </div>
                    </FormPerson>
                </div>
            </Show>

            
        </div>
    )
}

export default CreatePerson;