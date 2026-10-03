import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  Printer, 
  ArrowLeft,
  School,
  PlusCircle,
  FileText,
  Bell,
  Phone,
  Mail,
  LogOut,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { ApplicationRecord } from '../types';
import { ANNOUNCEMENTS } from '../data/mockData';

interface PortalEncarregadoViewProps {
  onBackToWizard: () => void;
  onPrintVoucher: (app: ApplicationRecord) => void;
  currentApp?: ApplicationRecord;
  guardianApps?: ApplicationRecord[];
  guardianUser?: { name: string; email: string };
  onSelectApp?: (app: ApplicationRecord) => void;
  onLogout?: () => void;
}

export const PortalEncarregadoView: React.FC<PortalEncarregadoViewProps> = ({
  onBackToWizard,
  onPrintVoucher,
  currentApp,
  guardianApps = [],
  guardianUser,
  onSelectApp,
  onLogout
}) => {
  // If list of apps is provided, pick currentApp or the first one
  const activeApp = currentApp || guardianApps[0] || null;

  const guardianName = guardianUser?.name || activeApp?.guardian.name || 'Dr. António Pereira Gaspar';
  const guardianEmail = guardianUser?.email || activeApp?.guardian.email || 'antonio.gaspar@exemplo.ao';
  const guardianPhone = activeApp?.guardian.phone || '+244 922 071 870';
  const isGoogleAccount = guardianEmail.toLowerCase().includes('gmail.com');

  return (
    <div className="w-full bg-[#faf8ff] min-h-[calc(100vh-140px)] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWizard}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#04063f] hover:bg-slate-50 transition-colors shadow-sm"
              title="Voltar à Área Publicitária"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#fd761a]">
                Área Reservada do Encarregado
              </span>
              <h1 className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#04063f]">
                Portal de Matrículas do Educando
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToWizard}
              className="px-4 py-2 rounded-lg bg-[#fd761a] text-white text-xs font-bold hover:bg-[#ea580c] transition-all shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Matricular Novo Educando</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                title="Terminar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Guardian Profile Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
              isGoogleAccount ? 'bg-[#04063f] text-white' : 'bg-[#04063f] text-white'
            }`}>
              {isGoogleAccount ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              ) : (
                'ENC'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isGoogleAccount ? 'Sessão Google Autenticada' : 'Conta de Encarregado Autenticada'}
                </span>
                {isGoogleAccount && (
                  <span className="px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                    Google Sign-In
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-[#04063f]">
                {guardianName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#fd761a]" />
                  {guardianEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#fd761a]" />
                  {guardianPhone}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#04063f] text-xs font-bold inline-block">
              Ano Lectivo: 2024 / 2025
            </span>
          </div>
        </div>

        {/* Multi-student switcher if guardian has more than 1 enrolled child */}
        {guardianApps.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-2">Educandos Registados:</span>
            {guardianApps.map((app) => {
              const isSelected = activeApp?.id === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApp && onSelectApp(app)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#04063f] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>#{app.sequenceNumber}</span>
                  <span>{app.student.name.split(' ')[0]} ({app.academic.grade})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Enrolled Student Card (Simple, clean, no grades, no tuition!) */}
        {activeApp ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#04063f] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                  #{activeApp.sequenceNumber || 1}
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#04063f]">
                    {activeApp.student.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Código de Matrícula: <strong className="text-[#04063f]">{activeApp.id}</strong>
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                activeApp.status === 'Aprovada'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : activeApp.status === 'Rejeitada'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Estado: {activeApp.status}</span>
              </span>
            </div>

            <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Classe Pretendida</span>
                <strong className="text-[#04063f] text-sm block mt-0.5">{activeApp.academic.grade}</strong>
                <span className="text-slate-500 text-[11px]">{activeApp.academic.shift.split(' ')[0]}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Documento de Identificação</span>
                <strong className="text-slate-800 font-mono text-xs block mt-0.5">{activeApp.student.documentNumber}</strong>
                <span className="text-slate-500 text-[11px]">{activeApp.student.age} • {activeApp.student.gender}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Naturalidade / Morada</span>
                <strong className="text-slate-800 text-xs block mt-0.5 truncate">{activeApp.student.birthPlace}</strong>
                <span className="text-slate-500 text-[11px] truncate block">{activeApp.student.address}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ficha Oficial da Matrícula</span>
                <button
                  onClick={() => onPrintVoucher(activeApp)}
                  className="mt-1 w-full py-1.5 rounded bg-white border border-slate-300 text-[#04063f] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Imprimir Ficha</span>
                </button>
              </div>
            </div>

            {/* Document checklist status */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Dossiê Digital:</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  BI / Cédula
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Certificado
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Atestado Médico
                </span>
              </div>
            </div>

            {activeApp.statusNotes && (
              <div className="p-4 bg-blue-50/70 border-t border-blue-100 text-xs text-blue-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#04063f] shrink-0 mt-0.5" />
                <div>
                  <strong>Nota da Secretaria Pedagógica:</strong> {activeApp.statusNotes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#fd761a] mx-auto flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#04063f]">
              Nenhum Educando Matriculado Ainda
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ainda não possui matrículas associadas a esta conta de encarregado ({guardianEmail}). Pode submeter uma nova matrícula online agora mesmo.
            </p>
            <button
              onClick={onBackToWizard}
              className="px-6 py-2.5 rounded-lg bg-[#fd761a] text-white text-xs font-bold hover:bg-[#ea580c] transition-all shadow-md inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Fazer Nova Matrícula Online</span>
            </button>
          </div>
        )}

        {/* Official School Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-[#fd761a]" />
            <h3 className="font-bold text-sm text-[#04063f] uppercase tracking-wide">
              Comunicados Oficiais da Secretaria aos Encarregados
            </h3>
          </div>

          <div className="space-y-3">
            {ANNOUNCEMENTS.map((aviso) => (
              <div
                key={aviso.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-[#04063f] uppercase">{aviso.category}</span>
                  <span className="font-mono">{aviso.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{aviso.title}</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">{aviso.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
