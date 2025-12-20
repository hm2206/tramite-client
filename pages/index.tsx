import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader2, QrCode, ArrowRight } from 'lucide-react';
import Show from "../components/show";
import InfoTramite from "../components/infoTramite";
import TimeLine from "../components/TimeLine";
import moment from "moment";
import { useLazyFindTramiteQuery } from "../store/api/tramiteApi";

const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const Index = (props: any) => {
  const router = useRouter();
  const { query } = router;

  const [slug, setSlug] = useState("");
  const [length, setLength] = useState(0);
  const [fetched, setFetched] = useState(false);

  // RTK Query hook
  const [findTramite, { data, isLoading, isError, isSuccess }] = useLazyFindTramiteQuery();

  const tramite = data?.tramite || {};
  const success = data?.success || false;

  useEffect(() => {
    if (query.slug && query.slug !== slug) {
      const querySlug = query.slug as string;
      setSlug(querySlug);
      setLength(querySlug.length);
      handleFetchTramite(querySlug);
    }
  }, [query.slug]);

  const handleFetchTramite = async (slugParam: string) => {
    setFetched(false);
    try {
      await findTramite(slugParam).unwrap();
    } catch (err) {
      console.error('Error:', err);
    }
    setFetched(true);
  };

  const handleSearch = () => {
    if (length < 10 || isLoading) return;
    try {
      const newQuery: Record<string, string> = {};
      newQuery.slug = slug;
      newQuery.length = String(length);
      newQuery.last_updated = String(moment().valueOf());
      Router.push({ pathname: location.pathname, query: newQuery });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleInput = (value: string) => {
    setSlug(value);
    setLength(value.length);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && length >= 10 && !isLoading) {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSlug('');
    setLength(0);
    setFetched(false);
  };

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Tiempo Real",
      description: "Seguimiento actualizado de tu trámite"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Estado Actual",
      description: "Conoce en qué oficina se encuentra"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Código QR",
      description: "Acceso rápido con tu código único"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#00a28a] via-[#00b89c] to-[#00d4aa] pt-32 pb-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 decoration-grid opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <FileText className="h-4 w-4 mr-2" />
              Mesa de Partes Virtual
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Consulta el estado de
              <br />
              <span className="text-white/90">tu trámite</span>
            </h1>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Ingresa tu código de trámite para conocer el estado actual y seguimiento de tu documento
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ingrese el código de trámite..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#00a28a]/20 focus:bg-white transition-all duration-200 outline-none"
                  value={slug || ""}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={length < 10 || isLoading}
                className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  length >= 10 && !isLoading
                    ? 'bg-gradient-to-r from-[#00a28a] to-[#00c9a7] text-white shadow-lg shadow-[#00a28a]/30 hover:shadow-xl hover:shadow-[#00a28a]/40 hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Buscar</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-white/60 text-sm mt-4">
              El código tiene al menos 10 caracteres
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Show condicion={!fetched && !isLoading}>
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#00a28a]/10 text-[#00a28a] mb-5 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Show>

      {/* Loading State */}
      <Show condicion={isLoading}>
        <section className="py-20">
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="card-elegant p-12">
              <div className="loader-elegant mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Buscando trámite...</h3>
              <p className="text-gray-500">Estamos localizando tu documento en el sistema</p>
            </div>
          </div>
        </section>
      </Show>

      {/* Error State */}
      <Show condicion={fetched && !success && slug}>
        <section className="py-20">
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="card-elegant p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-6">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trámite no encontrado</h3>
              <p className="text-gray-500 mb-6">
                No pudimos encontrar un trámite con el código <span className="font-medium text-gray-700">"{slug}"</span>
              </p>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </section>
      </Show>

      {/* Success State - Results */}
      <Show condicion={success}>
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success Banner */}
            <div className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-700 font-medium">
                Trámite encontrado exitosamente
              </p>
            </div>

            {/* Tramite Info */}
            <div className="mb-8">
              <InfoTramite tramite={tramite} />
            </div>

            {/* QR Code */}
            <Show condicion={tramite?.code_qr}>
              <div className="flex justify-center mb-12">
                <div className="card-elegant p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <QrCode className="h-5 w-5 text-[#00a28a]" />
                    <span className="font-semibold text-gray-700">Código QR del Trámite</span>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-white rounded-xl p-2 border border-gray-100">
                    <img
                      src={tramite?.code_qr || ""}
                      alt="Código QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Escanea para acceso rápido</p>
                </div>
              </div>
            </Show>

            {/* Timeline */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00a28a]/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#00a28a]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Seguimiento del Trámite</h2>
                  <p className="text-gray-500 text-sm">Historial de movimientos de tu documento</p>
                </div>
              </div>
              <TimeLine tramite={tramite} last_updated={query?.last_updated} {...props} />
            </div>
          </div>
        </section>
      </Show>

      {/* Footer spacing */}
      <div className="h-12"></div>
    </div>
  );
};

export default Index;
