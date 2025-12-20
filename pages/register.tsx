import React, { useContext } from 'react';
import { CheckCircle, UserCheck, FileText } from 'lucide-react';
import { TramiteContext, TramiteProvider } from '../context/TramiteContext';

interface StepIndicatorProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  number,
  title,
  description,
  isActive,
  isCompleted,
  icon
}) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-[#00a28a]/10 border-2 border-[#00a28a]'
        : isCompleted
          ? 'bg-emerald-50 border-2 border-emerald-200'
          : 'bg-gray-50 border-2 border-gray-100'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-[#00a28a] to-[#00c9a7] text-white shadow-lg shadow-[#00a28a]/30'
          : isCompleted
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-200 text-gray-400'
      }`}>
        {isCompleted ? <CheckCircle className="h-6 w-6" /> : icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold transition-colors ${
          isActive ? 'text-[#00a28a]' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          isActive ? 'text-gray-600' : isCompleted ? 'text-emerald-500' : 'text-gray-400'
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
};

const ItemRegister = () => {
  const { Component, tab, complete } = useContext(TramiteContext);

  const steps = [
    {
      id: 'validate',
      number: 1,
      title: 'Validar Datos',
      description: 'Verificar datos personales',
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      id: 'tramite',
      number: 2,
      title: 'Crear Trámite',
      description: 'Registrar documento',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#00a28a] via-[#00b89c] to-[#00d4aa] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
            <FileText className="h-4 w-4 mr-2" />
            Nuevo Trámite
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Registrar Trámite Documentario
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Complete los siguientes pasos para registrar su documento en mesa de partes
          </p>
        </div>
      </section>

      {/* Steps and Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Steps Indicator */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <StepIndicator
                key={step.id}
                number={step.number}
                title={step.title}
                description={step.description}
                isActive={tab === step.id}
                isCompleted={complete.includes(step.id)}
                icon={step.icon}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00a28a] to-[#00c9a7] transition-all duration-500 ease-out"
              style={{
                width: complete.includes('tramite')
                  ? '100%'
                  : complete.includes('validate')
                    ? '50%'
                    : tab === 'validate'
                      ? '25%'
                      : '75%'
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
          {Component}
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <TramiteProvider>
      <ItemRegister />
    </TramiteProvider>
  );
};

export default Register;
