import React from 'react';
import { SelectBase } from './utils';
import { authentication } from '../../services/apis';

const SelectDocumentType = ({ id = "id", name, value, onChange, refresh = false, disabled = false }: any) => {
    return <SelectBase 
        execute={true}
        api={authentication}
        url={`document_type`}
        id={`select-documen_type-${name}`}
        value={id}
        text="name"
        obj="document_type"
        name={name}
        valueChange={value || ""}
        onChange={(e, obj) => typeof onChange == 'function' ? onChange(e, obj) : null}
        placeholder="Seleccionar tip. Documento"
        refresh={refresh}
        disabled={disabled}
    />
}

const SelectDepartamento = ({ id = "id", name, value, onChange, refresh = false, disabled = false }: any) => {
    return <SelectBase 
        execute={true}
        api={authentication}
        url={`departamento`}
        id={`select-departamento-${name}`}
        value={id}
        text="departamento"
        obj="departamento"
        name={name}
        valueChange={value || ""}
        onChange={(e, obj) => typeof onChange == 'function' ? onChange(e, obj) : null}
        placeholder="Seleccionar Departamento"
        refresh={refresh}
        disabled={disabled}
    />
}

const SelectProvincia = ({ id = "id", departamento_id,  name, value, onChange, refresh = false, disabled = false }: any) => {
    return <SelectBase 
        execute={false}
        api={authentication}
        url={`departamento/${departamento_id}/provincia`}
        id={`select-departamento-provincia-${name}`}
        value={id}
        text="provincia"
        obj="provincia"
        name={name}
        valueChange={value || ""}
        onChange={(e, obj) => typeof onChange == 'function' ? onChange(e, obj) : null}
        placeholder="Seleccionar Provincia"
        refresh={refresh}
        disabled={disabled}
    />
}

const SelectDistrito = ({ id = "id", departamento_id, provincia_id,  name, value, onChange, refresh = false, disabled = false }: any) => {
    return <SelectBase 
        execute={false}
        api={authentication}
        url={`departamento/${departamento_id}/provincia/${provincia_id}/distrito`}
        id={`select-departamento-provincia-distrito-${name}`}
        value={id}
        text="distrito"
        obj="distrito"
        name={name}
        valueChange={value || ""}
        onChange={(e, obj) => typeof onChange == 'function' ? onChange(e, obj) : null}
        placeholder="Seleccionar Distrito"
        refresh={refresh}
        disabled={disabled}
    />
}


const SelectEntity = ({ id = "id", name, value, onChange, refresh, disabled = false }: any) => {
    return <SelectBase
        execute={true}
        api={authentication}
        url={`entity`}
        id={`select-entity-${name}`}
        value={id}
        text="name"
        obj="entities"
        name={name}
        valueChange={value || ""}
        onChange={(e: any, obj: any) => typeof onChange == 'function' ? onChange(e, obj) : null}
        placeholder="Seleccionar Entidad"
        refresh={refresh}
        disabled={disabled}
    />
}

const SelectDependencia = ({ id = "id", name, value, onChange, refresh = false, disabled = false, onReady = null }: any) => {
    return <SelectBase 
            api={authentication}
            url={`dependencia`}
            id={`select-dependencia-${id}-${name}`}
            value={id}
            text="nombre"
            obj="dependencia"
            name={name}
            valueChange={`${value}`|| ""}
            onChange={(e, obj) => typeof onChange == 'function' ? onChange(e, obj) : null}
            placeholder="Seleccionar Dependencia"
            refresh={refresh}
            execute={true}
            disabled={disabled}
            onReady={onReady}
        />
}



export { 
    SelectDocumentType,
    SelectDepartamento,
    SelectProvincia,
    SelectDistrito,
    SelectEntity,
    SelectDependencia,
};