import React, { Fragment, useEffect, useState, useMemo, ReactNode } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import {
  Send,
  ArrowUpRight,
  Trash2,
  CheckCircle,
  X,
  Check,
  MessageCircle,
  PenLine,
  FileText,
  ExternalLink,
  ChevronDown,
  Loader2,
  Building2,
  Hash,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import Show from "./show";
import moment from "moment";
import { getTimeline } from '../services/request/tramite';

moment.locale('es');

const options = {
  FILE: 'file[show]',
  INFO: 'info[show]',
  TRAMITE: 'tramite[show]',
} as const;

interface FileInfo {
  name: string;
  url: string;
}

interface InfoData {
  description?: string;
  files?: FileInfo[];
}

interface Dependencia {
  nombre?: string;
}

interface TramiteData {
  dependencia_origen?: { nombre?: string };
  current_tramite_type?: { description?: string };
  document_number?: string;
  asunto?: string;
  folio_count?: string | number;
  observation?: string;
  files?: FileInfo[];
}

interface TrackingData {
  status: string;
  updated_at: string;
  dependencia?: Dependencia;
  person?: Record<string, any>;
  tramite?: TramiteData;
  info?: InfoData;
}

interface StatusMetadata {
  icon?: ReactNode;
  message?: string;
  name?: string;
  color?: string;
  bgColor?: string;
}

interface ItemLineProps {
  tracking: TrackingData;
  onClick?: (tramite: TramiteData) => void;
}

const ItemLine: React.FC<ItemLineProps> = ({ tracking, onClick }) => {
  const { dependencia, tramite, info } = tracking;
  const [option, setOption] = useState<string | boolean>(false);

  const getMetadata = (status: string): StatusMetadata => {
    const icons: Record<string, StatusMetadata> = {
      DERIVADO: {
        icon: <ArrowUpRight className="h-5 w-5 text-white" />,
        message: "La dependencia ha derivado el documento a: ",
        color: "#3b82f6",
        bgColor: "bg-blue-500",
      },
      ACEPTADO: {
        icon: <CheckCircle className="h-5 w-5 text-white" />,
        message: "Fue Aceptado en: ",
        color: "#10b981",
        bgColor: "bg-emerald-500",
      },
      RECHAZADO: {
        icon: <X className="h-5 w-5 text-white" />,
        message: "Fue rechazado en: ",
        color: "#ef4444",
        bgColor: "bg-red-500",
      },
      ANULADO: {
        icon: <Trash2 className="h-5 w-5 text-white" />,
        message: "Fue anulado en: ",
        color: "#6b7280",
        bgColor: "bg-gray-500",
      },
      ENVIADO: {
        icon: <Send className="h-5 w-5 text-white" />,
        message: "Fue enviado a: ",
        color: "#8b5cf6",
        bgColor: "bg-violet-500",
      },
      FINALIZADO: {
        icon: <Check className="h-5 w-5 text-white" />,
        message: "Puede ir a recoger su Documento en: ",
        color: "#00a28a",
        bgColor: "bg-[#00a28a]",
      },
      RESPONDIDO: {
        icon: <MessageCircle className="h-5 w-5 text-white" />,
        message: "La Oficina respondió a: ",
        name: "RESPUESTA",
        color: "#f59e0b",
        bgColor: "bg-amber-500",
      },
      REGISTRADO: {
        icon: <PenLine className="h-5 w-5 text-white" />,
        message: "Fue registrado en ",
        name: "REGISTRADO",
        color: "#00a28a",
        bgColor: "bg-[#00a28a]",
      },
    };
    return icons[status] || {
      icon: <FileText className="h-5 w-5 text-white" />,
      color: "#00a28a",
      bgColor: "bg-[#00a28a]",
    };
  };

  const current_status = getMetadata(tracking.status);
  const depName = dependencia?.nombre || 'EXTERIOR';

  return (
    <Fragment>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date={moment(tracking.updated_at).format("h:mm a")}
        contentStyle={{
          background: "#ffffff",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          border: "1px solid #e5e7eb",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
        contentArrowStyle={{ borderRight: `10px solid ${current_status.color}` }}
        iconStyle={{ background: current_status.color, boxShadow: `0 0 0 4px ${current_status.color}20` }}
        icon={current_status.icon}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${current_status.bgColor}`}>
                {current_status.name || tracking.status}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {moment(tracking.updated_at).format("LL")}
            </span>
          </div>

          <p className="text-gray-600">
            {current_status.message}
            <span className="inline-flex items-center px-2 py-1 ml-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
              <Building2 className="h-3 w-3 mr-1" />
              {depName.toUpperCase()}
            </span>
          </p>

          <Show condicion={!!info?.description}>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-sm text-gray-600">{info?.description}</p>
            </div>
          </Show>

          <div className="flex flex-wrap gap-2 pt-2">
            <Show condicion={!!(info?.files?.length)}>
              <button
                onClick={() => setOption(options.FILE)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
                Ver Archivos
                <span className="px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                  {info?.files?.length}
                </span>
              </button>
            </Show>

            <Show condicion={Object.keys(tramite || {}).length > 0}>
              <button
                onClick={() => typeof onClick === 'function' && tramite ? onClick(tramite) : null}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00a28a]/10 text-[#00a28a] text-sm font-medium hover:bg-[#00a28a]/20 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Ver Información
              </button>
            </Show>
          </div>
        </div>
      </VerticalTimelineElement>

      {/* Modal de archivos */}
      <Show condicion={option === options.FILE}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOption("")} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="bg-gradient-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Paperclip className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Archivos del Seguimiento</h3>
              </div>
              <button
                onClick={() => setOption("")}
                className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-3">
                {info?.files?.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-500" />
                      </div>
                      <span className="font-medium text-gray-800">{f.name}</span>
                    </div>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00a28a] text-white text-sm font-medium hover:bg-[#008f7a] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Fragment>
  );
};

interface TramiteInfo {
  id?: number;
  slug?: string;
}

interface TimeLineProps {
  tramite?: TramiteInfo;
  last_updated?: number | null;
}

const TimeLine: React.FC<TimeLineProps> = ({ tramite = {}, last_updated = null }) => {
  const [current_loading, setCurrentLoading] = useState(false);
  const [option, setOption] = useState("");
  const [datos, setDatos] = useState<TrackingData[]>([]);
  const [page, setPage] = useState(1);
  const [last_page, setLastPage] = useState(0);
  const [current_tramite, setCurrentTramite] = useState<TramiteData>({});

  const fetchTimeline = async (add = false) => {
    if (!tramite.slug) return;
    setCurrentLoading(true);
    try {
      const res = await getTimeline(tramite.slug, page);
      const { trackings } = res;
      setPage(trackings.page || 1);
      setLastPage(trackings.lastPage || 0);
      setDatos(add ? [...datos, ...trackings.data] : trackings.data);
    } catch (err) {
      console.log(err);
    }
    setCurrentLoading(false);
  };

  const clearDatos = () => {
    setPage(1);
    setDatos([]);
    setLastPage(0);
  };

  const isNextPage = useMemo(() => {
    return last_page >= (page + 1);
  }, [last_page, page]);

  useEffect(() => {
    if (tramite.id) fetchTimeline();
    return () => clearDatos();
  }, [tramite.id, last_updated]);

  useEffect(() => {
    if (page > 1) fetchTimeline(true);
  }, [page]);

  const depOrigenNombre = current_tramite?.dependencia_origen?.nombre || "Exterior";
  const tipoDocDesc = current_tramite?.current_tramite_type?.description || "";

  return (
    <div className="timeline-elegant">
      <VerticalTimeline lineColor="#e5e7eb">
        {datos?.map((track, iter) => (
          <ItemLine
            tracking={track}
            key={`list-line-${iter}`}
            onClick={(tra) => {
              setOption(options.TRAMITE);
              setCurrentTramite(tra);
            }}
          />
        ))}
      </VerticalTimeline>

      {/* Loading */}
      <Show condicion={current_loading}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-lg">
            <Loader2 className="h-5 w-5 text-[#00a28a] animate-spin" />
            <span className="text-gray-600 font-medium">Cargando seguimiento...</span>
          </div>
        </div>
      </Show>

      {/* Load More Button */}
      <Show condicion={isNextPage && !current_loading}>
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-[#00a28a] hover:text-[#00a28a] transition-all duration-200"
          >
            <ChevronDown className="h-5 w-5" />
            Cargar más registros
          </button>
        </div>
      </Show>

      {/* Empty State */}
      <Show condicion={!current_loading && datos.length === 0}>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No hay registros de seguimiento</p>
        </div>
      </Show>

      {/* Modal de información del trámite */}
      <Show condicion={option === options.TRAMITE}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOption('')} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="bg-gradient-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Información del Trámite</h3>
              </div>
              <button
                onClick={() => setOption('')}
                className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-4">
                {/* Dependencia Origen */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-[#00a28a]" />
                    <span className="text-sm text-gray-500">Dependencia Origen</span>
                  </div>
                  <p className="font-medium text-gray-800 capitalize">{depOrigenNombre}</p>
                </div>

                {/* Tipo Documento */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-[#00a28a]" />
                    <span className="text-sm text-gray-500">Tipo de Documento</span>
                  </div>
                  <p className="font-medium text-gray-800">{tipoDocDesc || 'No especificado'}</p>
                </div>

                {/* N° Documento */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Hash className="h-5 w-5 text-[#00a28a]" />
                    <span className="text-sm text-gray-500">N° de Documento</span>
                  </div>
                  <p className="font-medium text-gray-800">{current_tramite?.document_number || 'No especificado'}</p>
                </div>

                {/* Asunto */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-5 w-5 text-[#00a28a]" />
                    <span className="text-sm text-gray-500">Asunto</span>
                  </div>
                  <p className="font-medium text-gray-800">{current_tramite?.asunto || 'No especificado'}</p>
                </div>

                {/* N° Folio */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-[#00a28a]" />
                    <span className="text-sm text-gray-500">N° de Folios</span>
                  </div>
                  <p className="font-medium text-gray-800">{current_tramite?.folio_count || 'No especificado'}</p>
                </div>

                {/* Observación */}
                <Show condicion={!!current_tramite?.observation}>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm text-amber-700">Observación</span>
                    </div>
                    <p className="text-amber-800">{current_tramite?.observation}</p>
                  </div>
                </Show>

                {/* Archivos */}
                <Show condicion={!!current_tramite?.files?.length}>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Paperclip className="h-5 w-5 text-[#00a28a]" />
                      <span className="font-semibold text-gray-800">Archivos Adjuntos</span>
                    </div>
                    <div className="space-y-2">
                      {current_tramite?.files?.map((f, indexF) => (
                        <a
                          href={f.url}
                          key={`list-file-${indexF}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <span className="flex-1 font-medium text-gray-700">{f.name}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#00a28a]" />
                        </a>
                      ))}
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TimeLine;
