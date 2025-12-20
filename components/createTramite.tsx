import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FileText, Building2, Hash, MessageSquare, BookOpen, Upload, CheckSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import Show from '../components/show';
import Router from 'next/router';
import DropZone from '../components/dropzone';
import { SelectEntity } from './selects/authentication';
import { SelectTramiteType, SelectDependenciaExterna } from './selects/tramite';
import collect from 'collect.js';
import { TramiteContext } from '../context/TramiteContext';
import { useCreateTramiteMutation } from '../store/api/tramiteApi';
import { useLazyGetStudentFromSigaQuery } from '../store/api/authApi';

interface FormErrors {
  [key: string]: string[];
}

interface FileData {
  size: number;
  data: File[];
}

interface FormDataState {
  entity_id?: string;
  document_number?: string;
  dependencia_id?: string;
  tramite_type_id?: string;
  asunto?: string;
  folio_count?: string;
  termino?: boolean;
  [key: string]: any;
}

const CreateTramite = () => {
  const { person, nextTab, setPerson } = useContext(TramiteContext);

  // RTK Query hooks
  const [createTramite, { isLoading: isCreating }] = useCreateTramiteMutation();
  const [getStudentFromSiga] = useLazyGetStudentFromSigaQuery();

  const [block, setBlock] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [form, setForm] = useState<FormDataState>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<FileData>({ size: 0, data: [] });

  const current_loading = isCreating || block;

  const formReady = useMemo(() => {
    let datos = ['entity_id', 'document_number', 'dependencia_id', 'tramite_type_id', 'asunto', 'folio_count', 'termino'];
    for (let attr of datos) {
      let isValue = form[attr];
      if (!isValue) return false;
    }
    let count_files = file.data.length;
    if (!count_files) return false;
    return true;
  }, [form, file.data]);

  const getEstudiante = async () => {
    if (!person?.document_number) return;
    setBlock(true);
    try {
      const result = await getStudentFromSiga(person.document_number).unwrap();
      const [{ curricula }] = result.data || [{}];
      if (!curricula) throw new Error("No se encontró al estudiante");
      setCode(curricula?.escuela_id || null);
    } catch (err) {
      setCode(null);
    }
    setBlock(false);
  }

  const handleInput = async ({ name, value }: { name: string; value: any }) => {
    let newForm = Object.assign({}, form);
    newForm[name] = value;
    setForm(newForm);
    let newErrors = Object.assign({}, errors);
    newErrors[name] = [];
    setErrors(newErrors);
  }

  const handleFiles = ({ files }: { files: FileList }) => {
    let size_total = file.size;
    let size_limit = 25 * 1024;
    let newFile = Object.assign({}, file);
    let collectFile = collect([...newFile.data]);
    for (let f of Array.from(files)) {
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
        Swal.fire({ icon: 'error', text: `El límite máximo es de 25MB, tamaño actual(${(size_total / (1024 * 1024)).toFixed(2)} MB` });
        return false;
      }
    }
    return false;
  }

  const deleteFile = (index: number, tmpFile: File) => {
    let newFile = Object.assign({}, file);
    newFile.data.splice(index, 1);
    newFile.size = newFile.size - tmpFile.size;
    setFile(newFile);
  }

  const handleSave = async () => {
    const payload = new FormData();
    payload.append('person_id', person.id);
    for (let attr in form) {
      if (attr !== 'files') payload.append(attr, form[attr]);
    }
    file.data.forEach(f => payload.append('files', f));
    payload.append('code', code || '');

    try {
      const result = await createTramite(payload).unwrap();
      const { success, message, tramite: current_tramite } = result;

      if (!success) throw new Error(message);

      await Swal.fire({ icon: 'success', text: message });
      setForm({});
      Router.push({ pathname: '/', query: { slug: current_tramite.slug } });
    } catch (err: any) {
      const response = err?.data || err;
      let message = response?.message || err?.message || "Ocurrió un error al crear el trámite";
      const newErrors: FormErrors = response?.errors || {};

      Swal.fire({ icon: 'warning', text: message });
      setErrors(newErrors);
    }
  }

  const handleCancel = () => {
    setPerson({});
    nextTab('validate', 'validate');
  }

  useEffect(() => {
    if (person.id) getEstudiante();
  }, [person.id]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#00a28a]/10 flex items-center justify-center">
          <FileText className="h-6 w-6 text-[#00a28a]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Registro de Trámite</h2>
          <p className="text-sm text-gray-500">Complete la información del documento</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Entity */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Building2 className="h-4 w-4 text-[#00a28a]" />
            Entidad <span className="text-red-500">*</span>
          </label>
          <SelectEntity
            value={form.entity_id}
            name="entity_id"
            onChange={(e: any, obj: any) => handleInput(obj)}
            disabled={current_loading}
          />
          <Show condicion={errors?.entity_id?.[0]}>
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors?.entity_id?.[0]}
            </p>
          </Show>
        </div>

        {/* Dependencia */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Building2 className="h-4 w-4 text-[#00a28a]" />
            Destino del Documento <span className="text-red-500">*</span>
          </label>
          <SelectDependenciaExterna
            entity_id={form.entity_id}
            code={code}
            name="dependencia_id"
            value={form.dependencia_id || ""}
            onChange={(e: any, obj: any) => handleInput(obj)}
            disabled={!form.entity_id || current_loading}
          />
          <Show condicion={errors?.dependencia_id?.[0]}>
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors?.dependencia_id?.[0]}
            </p>
          </Show>
        </div>

        {/* Tipo de Documento */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 text-[#00a28a]" />
            Tipo del Documento <span className="text-red-500">*</span>
          </label>
          <SelectTramiteType
            name="tramite_type_id"
            value={form.tramite_type_id || ""}
            onChange={(e: any, obj: any) => handleInput(obj)}
            disabled={current_loading}
          />
          <Show condicion={errors?.tramite_type_id?.[0]}>
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors?.tramite_type_id?.[0]}
            </p>
          </Show>
        </div>

        {/* Row: N° Documento and Folios */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Hash className="h-4 w-4 text-[#00a28a]" />
              N° Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="document_number"
              value={form.document_number || ""}
              disabled={current_loading}
              onChange={(e) => handleInput(e.target)}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-[#00a28a] focus:ring-4 focus:ring-[#00a28a]/10 transition-all duration-200 outline-none ${errors?.document_number?.[0] ? 'border-red-300' : 'border-gray-200'
                }`}
              placeholder="Ej: DOC-2024-001"
            />
            <Show condicion={errors?.document_number?.[0]}>
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors?.document_number?.[0]}
              </p>
            </Show>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BookOpen className="h-4 w-4 text-[#00a28a]" />
              N° Folios <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="folio_count"
              value={form.folio_count || ""}
              onChange={(e) => handleInput(e.target)}
              disabled={current_loading}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-[#00a28a] focus:ring-4 focus:ring-[#00a28a]/10 transition-all duration-200 outline-none ${errors?.folio_count?.[0] ? 'border-red-300' : 'border-gray-200'
                }`}
              placeholder="Ej: 5"
            />
            <Show condicion={errors?.folio_count?.[0]}>
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors?.folio_count?.[0]}
              </p>
            </Show>
          </div>
        </div>

        {/* Asunto */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MessageSquare className="h-4 w-4 text-[#00a28a]" />
            Asunto del Trámite <span className="text-red-500">*</span>
          </label>
          <textarea
            name="asunto"
            rows={4}
            value={form.asunto || ""}
            onChange={(e) => handleInput(e.target)}
            disabled={current_loading}
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-[#00a28a] focus:ring-4 focus:ring-[#00a28a]/10 transition-all duration-200 outline-none resize-none ${errors?.asunto?.[0] ? 'border-red-300' : 'border-gray-200'
              }`}
            placeholder="Describa el asunto de su trámite..."
          />
          <Show condicion={errors?.asunto?.[0]}>
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors?.asunto?.[0]}
            </p>
          </Show>
        </div>

        {/* Archivos */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Upload className="h-4 w-4 text-[#00a28a]" />
            Archivos <span className="text-gray-400 text-xs">(25MB máx)</span>
          </label>
          <DropZone
            id="files"
            name="files"
            onChange={handleFiles}
            icon="save"
            result={file.data}
            title="Seleccionar archivo (*.docx, *.pdf, *.zip)"
            accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            onDelete={(e: any) => deleteFile(e.index, e.file)}
            disabled={current_loading}
          />
        </div>

        {/* Términos */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={form.termino || false}
                onChange={(e) => handleInput({ name: 'termino', value: e.target.checked })}
                disabled={current_loading}
                className="sr-only peer"
              />
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${form.termino
                  ? 'bg-[#00a28a] border-[#00a28a]'
                  : 'bg-white border-gray-300 peer-hover:border-[#00a28a]'
                }`}>
                <Show condicion={form.termino}>
                  <CheckSquare className="h-4 w-4 text-white" />
                </Show>
              </div>
            </div>
            <span className="text-sm text-gray-600">
              Declaro bajo penalidad de perjurio, que toda la información proporcionada es correcta y verídica
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={current_loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!formReady || current_loading}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${formReady && !current_loading
                ? 'bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white shadow-lg shadow-[#00a28a]/30 hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {current_loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Registrar Trámite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateTramite;
