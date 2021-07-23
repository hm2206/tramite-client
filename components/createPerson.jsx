import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'semantic-ui-react';
import FormPerson from './formPerson';
import Show from './show';
import { authentication } from '../services/apis';
import { TramiteContext } from '../context/TramiteContext';
import Swal from 'sweetalert2';

const CreatePerson = ({ onCancel = null, readOnly = [] }) => {

    // tramite
    const { person, setPerson, setTab, setComplete } = useContext(TramiteContext);

    // estados
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [current_loading, setCurrentLoading] = useState(false);

    const handleInput = (e, { name, value }) => {
        let newForm = Object.assign({}, form);
        newForm[name] = value;
        setForm(newForm);
        let newErrors = Object.assign({}, errors);
        newErrors[name] = [];
        setErrors(newErrors);
    }

    const handleCancel = () => {
        setForm({});
        if (typeof onCancel == 'function') onCancel(); 
    }

    const handleSave = async () => {
        setCurrentLoading(true);
        let payload = Object.assign({}, form);
        await authentication.post(`public/people`, payload)
        .then(async res => {
            let { message, person } = res.data;
            setPerson(person);
            setForm({});
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
        if (person) setForm(person);
    }, []);
    
    // render
    return (
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
                    <i className="fas fa-arrow-right"></i> Continuar
                </Button>
            </div>
        </FormPerson>
    )
}

export default CreatePerson;