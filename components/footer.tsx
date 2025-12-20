import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { assetPath } from "@/utils/assetPath";

interface AppInfo {
  name?: string;
  support_link?: string;
  support_name?: string;
  icon?: string;
}

interface FooterProps {
  app: AppInfo;
}

const Footer: React.FC<FooterProps> = ({ app }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00a28a] to-[#00c9a7] flex items-center justify-center">
                {app.icon ? (
                  <img
                    src={app.icon}
                    alt="Logo"
                    className="h-7 w-7 object-contain"
                  />
                ) : (
                  <FileText className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {app.name || "Mesa de Partes"}
                </h3>
                <p className="text-sm text-gray-400">
                  Sistema de Tramite Documentario
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Plataforma digital para la gestión y seguimiento de documentos.
              Consulta el estado de tu trámite en tiempo real.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={app.support_link || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {app.support_name || "Soporte"}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Acceso Rápido
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={assetPath("")}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <Search className="h-4 w-4 text-[#00a28a] group-hover:text-[#00c9a7]" />
                  Consultar Trámite
                </Link>
              </li>
              <li>
                <Link
                  href={assetPath("/register")}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <FileText className="h-4 w-4 text-[#00a28a] group-hover:text-[#00c9a7]" />
                  Nuevo Trámite
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:soporte@example.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#00a28a]" />
                  Correo de Soporte
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-4 w-4 text-[#00a28a]" />
                  Mesa de Partes
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4 text-[#00a28a]" />
                  Oficina Principal
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} {app.name || "Mesa de Partes"}. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-600">
                Desarrollado con tecnología moderna
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00a28a] animate-pulse"></div>
                <span className="text-xs text-gray-500">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
