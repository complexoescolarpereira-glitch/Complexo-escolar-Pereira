import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  ArrowLeft,
  FileCheck,
  Building2,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { ApplicationRecord, GradeLevel } from '../types';
import { GRADE_CAPACITY } from '../data/mockData';

interface AdminSecretariaViewProps {
  applications: ApplicationRecord[];
  onUpdateStatus: (id: string, newStatus: ApplicationRecord['status'], note?: string) => void;
  onPrintVoucher: (app: ApplicationRecord) => void;
  onBackToWizard: () => void;
}

export const AdminSecretariaView: React.FC<AdminSecretariaViewProps> = ({
  applications,
  onUpdateStatus,
  onPrintVoucher,
  onBackToWizard
}) => {
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchGrade = filterGrade === 'all' || app.academic.grade === filterGrade;
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchSearch =
      app.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchStatus && matchSearch;
  });

  const totalCapacity = GRADE_CAPACITY.reduce((acc, curr) => acc + curr.maxCapacity, 0);
  const totalEnrolled = GRADE_CAPACITY.reduce((acc, curr) => acc + curr.enrolled, 0);

  return (
    <div className="w-full bg-[#faf8ff] min-h-[calc(100vh-280px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWizard}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#04063f] hover:bg-slate-50 transition-colors shadow-sm"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#fd761a]">
                Secretaria Pedagógica & Acesso Administrativo
              </span>
              <h1 className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#04063f]">
                Gestão de Candidaturas e Lotação de Turmas
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#04063f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#fd761a]" />
              <span>Sessão Autenticada: Secretaria Cuanza Sul</span>
            </div>
          </div>
        </div>

        {/* Capacity / Quota Cards (25 Students Per Class Strictly) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#04063f]">
                Mapa de Vagas Oficiais (Padrão Pedagógico de 25 Alunos por Turma)
              </h3>
              <p className="text-xs text-slate-500">
                Lotação global: <strong>{totalEnrolled}</strong> de <strong>{totalCapacity}</strong> vagas preenchidas ({Math.round((totalEnrolled / totalCapacity) * 100)}%).
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#eaedff] text-[#04063f] text-xs font-bold font-mono">
              Iniciação à 6.ª Classe
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
            {GRADE_CAPACITY.map((gc) => {
              const isFull = gc.enrolled >= gc.maxCapacity;
              const remaining = gc.maxCapacity - gc.enrolled;
              return (
                <div
                  key={gc.grade}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    isFull
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : remaining <= 2
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    {gc.shift}
                  </span>
                  <div className="font-bold text-sm text-[#04063f] mt-1">
                    {gc.grade}
                  </div>
                  <div className="mt-2 text-xs flex items-center justify-between">
                    <span className="font-mono font-semibold">{gc.enrolled}/{gc.maxCapacity}</span>
                    <span className={`text-[10px] font-bold ${
                      isFull ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {isFull ? 'Esgotado' : `${remaining} vagas`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome do aluno, código (CEPP-...), BI ou encarregado..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Classe:</span>
            </div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
            >
              <option value="all">Todas as Classes</option>
              <option value="Iniciação">Iniciação</option>
              <option value="1.ª Classe">1.ª Classe</option>
              <option value="2.ª Classe">2.ª Classe</option>
              <option value="3.ª Classe">3.ª Classe</option>
              <option value="4.ª Classe">4.ª Classe</option>
              <option value="5.ª Classe">5.ª Classe</option>
              <option value="6.ª Classe">6.ª Classe</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-1">
              <span>Estado:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
            >
              <option value="all">Todos os Estados</option>
              <option value="Pendente">Pendente</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Documentação Pendente">Doc. Pendente</option>
              <option value="Rejeitada">Rejeitada</option>
            </select>
          </div>
        </div>

        {/* Applications Master Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>A exibir {filteredApps.length} candidaturas encontradas</span>
            <span className="font-semibold text-[#04063f]">Secretaria Escolar CEP Pereira</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#04063f] text-white uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Código / Data</th>
                  <th className="py-3 px-4">Educando (Aluno)</th>
                  <th className="py-3 px-4">Classe & Turno</th>
                  <th className="py-3 px-4">Encarregado / Contacto</th>
                  <th className="py-3 px-4">Documentos</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <strong className="text-[#04063f] block">{app.id}</strong>
                      <span className="text-[10px] text-slate-400">{app.createdAt}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={app.student.avatarUrl || '/src/assets/images/cep_student_portrait_1790861275389.jpg'}
                          alt={app.student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <strong className="text-slate-900 block font-semibold">{app.student.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">BI: {app.student.documentNumber} ({app.student.age})</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-[#04063f] block font-semibold">{app.academic.grade}</strong>
                      <span className="text-[10px] text-slate-500">{app.academic.shift.split(' ')[0]}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold block">{app.guardian.name}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{app.guardian.phone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          title={app.documents.identityDoc ? 'BI / Cédula Anexada' : 'Falta BI'}
                          className={`w-2 h-2 rounded-full ${
                            app.documents.identityDoc ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <span
                          title={app.documents.certificateDoc ? 'Certificado Anexado' : 'Falta Certificado'}
                          className={`w-2 h-2 rounded-full ${
                            app.documents.certificateDoc ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span
                          title={app.documents.medicalDoc ? 'Atestado Médico Anexado' : 'Falta Atestado'}
                          className={`w-2 h-2 rounded-full ${
                            app.documents.medicalDoc ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-[10px] text-slate-500 ml-1">3 anexos</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Aprovada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Documentação Pendente'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'Rejeitada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Ver Dossiê Completo"
                        >
                          <Eye className="w-4 h-4 text-[#04063f]" />
                        </button>
                        <button
                          onClick={() => onPrintVoucher(app)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Imprimir Ficha de Matrícula"
                        >
                          <Printer className="w-4 h-4 text-[#fd761a]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Student Dossier & Approval Controls */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedApp.student.avatarUrl || '/src/assets/images/cep_student_portrait_1790861275389.jpg'}
                    alt={selectedApp.student.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#04063f]">{selectedApp.student.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">Código: {selectedApp.id} • {selectedApp.academic.grade}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  ✕
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Data de Nascimento / Idade</span>
                  <p className="font-semibold text-slate-800">{selectedApp.student.birthDate} ({selectedApp.student.age})</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Naturalidade</span>
                  <p className="font-semibold text-slate-800">{selectedApp.student.birthPlace}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Morada Residencial</span>
                  <p className="font-semibold text-slate-800">{selectedApp.student.address}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Turno / Ingresso</span>
                  <p className="font-semibold text-slate-800">{selectedApp.academic.shift} • {selectedApp.academic.entryType}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Encarregado / Parentesco</span>
                  <p className="font-semibold text-slate-800">{selectedApp.guardian.name} ({selectedApp.guardian.kinship})</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Contactos</span>
                  <p className="font-semibold text-slate-800 font-mono">{selectedApp.guardian.phone} • {selectedApp.guardian.email}</p>
                </div>
              </div>

              {/* Attached Documents Verification Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <span className="font-bold text-[#04063f] block">Ficheiros Submetidos pelo Encarregado:</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>1. Cédula ou BI do Educando:</span>
                    <strong className="text-emerald-700 font-mono">{selectedApp.documents.identityFileName || 'Anexado'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>2. Certificado / Declaração Escolar:</span>
                    <strong className="text-emerald-700 font-mono">{selectedApp.documents.certificateFileName || 'Anexado'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>3. Atestado Médico e Vacinas:</span>
                    <strong className="text-emerald-700 font-mono">{selectedApp.documents.medicalFileName || 'Anexado'}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons to Change Status */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, 'Aprovada', 'Vaga confirmada. Turma atribuída pela secretaria.');
                      setSelectedApp({ ...selectedApp, status: 'Aprovada' });
                    }}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Vaga & Matrícula</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, 'Documentação Pendente', 'Solicitada certidão original para conferência.');
                      setSelectedApp({ ...selectedApp, status: 'Documentação Pendente' });
                    }}
                    className="px-3.5 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Solicitar Documentos</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onPrintVoucher(selectedApp);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-[#fd761a]" />
                    <span>Imprimir Ficha</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, 'Rejeitada', 'Candidatura não cumpre os requisitos regulamentares.');
                      setSelectedApp({ ...selectedApp, status: 'Rejeitada' });
                    }}
                    className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
