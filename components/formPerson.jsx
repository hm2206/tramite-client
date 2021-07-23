import React from 'react';
import { Form, Select } from 'semantic-ui-react';
import { SelectDepartamento, SelectProvincia, SelectDistrito, SelectDocumentType } from '../components/selects/authentication';

const FormPerson = ({ form = {}, errors = {}, disabled = false, readOnly = [], onChange = null, children = null }) => {

    const handleInput = (e, { name, value }) => {
        if (typeof onChange == 'function') onChange(e, { name, value });
    }

    return (
        <Form>
            <div className="row">
                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.document_type_id?.[0] ? true : false}>
                        <label className="text-muted">Tip. Documento <b className="text-danger">*</b></label>
                        <SelectDocumentType name="document_type_id" 
                            value={form.document_type_id}
                            id="code"
                            onChange={(e, obj) => handleInput(e, obj)}
                            disabled={disabled || readOnly.includes('document_type_id')}
                        />
                        <label>{errors?.document_type?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.document_number?.[0] ? true : false}>
                        <label className="text-muted">N° Documento <b className="text-danger">*</b></label>
                        <input name="document_number" 
                            readOnly={disabled || readOnly.includes('document_number')}
                            placeholder="Ingrese el N° Documento"
                            value={form.document_number || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.document_number?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.ape_pat?.[0] ? true : false}>
                        <label className="text-muted">Apellido Paterno <b className="text-danger">*</b></label>
                        <input name="ape_pat" 
                            readOnly={disabled || readOnly.includes('ape_pat')}
                            placeholder="Ingrese su apellido paterno"
                            value={form.ape_pat || ""}
                            onChange={(e) => handleInput(e, e.target)}
                            className="capitalize"
                        />
                        <label>{errors?.ape_pat?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.ape_mat?.[0] ? true : false}>
                        <label className="text-muted">Apellido Materno <b className="text-danger">*</b></label>
                        <input name="ape_mat" 
                            readOnly={disabled || readOnly.includes('ape_mat')}
                            placeholder="Ingrese su apellido materno"
                            value={form.ape_mat || ""}
                            onChange={(e) => handleInput(e, e.target)}
                            className="capitalize"
                        />
                        <label>{errors?.ape_mat?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-12 mb-2">
                    <Form.Field error={errors?.name?.[0] ? true : false}>
                        <label className="text-muted">Nombres <b className="text-danger">*</b></label>
                        <input name="name" 
                            readOnly={disabled || readOnly.includes('name')}
                            placeholder="Ingrese su nombre"
                            value={form.name || ""}
                            onChange={(e) => handleInput(e, e.target)}
                            className="capitalize"
                        />
                        <label>{errors?.name?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.profession?.[0] ? true : false}>
                        <label className="text-muted">Prefijo <b className="text-danger">*</b></label>
                        <input name="profession" 
                            placeholder="Ingrese el prefijo. Ejm: Sr, Sra, Dr"
                            type="text"
                            readOnly={disabled || readOnly.includes('profession')}
                            value={form.profession || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.profession?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.gender?.[0] ? true : false}>
                        <label className="text-muted">Género <b className="text-danger">*</b></label>
                        <Select name="gender" 
                            disabled={disabled || readOnly.includes('gender')}
                            placeholder="Selecionar Género"
                            value={form.gender || ""}
                            onChange={(e, obj) => handleInput(e, obj)}
                            options={[
                                { key: 'M', value: 'M', text: 'Masculino' },
                                { key: 'F', value: 'F', text: 'Femenino' }
                            ]}
                        />
                        <label>{errors?.gender?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.marital_status?.[0] ? true : false}>
                        <label className="text-muted">Estado Civil <b className="text-danger">*</b></label>
                        <Select name="marital_status" 
                            disabled={disabled || readOnly.includes('marital_status')}
                            value={form.marital_status || ""}
                            placeholder="Seleccionar Estado Civil"
                            onChange={(e, obj) => handleInput(e, obj)}
                            options={[
                                { key: 'S', value: 'S', text: 'Soltero' },
                                { key: 'C', value: 'C', text: 'Casado' },
                                { key: 'D', value: 'D', text: 'Divorciado' },
                                { key: 'V', value: 'V', text: 'Víudo' }
                            ]}
                        />
                        <label>{errors?.marital_status?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.date_of_birth?.[0] ? true : false}>
                        <label className="text-muted">Fecha de Nacimiento <b className="text-danger">*</b></label>
                        <input name="date_of_birth" 
                            type="date"
                            readOnly={disabled || readOnly.includes('date_of_birth')}
                            value={form.date_of_birth || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.date_of_birth?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-12 mb-2">
                    <Form.Field error={errors?.cod_dep?.[0] ? true : false}>
                        <label className="text-muted">Departamento <b className="text-danger">*</b></label>
                        <SelectDepartamento 
                            name="cod_dep" 
                            id="cod_dep"
                            disabled={disabled || readOnly.includes('cod_dep')}
                            value={form.cod_dep}
                            onChange={(e, obj) => handleInput(e, obj)}
                        />
                        <label>{errors?.cod_dep?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.cod_pro?.[0] ? true : false}>
                        <label className="text-muted">Provincia <b className="text-danger">*</b></label>
                        <SelectProvincia 
                            name="cod_pro" 
                            departamento_id={form.cod_dep}
                            id="cod_pro"
                            disabled={(disabled && form.cod_pro) || readOnly.includes('cod_pro')}
                            value={form.cod_pro}
                            refresh={form.cod_dep}
                            onChange={(e, obj) => handleInput(e, obj)}
                        />
                        <label>{errors?.cod_pro?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.cod_pro?.[0] ? true : false}>
                        <label className="text-muted">Distrito <b className="text-danger">*</b></label>
                        <SelectDistrito 
                            name="cod_dis" 
                            departamento_id={form.cod_dep}
                            provincia_id={form.cod_pro}
                            id="cod_dis"
                            disabled={(disabled && form.cod_dis) || readOnly.includes('cod_dis')}
                            value={form.cod_dis}
                            refresh={form.cod_pro}
                            onChange={(e, obj) => handleInput(e, obj)}
                        />
                        <label>{errors?.cod_dis?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-12 mt-4">
                    <hr />
                    <h4><i className="fas fa-phone-alt"></i> Contacto</h4>
                    <hr />
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.email_contact?.[0] ? true : false}>
                        <label className="text-muted">Correro Electrónico <b className="text-danger">*</b></label>
                        <input name="email_contact" 
                            readOnly={disabled || readOnly.includes('email_contact')}
                            placeholder="Ingrese su correo electrónico"
                            value={form.email_contact || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.email_contact?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-6 mb-2">
                    <Form.Field error={errors?.phone?.[0] ? true : false}>
                        <label className="text-muted">N° de contacto <b className="text-danger">*</b></label>
                        <input name="phone" 
                            readOnly={disabled || readOnly.includes('phone')}
                            placeholder="Ingrese su N° de contacto"
                            value={form.phone || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.phone?.[0]}</label>
                    </Form.Field>
                </div>

                <div className="col-md-12 mb-2">
                    <Form.Field error={errors?.address?.[0] ? true : false}>
                        <label className="text-muted">Dirección <b className="text-danger">*</b></label>
                        <textarea name="address"
                            rows="3" 
                            readOnly={disabled || readOnly.includes('address')}
                            placeholder="Ingrese su dirección"
                            value={form.address || ""}
                            onChange={(e) => handleInput(e, e.target)}
                        />
                        <label>{errors?.address?.[0]}</label>
                    </Form.Field>
                </div>

                {children || null}
            </div>
        </Form>
    )
}

export default FormPerson;