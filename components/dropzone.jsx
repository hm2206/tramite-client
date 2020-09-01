import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

const DropZone = ({ id, name, onChange, error = false, children = null, title = "Select", accept = "*", icon = 'image', label = null, result = [], onDelete = null }) => {

    const metaDatos = (name) => {
        let items = {
            pdf: { color: '#d32f2f', icon: 'fas fa-file-pdf' },
            docx: { color: '#1976d2', icon: 'fas fa-file-word' }
        };
        // get key
        let keyName = `${name}`.split('.').pop();
        // response 
        return items[keyName] || { color: '#37474f', icon: 'fas fa-file-alt' };
    };

    return (<Form.Field error={ error || false }>
        <label htmlFor={ id }>{ label }</label>
        <label className="dropzone" htmlFor={ id } style={ { overflow: 'hidden' } }>
            <div className="text-center dropzone-color pt-3 pb-3" style={ { fontSize: '4em' } }>
                <i className={ `fas fa-cloud-upload-alt` }></i>
                <div style={ { fontSize: '13px', color: '#455a64' } }>
                    { title }
                </div>
            </div>
            <input type="file"
                id={ id }
                accept={ accept }
                name={ name }
                multiple
                onChange={ (e) => {
                    let { name, files } = e.target;
                    if (typeof onChange == 'function') onChange({ name, files });
                    document.getElementById(id).value = null;
                } }
                hidden
            />
        </label>
        <label>{ error || "" }</label>
        <div className="row">
            { result.map((f, indexF) =>
                <div className="col-md-3" key={ `${id}-files-${f.name}` }>
                    <div className="card">
                        <div className="card-body" style={ { overflow: 'hidden' } }>
                            <div className="dropzone-text">
                                <i className={ metaDatos(f.name).icon } style={ { color: metaDatos(f.name).color } }></i> { f.name }
                            </div>
                            <span className="dropzone-item-delete" onClick={ (e) => typeof onDelete == 'function' ? onDelete({ e, index: indexF, file: f }) : null }>
                                <i className="fas fa-times"></i>
                            </span>
                            <hr />
                            <b>{ (f.size / (1024 * 1024)).toFixed(2) }MB</b>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    </Form.Field>);
}

export default DropZone;