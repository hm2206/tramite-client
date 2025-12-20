import React, { useContext, useEffect, useState } from 'react';
import { X, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import FormPerson from './formPerson';
import { authentication } from '../services/apis';
import { TramiteContext } from '../context/TramiteContext';
import Swal from 'sweetalert2';

interface CreatePersonProps {
  onCancel?: (() => void) | null;
  readOnly?: string[];
}

const CreatePerson: React.FC<CreatePersonProps> = ({ onCancel = null, readOnly = [] }) => {
  const { person, setPerson, setTab, setComplete } = useContext(TramiteContext);

  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [current_loading, setCurrentLoading] = useState(false);

  const handleInput = (e: any, { name, value }: { name: string; value: any }) => {
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
        setErrors({});
        await Swal.fire({ icon: 'success', text: message });
        setTab('tramite');
        setComplete((prev: string[]) => [...prev, 'validate']);
      }).catch(err => {
        try {
          let { response } = err;
          if (typeof response != 'object') throw new Error("No se pudo guardar los datos");
          let { data } = response;
          if (typeof data != 'object') throw new Error(err.message);
          Swal.fire({ icon: 'warning', text: data.message || err.message });
          setErrors(data.errors || {});
        } catch (ex: any) {
          Swal.fire({ icon: 'error', text: ex.message });
        }
      });
    setCurrentLoading(false);
  }

  useEffect(() => {
    if (person) setForm(person);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
          <UserPlus className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-800">Registro de Nueva Persona</h3>
          <p className="text-sm text-blue-600">Complete sus datos personales</p>
        </div>
      </div>

      <FormPerson
        form={form}
        onChange={handleInput}
        readOnly={readOnly}
        errors={errors}
      >
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
            disabled={current_loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white font-semibold shadow-lg shadow-[#00a28a]/30 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {current_loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </FormPerson>
    </div>
  )
}

export default CreatePerson;
