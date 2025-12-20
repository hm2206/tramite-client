import React, { useState } from "react";
import { User, FileText, Building2, Mail, MapPin, IdCard, Hash, MessageSquare, Paperclip, ExternalLink, X } from 'lucide-react';
import Show from "./show";

interface FileInfo {
  name: string;
  url: string;
}

interface Person {
  document_type?: { name?: string };
  document_number?: string;
  fullname?: string;
  address?: string;
  email_contact?: string;
}

interface Dependencia {
  nombre?: string;
}

interface TramiteType {
  description?: string;
}

interface TramiteInfo {
  person?: Person;
  dependencia?: Dependencia;
  tramite_type?: TramiteType;
  document_number?: string;
  asunto?: string;
  files?: FileInfo[];
}

interface InfoTramiteProps {
  tramite?: TramiteInfo;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  capitalize?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, capitalize }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="w-10 h-10 rounded-lg bg-[#00a28a]/10 flex items-center justify-center flex-shrink-0">
      <span className="text-[#00a28a]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`font-medium text-gray-800 ${capitalize ? 'capitalize' : ''} ${!value ? 'text-gray-400 italic' : ''}`}>
        {value || 'No especificado'}
      </p>
    </div>
  </div>
);

const InfoTramite: React.FC<InfoTramiteProps> = ({ tramite }) => {
  const [show_file, setshow_file] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Datos del Remitente */}
        <div className="card-elegant">
          <div className="bg-gradient-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Datos del Remitente</h3>
            </div>
          </div>
          <div className="px-6 py-2">
            <InfoRow
              icon={<IdCard className="h-5 w-5" />}
              label="Tipo de Documento"
              value={tramite?.person?.document_type?.name}
            />
            <InfoRow
              icon={<Hash className="h-5 w-5" />}
              label="Número de Documento"
              value={tramite?.person?.document_number}
            />
            <InfoRow
              icon={<User className="h-5 w-5" />}
              label="Nombres y Apellidos"
              value={tramite?.person?.fullname?.toUpperCase()}
            />
            <InfoRow
              icon={<MapPin className="h-5 w-5" />}
              label="Dirección"
              value={tramite?.person?.address}
            />
            <InfoRow
              icon={<Mail className="h-5 w-5" />}
              label="Correo Electrónico"
              value={tramite?.person?.email_contact}
            />
          </div>
        </div>

        {/* Datos del Documento */}
        <div className="card-elegant">
          <div className="bg-gradient-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Datos del Documento</h3>
            </div>
          </div>
          <div className="px-6 py-2">
            <InfoRow
              icon={<Building2 className="h-5 w-5" />}
              label="Dependencia Origen"
              value={tramite?.dependencia?.nombre || 'Exterior'}
              capitalize
            />
            <InfoRow
              icon={<FileText className="h-5 w-5" />}
              label="Tipo de Documento"
              value={tramite?.tramite_type?.description}
            />
            <InfoRow
              icon={<Hash className="h-5 w-5" />}
              label="Número de Documento"
              value={tramite?.document_number}
            />
            <InfoRow
              icon={<MessageSquare className="h-5 w-5" />}
              label="Asunto"
              value={tramite?.asunto}
            />
            <div className="flex items-start gap-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-[#00a28a]/10 flex items-center justify-center flex-shrink-0">
                <Paperclip className="h-5 w-5 text-[#00a28a]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Archivos Adjuntos</p>
                <button
                  onClick={() => setshow_file(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Ver Archivos
                  <Show condicion={!!tramite?.files?.length}>
                    <span className="ml-1 px-2 py-0.5 text-xs bg-[#00a28a] text-white rounded-full">
                      {tramite?.files?.length}
                    </span>
                  </Show>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Archivos */}
      <Show condicion={show_file}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setshow_file(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Paperclip className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Archivos Adjuntos</h3>
              </div>
              <button
                onClick={() => setshow_file(false)}
                className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <Show condicion={!!tramite?.files?.length}>
                <div className="space-y-3">
                  {tramite?.files?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-500">Documento PDF</p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a28a] text-white font-medium hover:bg-[#008f7a] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir
                      </a>
                    </div>
                  ))}
                </div>
              </Show>
              <Show condicion={!tramite?.files?.length}>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Paperclip className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No hay archivos adjuntos</p>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default InfoTramite;
