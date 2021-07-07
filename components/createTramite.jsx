import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Form, TextArea, Card, FormField } from 'semantic-ui-react';
import { authentication, tramite } from '../services/apis';
import Swal from 'sweetalert2';
import Show from '../components/show';
import Router from 'next/router';
import DropZone from '../components/dropzone';
import { SelectEntity } from './selects/authentication';
import { SelectTramiteType, SelectDependenciaExterna } from './selects/tramite';
import collect from 'collect.js';
import { TramiteContext } from '../context/TramiteContext';

const CreateTramite = () => {

    // context
    const { person, nextTab, setPerson } = useContext(TramiteContext);
    
    // estados
    const [block, setBlock] = useState(false);
    const [code, setCode] = useState(null);
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState({ size: 0, data: [] });
    const [current_loading, setCurrentLoading] = useState(false);

    // memos
    const formReady = useMemo(() => {
        let datos = ['entity_id', 'document_number', 'dependencia_id', 'tramite_type_id', 'asunto', 'folio_count', 'termino'];
        for (let attr of datos) {
            let isValue = form[attr];
            if (!isValue) return false;
        }
        let count_files = file.data.length;
        if (!count_files) return false;
        // response
        return true;
    }, [form]);

    const getEstudiante = async () => {
        setBlock(true);
        await authentication.get(`apis/siga/get_resolver?url=alumnos/dni/${person?.document_number || ''}`)
        .then(res => {
            let [{curricula}] = res.data.data;
            if (!curricula) throw new Error("No se encontró al estudiante");
            setCode(curricula?.escuela_id || null);
        }).catch(err => setCode(null));
        setBlock(false);
    }

    const handleInput = async ({ name, value }) => {
        let newForm = Object.assign({}, form);
        newForm[name] = value;
        setForm(newForm);
        let newErrors = Object.assign({}, errors);
        newErrors[name] = [];
        setErrors(newErrors);
    }

    const handleFiles = ({ files }) => {
        let size_total = file.size;
        let size_limit = 25 * 1024;
        let newFile = Object.assign({}, file);
        let collectFile = collect([...newFile.data]);
        for (let f of files) {
            let isExists = collectFile.where('name', f.name).count();
            if (isExists) continue;
            size_total += f.size;
            newFile.size += size_total;
            if ((size_total / 1024) <= size_limit) {
                newFile.data.push(f);
                setFile(newFile);
                collectFile.push(f);
            } else {
                size_total = size_total - f.size;
                Swal.fire({ icon: 'error', text: `El limíte máximo es de 25MB, tamaño actual(${(size_total / (1024 * 1024)).toFixed(2)} MB` });
                return false;
            }
        }
        return false;
    }

    const deleteFile = (index, tmpFile) => {
        let newFile = Object.assign({}, file);
        newFile.data.splice(index, 1);
        newFile.size = newFile.size - tmpFile.size;
        setFile(newFile);
    }

    const handleSave = async () => {
        let payload = new FormData();
        // data person
        payload.append('person_id', person.id);
        // datos
        for (let attr in form) {
            if (attr != 'files') payload.append(attr, form[attr])
        }
        // add files
        file.data.filter(f => payload.append('files', f));
        // add code
        payload.append('code', code);
        setCurrentLoading(true);
        // send data
        await tramite.post('public/tramite', payload)
        .then(async res => {
            let { success, message } = res.data;
            let current_tramite = res.data.tramite;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message });
            setForm({});
            let { push } = Router;
            push({ pathname: '/', query: { slug: current_tramite.slug } })
        }).catch(async err => {
            try {
                let response = err.response;
                let message = "";
                let errors = {};
                if (typeof response != 'object') message = err.message;
                else {
                    message = response?.data?.message || err.message;
                    errors = response?.data?.errors || {};
                }
                // alerta
                Swal.fire({ icon: 'warning', text: message });
                setErrors(errors);
            } catch (error) {
                Swal.fire({ icon: 'error', text: "ocurrio un error al crear el trámite" });
            }
        });
        setCurrentLoading(false);
    }

    const handleCancel = () => {
        setPerson({});
        nextTab('validate', 'validate');
    }

    useEffect(() => {
        if (person.id) getEstudiante();
    }, [person.id]);

    return (
        <Card fluid>
            <Card.Header>
                <div className="card-body">
                    <h4 className="">Regístro de Tramite</h4>
                </div>
            </Card.Header>
            <Card.Content>
                <Form >
                    <div className="form-group row">
                        <Form.Field className="col-md-12" error={errors?.entity_id?.[0] ? true : false}>
                            <label className="text-muted">Entidad <span className="text-danger">*</span></label>
                            <SelectEntity
                                value={form.entity_id}
                                name="entity_id"
                                onChange={(e, obj) => handleInput(obj)}
                                disabled={current_loading}
                            />
                            <label htmlFor="">{errors?.entity_id?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-12" error={errors?.dependencia_id?.[0] ? true : false}>
                            <label className="text-muted">Destino del Documento <span className="text-danger">*</span></label>
                            <SelectDependenciaExterna
                                entity_id={form.entity_id}
                                code={code}
                                name="dependencia_id"
                                options={[]}
                                value={form.dependencia_id || ""}
                                onChange={(e, obj) => handleInput(obj)}
                                disabled={!form.entity_id || current_loading}
                            />
                            <label htmlFor="">{errors?.dependencia_id?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-12" error={errors?.tramite_type_id?.[0] ? true : false} >
                            <label className="text-muted">Tipo del Documento <span className="text-danger">*</span></label>
                            <SelectTramiteType
                                name="tramite_type_id"
                                value={form.tramite_type_id || ""}
                                onChange={(e, obj) => handleInput(obj)}
                                disabled={current_loading}
                            />
                            <label htmlFor="">{errors?.tramite_type_id?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-6" error={errors?.document_number?.[0] ? true : false}>
                            <label className="text-muted">N° Documento <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="document_number"
                                value={form.document_number || ""}
                                disabled={current_loading}
                                onChange={(e) => handleInput(e.target)}
                            />
                            <label>{errors?.document_number?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-6" error={errors?.folio_count?.[0] ? true : false}>
                            <label className="text-muted">N° Folios <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="folio_count"
                                value={form.folio_count || ""}
                                onChange={(e) => handleInput(e.target)}
                                disabled={current_loading}
                            />
                            <label>{errors?.folio_count?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-12" error={errors?.asunto?.[0] ? true : false}>
                            <label className="text-muted">Asunto del Tramite <span className="text-danger">*</span></label>
                            <TextArea
                                type="text"
                                name="asunto"
                                value={form.asunto || ""}
                                onChange={(e) => handleInput(e.target)}
                                disabled={current_loading}
                            />
                            <label>{errors?.asunto?.[0] || ""}</label>
                        </Form.Field>

                        <Form.Field className="col-md-12">
                            <label htmlFor="">Archivos (25mb máx)</label>
                            <DropZone id="files"
                                name="files"
                                onChange={handleFiles}
                                icon="save"
                                result={file.data}
                                title="Select. Archivo (*.docx, *.pdf, *.zip)"
                                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                                onDelete={(e) => deleteFile(e.index, e.file)}
                                disabled={current_loading}
                            />
                        </Form.Field>

                        <Form.Field className="col-md-12">
                            <Form.Checkbox label='Declaro bajo penalidad de perjurio, que toda la informacion proporcionada es correcta y verídica' 
                                toggle
                                checked={form.termino || false}
                                name="termino"
                                disabled={current_loading}
                                onChange={(e, obj) => handleInput({ name: obj.name, value: obj.checked })}
                            />
                        </Form.Field>
                    </div>

                    <div className="form-group row">
                        <div className="col-lg-12 text-right">
                            <hr />

                            <Button color="red"
                                basic
                                onClick={handleCancel}
                                disabled={current_loading}
                            >
                                Cancelar
                            </Button>

                            <Button color="teal"
                                onClick={handleSave}
                                disabled={!formReady || current_loading}
                                loading={current_loading}
                            >
                                Registrar
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card.Content >
        </Card >
    )
}



export default CreateTramite