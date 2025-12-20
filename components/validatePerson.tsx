import React, { useContext, useState } from 'react';
import { Search, User, AlertCircle, UserPlus, X, ArrowRight, Loader2 } from 'lucide-react';
import { TramiteContext } from '../context/TramiteContext';
import { authentication } from '../services/apis';
import Show from './show';
import FormPerson from './formPerson';
import CreatePerson from './createPerson';

const ValidatePerson = () => {
  const { setPerson, person, nextTab } = useContext(TramiteContext);

  const [block, setBlock] = useState(false);
  const [query_search, setQuerySearch] = useState("");
  const [is_error, setIsError] = useState(false);
  const [current_loading, setCurrentLoading] = useState(false);
  const [is_register, setIsRegister] = useState(false);
  const [read_only, setReadOnly] = useState<string[]>([]);

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
      }).catch(async err => {
        await findStudent();
      });
    setCurrentLoading(false);
  }

  const findStudent = async () => {
    await authentication.get(`apis/siga/get_resolver?url=alumnos/dni/${query_search}`)
      .then(res => {
        let [{ persona }] = res.data.data;
        if (!persona) throw new Error("No se encontró al estudiante");
        setPerson({
          document_type_id: '01',
          document_number: persona.numero_documento,
          ape_pat: persona.apellido_paterno,
          ape_mat: persona.apellido_materno,
          name: persona.nombres,
          date_of_birth: persona.fecha_nacimiento,
          profession: 'Sr(a)',
          gender: persona?.sexo,
          email_contact: persona?.email || 'tramite_client@unia.edu.pe',
          cod_dep: persona?.ubigeo?.departamento,
          cod_pro: persona?.ubigeo?.provincia,
          cod_dis: persona?.ubigeo?.distrito,
          marital_status: "S",
          phone: "999999999",
          address: "S/D"
        });

        setReadOnly([
          'document_type_id', 'document_number', 'ape_pat',
          'ape_mat', 'name', 'date_of_birth', 'profession',
          'gender', 'cod_dep', 'cod_pro', 'cod_dis'
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query_search.length >= 3 && !current_loading && !block) {
      findPerson();
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#00a28a]/10 flex items-center justify-center">
          <User className="h-6 w-6 text-[#00a28a]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Validar Persona</h2>
          <p className="text-sm text-gray-500">Ingrese su número de documento para continuar</p>
        </div>
      </div>

      {/* Search Box */}
      <Show condicion={!isPerson && !is_register}>
        <div className="space-y-6">
          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="query_search"
                  placeholder="Ingrese su N° de Documento"
                  className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#00a28a] focus:ring-4 focus:ring-[#00a28a]/10 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={current_loading || block}
                  value={query_search || ""}
                  onChange={(e) => {
                    setIsError(false);
                    setQuerySearch(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={findPerson}
                disabled={query_search.length <= 3 || current_loading || block}
                className={`px-6 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${query_search.length > 3 && !current_loading && !block
                    ? 'bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white shadow-lg shadow-[#00a28a]/30 hover:shadow-xl hover:shadow-[#00a28a]/40'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {current_loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span className="hidden sm:inline">Buscar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          <Show condicion={current_loading}>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="loader-elegant"></div>
                <p className="text-gray-500 font-medium">Buscando persona...</p>
              </div>
            </div>
          </Show>

          {/* Error State */}
          <Show condicion={!current_loading && is_error}>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Persona no encontrada</h3>
              <p className="text-gray-500 mb-6">
                No se encontró a la persona con el N° Documento: <span className="font-semibold text-gray-700">{query_search}</span>
              </p>
              <button
                onClick={() => setIsRegister(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white font-semibold shadow-lg shadow-[#00a28a]/30 hover:shadow-xl transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                Registrarse
              </button>
            </div>
          </Show>
        </div>
      </Show>

      {/* Show Person Info */}
      <Show condicion={!is_register && isPerson}>
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <p className="text-emerald-700 font-medium">Persona encontrada exitosamente</p>
            </div>
          </div>

          <FormPerson form={person} disabled>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
                Cancelar
              </button>
              <button
                onClick={() => nextTab('validate', 'tramite')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white font-semibold shadow-lg shadow-[#00a28a]/30 hover:shadow-xl transition-all duration-300"
              >
                Continuar
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </FormPerson>
        </div>
      </Show>

      {/* Register New Person */}
      <Show condicion={is_register}>
        <CreatePerson readOnly={read_only} onCancel={handleCancel} />
      </Show>
    </div>
  )
}

export default ValidatePerson;
