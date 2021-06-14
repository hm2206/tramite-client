import React, { useState } from 'react';
import IconSearch from './iconSearch';
import { authentication } from '../services/apis';
import Show from './show';
import { Input, Loader } from 'semantic-ui-react';

const InputSearchAcademico = ({ onResult = null, disabled = false }) => {

    const [query_search, setQuerySearch] = useState("");
    const [current_loading, setCurrentLoading] = useState(false);
    const [is_error, setIsError] = useState(false);

    const requestEstudiante = async () => {
        setCurrentLoading(true);
        await authentication.get(`apis/siga/get_resolver?url=alumnos/dni/${query_search}`)
        .then(res => {
            let [estudiante] = res.data.data;
            if (!estudiante) throw new Error("No se encontró al estudiante");
            setIsError(false);
            if (typeof onResult == 'function') onResult(estudiante, query_search);
        }).catch(err => setIsError(true));
        setCurrentLoading(false);
    }

    return (
        <>
            <Input type="text"
                fluid
                placeholder="Ingrese su N° de Documento"
                icon={<IconSearch onClick={requestEstudiante} disabled={current_loading || disabled}/>}
                name="query_search"
                value={query_search || ""}
                onChange={(e, obj) => setQuerySearch(obj.value)}
            />

            <Show condicion={current_loading}>
                <div className="col-12 text-center mt-5 mb-3" style={{ position: 'relative' }}>
                    <Loader active/>
                </div>
            </Show>

            <Show condicion={!current_loading && is_error}>
                <div className="col-12 mb-3 text-center font-15">
                    <div className="mb-3 mt-5" style={{ fontSize: '24px' }}><i className="fas fa-exclamation-circle text-warning"></i></div>
                    No se encontró al estudiante con el N° Documento: <b>{query_search}</b>
                </div>
            </Show>
        </>
    )
}


export default InputSearchAcademico;