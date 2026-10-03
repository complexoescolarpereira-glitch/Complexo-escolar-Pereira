import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Users, 
  UserCheck, 
  Globe, 
  QrCode, 
  Eye, 
  CheckCircle2, 
  Download, 
  Trash2, 
  Printer, 
  Plus, 
  Save, 
  Send, 
  Lock, 
  Unlock, 
  Search, 
  Phone,
  School,
  X,
  Upload,
  Database
} from 'lucide-react';
import { 
  ApplicationRecord, 
  EnrollmentPeriodConfig, 
  GuardianRecord, 
  AdminUser, 
  PublicContentConfig,
  HighlightArticle,
  GalleryPhoto
} from '../types';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import { 
  isSupabaseConnected, 
  getStoredSupabaseConfig, 
  SupabaseConfig 
} from '../services/supabaseClient';

interface AdminPanelProps {
  applications: ApplicationRecord[];
  enrollmentPeriod: EnrollmentPeriodConfig;
  guardians: GuardianRecord[];
  admins: AdminUser[];
  publicContent: PublicContentConfig;
  onUpdatePeriod: (config: EnrollmentPeriodConfig) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationRecord['status'], note?: string) => void;
  onDeleteApplication: (id: string) => void;
  onAddAdmin: (newAdmin: Omit<AdminUser, 'id' | 'createdAt'>, password?: string) => void;
  onDeleteAdmin: (id: string) => void;
  onSaveContent: (newContent: PublicContentConfig) => void;
  onPrintVoucher: (app: ApplicationRecord) => void;
  onOpenQRCodePoster: () => void;
  onViewPublicSite: () => void;
  onSupabaseConfigSaved?: (config: SupabaseConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applications,
  enrollmentPeriod,
  guardians,
  admins,
  publicContent,
  onUpdatePeriod,
  onUpdateStatus,
  onDeleteApplication,
  onAddAdmin,
  onDeleteAdmin,
  onSaveContent,
  onPrintVoucher,
  onOpenQRCodePoster,
  onViewPublicSite,
  onSupabaseConfigSaved
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'matriculas' | 'encarregados' | 'administradores' | 'conteudo_site' | 'qrcode' | 'supabase'>('dashboard');

  // Supabase Multi-Device Modal State
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(() => isSupabaseConnected());
  const [currentSupabaseConfig, setCurrentSupabaseConfig] = useState(() => getStoredSupabaseConfig());

  // Search & Filter
  const [appSearch, setAppSearch] = useState('');
  const [appGradeFilter, setAppGradeFilter] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Selected App for Detailed View Modal (Eye icon)
  const [selectedViewApp, setSelectedViewApp] = useState<ApplicationRecord | null>(null);

  // CMS Content Editing
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [tempContent, setTempContent] = useState<PublicContentConfig>(publicContent);
  const [notification, setNotification] = useState<string | null>(null);

  // New Admin Form Modal
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminUser['role']>('Secretaria Pedagógica');

  // CMS Quick Highlight & Gallery
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightDesc, setNewHighlightDesc] = useState('');
  const [newHighlightCat, setNewHighlightCat] = useState('Actividade Escolar');
  const [newHighlightImg, setNewHighlightImg] = useState('/src/assets/images/cep_classroom_learning_1790861301453.jpg');

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState('Campus');
  const [newGalleryImg, setNewGalleryImg] = useState('/src/assets/images/cep_school_campus_1790861289408.jpg');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleImageUpload = (onSuccess: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onSuccess(event.target.result as string);
            showToast('Fotografia carregada com sucesso do dispositivo!');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Dashboard Metrics
  const totalApps = applications.length;
  const approvedApps = applications.filter((a) => a.status === 'Aprovada').length;
  const rejectedApps = applications.filter((a) => a.status === 'Rejeitada').length;
  const pendingApps = applications.filter((a) => a.status === 'Pendente').length;
  const todayStr = new Date().toISOString().substring(0, 10);
  const receivedTodayApps = applications.filter((a) => a.createdAt.startsWith(todayStr)).length || applications.length;
  const totalGuardians = guardians.length;

  // Filtered List
  const filteredApps = applications.filter((app) => {
    const matchGrade = appGradeFilter === 'all' || app.academic.grade === appGradeFilter;
    const matchStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchSearch =
      app.student.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.guardian.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.student.documentNumber.toLowerCase().includes(appSearch.toLowerCase());
    return matchGrade && matchStatus && matchSearch;
  });

  const handleExportCSV = () => {
    const headers = ['N.º Sequencial', 'Código CEPP', 'Nome do Aluno', 'Classe', 'Turno', 'Encarregado', 'Telefone', 'Data Inscrição', 'Estado'];
    const rows = filteredApps.map((a) => [
      a.sequenceNumber,
      a.id,
      `"${a.student.name}"`,
      `"${a.academic.grade}"`,
      `"${a.academic.shift.split(' ')[0]}"`,
      `"${a.guardian.name}"`,
      `"${a.guardian.phone}"`,
      `"${a.createdAt}"`,
      `"${a.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Matriculas_CEP_Pereira_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Tabela de matrículas exportada com sucesso (formato Excel / CSV)!');
  };

  const handleTogglePeriod = () => {
    const updated = { ...enrollmentPeriod, isOpen: !enrollmentPeriod.isOpen };
    onUpdatePeriod(updated);
    showToast(
      updated.isOpen
        ? 'Período de Matrículas ACTIVADO (Inscrições Abertas no Site Publicitário)!'
        : 'Período de Matrículas ENCERRADO (Submissão bloqueada no Portal)!'
    );
  };

  const handleSaveCMS = () => {
    onSaveContent(tempContent);
    showToast('Alterações salvas e atualizadas com sucesso!');
  };

  const handlePublishCMS = () => {
    onSaveContent(tempContent);
    setIsEditingContent(false);
    showToast('Conteúdo finalizado e publicado na Área Publicitária!');
  };

  return (
    <div className="w-full bg-[#f4f6fb] min-h-[calc(100vh-140px)] pb-16">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl bg-[#04063f] text-white text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#fd761a]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner: Administrative Authority Header */}
      <div className="bg-[#04063f] text-white border-b border-indigo-900/60 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fd761a] text-white flex items-center justify-center font-bold shadow-md">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#ffdbca]">
                  Painel Administrativo Oficial
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Supabase Backend Ready
                </span>
              </div>
              <h1 className="font-serif-headline text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Gestão Escolar & Controlo da Área Publicitária
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowSupabaseModal(true)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md border ${
                supabaseConnected
                  ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white border-emerald-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-[#ffdbca] border-white/20'
              }`}
              title="Colar o URL do Projecto, a Chave Anon e o Ano Lectivo no Supabase para sincronizar vários telemóveis e computadores"
            >
              <Database className="w-4 h-4 text-[#fd761a]" />
              <span>
                {supabaseConnected ? 'Supabase Conectado' : 'Conectar Supabase (Projecto & Ano)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-300 animate-pulse' : 'bg-orange-400'}`} />
            </button>

            <button
              onClick={onViewPublicSite}
              className="px-4 py-2 rounded-lg bg-[#fd761a] text-white font-bold text-xs hover:bg-[#ea580c] transition-all shadow-md flex items-center gap-2"
              title="Ir para a Área Publicitária do Site"
            >
              <Eye className="w-4 h-4" />
              <span>Ver o Site (Área Publicitária)</span>
            </button>
          </div>
        </div>

        {/* Administrative Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex items-center gap-1 border-t border-white/10 pt-2 pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard & Indicadores', icon: LayoutDashboard },
              { id: 'matriculas', label: 'Matrículas & Período', icon: FileSpreadsheet, badge: totalApps },
              { id: 'encarregados', label: 'Encarregados de Educação', icon: Users, badge: totalGuardians },
              { id: 'administradores', label: 'Administradores & Contas', icon: UserCheck, badge: admins.length },
              { id: 'conteudo_site', label: 'Conteúdo do Site (CMS)', icon: Globe },
              { id: 'qrcode', label: 'QR Code do Portal', icon: QrCode },
              { id: 'supabase', label: 'Base de Dados Supabase', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-[#04063f] shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fd761a]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#04063f] text-white' : 'bg-white/20 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD & INDICADORES                           */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Period Status Alert Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
              enrollmentPeriod.isOpen
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${
                  enrollmentPeriod.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs uppercase tracking-wider font-bold">
                      Estado do Período de Matrículas:
                    </strong>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      enrollmentPeriod.isOpen ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                    }`}>
                      {enrollmentPeriod.isOpen ? 'INSCRIÇÕES ABERTAS' : 'INSCRIÇÕES ENCERRADAS'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ano Lectivo {enrollmentPeriod.schoolYear} ({enrollmentPeriod.startDate} a {enrollmentPeriod.endDate}).
                  </p>
                </div>
              </div>

              <button
                onClick={handleTogglePeriod}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  enrollmentPeriod.isOpen
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {enrollmentPeriod.isOpen ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Encerrar Inscrições Agora</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Abrir Período de Inscrições</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total de Matrículas
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#04063f] my-1">
                  {totalApps}
                </div>
                <span className="text-[10px] text-slate-400">Geral submetidas</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Matrículas Aprovadas
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-emerald-600 my-1">
                  {approvedApps}
                </div>
                <span className="text-[10px] text-emerald-600/80">Vagas confirmadas</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Recebidas Hoje / Recentes
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-blue-600 my-1">
                  {receivedTodayApps}
                </div>
                <span className="text-[10px] text-blue-600/80">Fluxo activo</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Matrículas Pendentes
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-amber-600 my-1">
                  {pendingApps}
                </div>
                <span className="text-[10px] text-amber-600/80">Aguardando validação</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                  Matrículas Rejeitadas
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-red-600 my-1">
                  {rejectedApps}
                </div>
                <span className="text-[10px] text-red-600/80">Inconformidades</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">
                  Encarregados Registados
                </span>
                <div className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#fd761a] my-1">
                  {totalGuardians}
                </div>
                <span className="text-[10px] text-slate-400">Contas criadas</span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#04063f]">
                      Últimas Matrículas Submetidas no Sistema
                    </h3>
                    <p className="text-xs text-slate-500">
                      Entrada direta a partir da Área Publicitária do site.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('matriculas')}
                    className="text-xs font-bold text-[#fd761a] hover:underline"
                  >
                    Ver Todas as Matrículas ({totalApps})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                        <th className="py-2">N.º</th>
                        <th className="py-2">Código</th>
                        <th className="py-2">Aluno</th>
                        <th className="py-2">Classe</th>
                        <th className="py-2">Encarregado</th>
                        <th className="py-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-bold text-[#04063f] font-mono">#{app.sequenceNumber}</td>
                          <td className="py-2.5 font-mono text-slate-600">{app.id}</td>
                          <td className="py-2.5 font-semibold text-slate-900">{app.student.name}</td>
                          <td className="py-2.5">{app.academic.grade}</td>
                          <td className="py-2.5 text-slate-600">{app.guardian.name}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.status === 'Aprovada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Rejeitada'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-900'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#04063f]">
                    Gestão Rápida da Secretaria
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('matriculas')}
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#04063f] flex items-center justify-between transition-colors"
                    >
                      <span>Gerenciar Candidaturas & Vagas</span>
                      <FileSpreadsheet className="w-4 h-4 text-[#fd761a]" />
                    </button>
                    <button
                      onClick={() => setActiveTab('conteudo_site')}
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#04063f] flex items-center justify-between transition-colors"
                    >
                      <span>Editar Conteúdo da Área Publicitária</span>
                      <Globe className="w-4 h-4 text-[#04063f]" />
                    </button>
                    <button
                      onClick={onOpenQRCodePoster}
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#04063f] flex items-center justify-between transition-colors"
                    >
                      <span>Imprimir Cartaz com QR Code</span>
                      <QrCode className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={onViewPublicSite}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#04063f] text-white text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
                    >
                      <span>Visualizar Site como Visitante</span>
                      <Eye className="w-4 h-4 text-[#fd761a]" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#f0f3ff] p-4 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <School className="w-4 h-4 text-[#04063f]" />
                    <span>Lotação Obrigatória: 25 Alunos / Sala</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Padrão pedagógico rigoroso homologado pelo Ministério da Educação para a Iniciação à 6.ª Classe no Cuanza Sul.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MATRÍCULAS (TABELA NUMERADA SEQUENCIAL 1, 2, 3...)  */}
        {/* ========================================================= */}
        {activeTab === 'matriculas' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Top Period Configuration Bar */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">
                  Configuração de Acesso ao Formulário de Matrícula
                </span>
                <h3 className="text-base font-bold text-[#04063f] flex items-center gap-2">
                  <span>Período de Matrículas:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    enrollmentPeriod.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {enrollmentPeriod.isOpen ? 'INSCRIÇÕES ABERTAS' : 'INSCRIÇÕES ENCERRADAS'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {enrollmentPeriod.isOpen
                    ? 'Qualquer visitante da área publicitária pode preencher e submeter a inscrição de educandos.'
                    : 'Ninguém consegue submeter novas matrículas no portal; o formulário fica desativado com mensagem explicativa.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTogglePeriod}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                    enrollmentPeriod.isOpen
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {enrollmentPeriod.isOpen ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Encerrar Inscrições</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Ativar Inscrições</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Baixar em Excel (CSV)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Imprimir Tabela (PDF)</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Pesquisar por N.º, Nome do aluno, Código CEPP, Encarregado ou BI..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={appGradeFilter}
                  onChange={(e) => setAppGradeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
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

                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Documentação Pendente">Doc. Pendente</option>
                  <option value="Rejeitada">Rejeitada</option>
                </select>
              </div>
            </div>

            {/* Official Sequential Numbered Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>
                  Total de Inscrições: <strong>{filteredApps.length}</strong> (Numeradas sequencialmente a partir de N.º 1)
                </span>
                <span className="font-semibold text-[#04063f]">
                  Complexo Escolar Privado Pereira
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#04063f] text-white uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3 w-14 text-center">N.º</th>
                      <th className="py-3 px-4">Código CEPP</th>
                      <th className="py-3 px-4">Nome do Aluno</th>
                      <th className="py-3 px-4">Classe & Turno</th>
                      <th className="py-3 px-4">Encarregado & Telefone</th>
                      <th className="py-3 px-4">Data Inscrição</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          Nenhuma candidatura encontrada com os critérios pesquisados.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-3 text-center font-bold text-[#04063f] font-mono text-sm bg-slate-50/50">
                            {app.sequenceNumber}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-[#04063f]">
                            {app.id}
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="text-slate-900 block font-semibold">{app.student.name}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">BI: {app.student.documentNumber} ({app.student.age})</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#04063f] block">{app.academic.grade}</span>
                            <span className="text-[10px] text-slate-500">{app.academic.shift.split(' ')[0]}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">{app.guardian.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#fd761a]" />
                              {app.guardian.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {app.createdAt}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Aprovada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Rejeitada'
                                ? 'bg-red-100 text-red-800'
                                : app.status === 'Documentação Pendente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-900'
                            }`}>
                              {app.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {app.status !== 'Aprovada' && (
                                <button
                                  onClick={() => {
                                    onUpdateStatus(app.id, 'Aprovada', 'Vaga homologada pela Secretaria Pedagógica.');
                                    showToast(`Matrícula N.º ${app.sequenceNumber} aprovada com sucesso!`);
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-colors"
                                  title="Aprovar Matrícula"
                                >
                                  Aprovar
                                </button>
                              )}

                              {app.status !== 'Rejeitada' && (
                                <button
                                  onClick={() => {
                                    onUpdateStatus(app.id, 'Rejeitada', 'Candidatura rejeitada por não conformidade documental.');
                                    showToast(`Matrícula N.º ${app.sequenceNumber} rejeitada.`);
                                  }}
                                  className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[10px] transition-colors"
                                  title="Rejeitar Matrícula"
                                >
                                  Rejeitar
                                </button>
                              )}

                              <button
                                onClick={() => onPrintVoucher(app)}
                                className="p-1.5 rounded hover:bg-slate-100 text-[#04063f] transition-colors"
                                title="Baixar / Imprimir Ficha Oficial"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#fd761a]" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Tem a certeza que deseja eliminar o registo N.º ${app.sequenceNumber} (${app.student.name})?`)) {
                                    onDeleteApplication(app.id);
                                    showToast('Registo de matrícula eliminado do sistema.');
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                title="Eliminar Registo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ENCARREGADOS DE EDUCAÇÃO                           */}
        {/* ========================================================= */}
        {activeTab === 'encarregados' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#04063f]">
                  Base de Dados de Encarregados de Educação Registados
                </h3>
                <p className="text-xs text-slate-500">
                  Total de {guardians.length} encarregados com contas no sistema escolar.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-[#eaedff] text-[#04063f] text-xs font-bold font-mono">
                {guardians.length} Contas Criadas
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#04063f] text-white uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Nome do Encarregado</th>
                      <th className="py-3 px-4">Correio Electrónico (E-mail)</th>
                      <th className="py-3 px-4">Número de Telefone</th>
                      <th className="py-3 px-4">Data do Registo</th>
                      <th className="py-3 px-4 text-center">Alunos Matriculados</th>
                      <th className="py-3 px-4">Educandos Associados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {guardians.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#04063f]">
                          {g.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {g.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {g.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {g.registeredAt}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#04063f] font-bold">
                            {g.enrolledStudentsCount} aluno(s)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-500">
                          {g.studentsList.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ADMINISTRADORES & GESTÃO DE ACESSOS                */}
        {/* ========================================================= */}
        {activeTab === 'administradores' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">
                  Acesso Administrativo & Supabase Auth
                </span>
                <h3 className="font-bold text-base text-[#04063f]">
                  Contas de Administradores do Sistema
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  O administrador principal adiciona novos administradores com nome, e-mail e palavra-passe.
                </p>
              </div>

              <button
                onClick={() => setShowAddAdminModal(true)}
                className="px-4 py-2.5 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 text-[#fd761a]" />
                <span>Adicionar Novo Administrador</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#04063f] text-white uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Nome do Administrador</th>
                      <th className="py-3 px-4">E-mail de Login</th>
                      <th className="py-3 px-4">Nível de Função / Cargo</th>
                      <th className="py-3 px-4">Data de Criação</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#04063f]">
                          {adm.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {adm.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                            {adm.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {adm.createdAt}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Ativo
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {adm.role !== 'Administrador Principal' ? (
                            <button
                              onClick={() => {
                                if (confirm(`Remover acesso do administrador ${adm.name}?`)) {
                                  onDeleteAdmin(adm.id);
                                  showToast('Administrador removido com sucesso.');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold p-1"
                            >
                              Remover
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Principal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add New Admin */}
            {showAddAdminModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-base text-[#04063f]">
                      Criar Nova Conta Administrativa
                    </h3>
                    <button
                      onClick={() => setShowAddAdminModal(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAdminName || !newAdminEmail || !newAdminPassword) {
                        alert('Preencha todos os campos obrigatórios.');
                        return;
                      }
                      onAddAdmin(
                        {
                          name: newAdminName,
                          email: newAdminEmail,
                          role: newAdminRole,
                          isActive: true
                        },
                        newAdminPassword
                      );
                      setShowAddAdminModal(false);
                      setNewAdminName('');
                      setNewAdminEmail('');
                      setNewAdminPassword('');
                      showToast('Novo administrador adicionado com sucesso!');
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block font-bold text-[#04063f] mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Ex.: Maria Luísa Pereira"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#04063f] mb-1">E-mail de Acesso *</label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@escola-pereira.ao"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#04063f] mb-1">Palavra-passe Temporária *</label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#04063f] mb-1">Função / Cargo</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                      >
                        <option value="Secretaria Pedagógica">Secretaria Pedagógica</option>
                        <option value="Gestor de Matrículas">Gestor de Matrículas</option>
                        <option value="Administrador Principal">Administrador Principal</option>
                      </select>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAdminModal(false)}
                        className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54]"
                      >
                        Salvar e Criar Acesso
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CONTEÚDO DO SITE (CMS DA ÁREA PUBLICITÁRIA)         */}
        {/* ========================================================= */}
        {activeTab === 'conteudo_site' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top CMS Bar: Bloquear / Ativar Edição, Salvar, Finalizar e Publicar */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">
                  Gestão Integral de Conteúdo & Imagens da Área Publicitária
                </span>
                <h3 className="font-bold text-lg text-[#04063f] flex items-center gap-2 mt-0.5">
                  <span>Modo do Editor:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isEditingContent ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isEditingContent ? '🔓 EDIÇÃO ATIVA (Campos Desbloqueados)' : '🔒 EDIÇÃO BLOQUEADA'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl mt-1">
                  Substitua as imagens de exemplo por fotografias reais do colégio, altere textos sobre a instituição, edite destaques, galeria e directoria. Quando terminar, clique em <strong>Salvar e Atualizar</strong> ou <strong>Finalizar e Publicar</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditingContent(!isEditingContent);
                    showToast(isEditingContent ? 'Edição bloqueada!' : 'Edição ativada! Pode modificar textos e substituir imagens.');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                    isEditingContent
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {isEditingContent ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isEditingContent ? 'Bloquear Edição' : 'Ativar Edição do Site'}</span>
                </button>

                <button
                  disabled={!isEditingContent}
                  onClick={handleSaveCMS}
                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Salvar e Atualizar</span>
                </button>

                <button
                  disabled={!isEditingContent}
                  onClick={handlePublishCMS}
                  className="px-4 py-2 rounded-lg bg-[#fd761a] text-white text-xs font-bold hover:bg-[#ea580c] transition-colors shadow-sm disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Finalizar e Publicar</span>
                </button>

                <button
                  onClick={onViewPublicSite}
                  className="px-3.5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Ver Área Publicitária</span>
                </button>
              </div>
            </div>

            {/* SEÇÃO 1: APRESENTAÇÃO & SOBRE A INSTITUIÇÃO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">Secção Principal</span>
                  <h4 className="font-bold text-base text-[#04063f]">
                    1. Apresentação & Sobre a Instituição (Textos e Imagem do Campus)
                  </h4>
                </div>
                {!isEditingContent && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Clique em <strong>Ativar Edição do Site</strong> acima para alterar
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                {/* Text Fields */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Título do Colégio (Hero)</label>
                      <input
                        type="text"
                        disabled={!isEditingContent}
                        value={tempContent.heroTitle || 'Complexo Escolar Privado Pereira'}
                        onChange={(e) => setTempContent({ ...tempContent, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Aviso Superior (Badge)</label>
                      <input
                        type="text"
                        disabled={!isEditingContent}
                        value={tempContent.heroNotice || ''}
                        onChange={(e) => setTempContent({ ...tempContent, heroNotice: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subtítulo e Resumo da Missão Pedagógica</label>
                    <textarea
                      rows={2}
                      disabled={!isEditingContent}
                      value={tempContent.heroSubtitle || ''}
                      onChange={(e) => setTempContent({ ...tempContent, heroSubtitle: e.target.value })}
                      placeholder="Texto introdutório sobre o colégio..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Título da Secção "Sobre a Instituição"</label>
                    <input
                      type="text"
                      disabled={!isEditingContent}
                      value={tempContent.aboutTitle || 'Sobre o Complexo Escolar Privado Pereira'}
                      onChange={(e) => setTempContent({ ...tempContent, aboutTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 font-bold text-[#04063f]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Texto Institucional Completo (História, Metodologia, Rigor e Formação Integral)
                    </label>
                    <textarea
                      rows={4}
                      disabled={!isEditingContent}
                      value={tempContent.aboutDescription || ''}
                      onChange={(e) => setTempContent({ ...tempContent, aboutDescription: e.target.value })}
                      placeholder="Escreva detalhadamente sobre a fundação do colégio, objetivos pedagógicos, acompanhamento individual e compromisso no Cuanza Sul..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nossa Missão</label>
                      <textarea
                        rows={3}
                        disabled={!isEditingContent}
                        value={tempContent.mission}
                        onChange={(e) => setTempContent({ ...tempContent, mission: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nossa Visão</label>
                      <textarea
                        rows={3}
                        disabled={!isEditingContent}
                        value={tempContent.vision}
                        onChange={(e) => setTempContent({ ...tempContent, vision: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Campus Image Box with Instant Upload */}
                <div className="lg:col-span-4 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 uppercase text-[10px] tracking-wider">
                      Imagem Principal da Fachada / Campus
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Fotografia principal exibida na área publicitária. Pode substituir o exemplo pela foto real do colégio.
                    </p>
                    <div className="relative rounded-lg overflow-hidden border border-slate-300 shadow-sm">
                      <img
                        src={tempContent.heroImage || '/src/assets/images/cep_school_campus_1790861289408.jpg'}
                        alt="Campus"
                        className="w-full h-44 object-cover"
                      />
                    </div>
                  </div>

                  {isEditingContent && (
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleImageUpload((dataUrl) => {
                            setTempContent({ ...tempContent, heroImage: dataUrl });
                          });
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-[#04063f] text-white font-bold text-xs hover:bg-[#1b1f54] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#fd761a]" />
                        <span>Carregar Foto Real do Computador/Telemóvel</span>
                      </button>

                      <div className="pt-1">
                        <input
                          type="text"
                          value={tempContent.heroImage || ''}
                          onChange={(e) => setTempContent({ ...tempContent, heroImage: e.target.value })}
                          placeholder="Ou colar link de imagem (URL)..."
                          className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-[11px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: DESTAQUES & PUBLICIDADES ESCOLARES */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">Secção de Notícias</span>
                  <h4 className="font-bold text-base text-[#04063f]">
                    2. Destaques & Publicidades Escolares (Substituir Exemplos por Imagens Reais)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Os administradores podem editar textos, trocar as fotos de exemplo por fotos reais ou eliminar os itens.
                  </p>
                </div>

                {isEditingContent && (
                  <button
                    onClick={() => {
                      const newHl: HighlightArticle = {
                        id: 'hl-' + Date.now(),
                        title: newHighlightTitle || 'Nova Publicidade da Instituição',
                        description: newHighlightDesc || 'Descrição detalhada das actividades curriculares e cívicas desenvolvidas no colégio.',
                        imageUrl: newHighlightImg || '/src/assets/images/cep_classroom_learning_1790861301453.jpg',
                        date: new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long' }),
                        category: newHighlightCat
                      };
                      setTempContent({
                        ...tempContent,
                        highlights: [newHl, ...tempContent.highlights]
                      });
                      setNewHighlightTitle('');
                      setNewHighlightDesc('');
                      showToast('Novo destaque adicionado à lista!');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#fd761a]" />
                    <span>Adicionar Novo Destaque</span>
                  </button>
                )}
              </div>

              {/* Form to add new Highlight */}
              {isEditingContent && (
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-3 text-xs">
                  <div className="font-bold text-[#04063f] flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#fd761a]" />
                    <span>Criar Novo Destaque / Publicidade Real:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newHighlightTitle}
                        onChange={(e) => setNewHighlightTitle(e.target.value)}
                        placeholder="Título do destaque (Ex.: Feira de Ciências e Leitura 2024)..."
                        className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={newHighlightCat}
                        onChange={(e) => setNewHighlightCat(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none"
                      >
                        <option value="Actividade Escolar">Actividade Escolar</option>
                        <option value="Conhecimento">Conhecimento</option>
                        <option value="Reconhecimento">Reconhecimento</option>
                        <option value="Mérito Académico">Mérito Académico</option>
                        <option value="Desporto & Cultura">Desporto & Cultura</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <textarea
                        rows={2}
                        value={newHighlightDesc}
                        onChange={(e) => setNewHighlightDesc(e.target.value)}
                        placeholder="Descrição explicativa para os encarregados e público..."
                        className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          handleImageUpload((dataUrl) => {
                            setNewHighlightImg(dataUrl);
                          });
                        }}
                        className="w-full py-2 px-3 rounded bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#fd761a]" />
                        <span>Carregar Foto Real</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of existing highlights with direct edit and replace image */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tempContent.highlights.map((hl, idx) => (
                  <div key={hl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Image preview & Replace action */}
                      <div className="relative rounded-lg overflow-hidden border border-slate-300">
                        <img
                          src={hl.imageUrl}
                          alt={hl.title}
                          className="w-full h-36 object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#04063f]/80 text-white text-[10px] font-bold">
                          {hl.category}
                        </span>
                      </div>

                      {isEditingContent && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              handleImageUpload((dataUrl) => {
                                const updated = [...tempContent.highlights];
                                updated[idx].imageUrl = dataUrl;
                                setTempContent({ ...tempContent, highlights: updated });
                                showToast('Foto substituída por fotografia real!');
                              });
                            }}
                            className="flex-1 py-1.5 px-2 rounded bg-white border border-slate-300 text-[#04063f] text-[11px] font-bold hover:bg-slate-100 flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Upload className="w-3 h-3 text-[#fd761a]" />
                            <span>Trocar Foto Real</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = tempContent.highlights.filter((h) => h.id !== hl.id);
                              setTempContent({ ...tempContent, highlights: updated });
                              showToast('Destaque de exemplo removido.');
                            }}
                            className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            title="Eliminar este destaque"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Text inputs */}
                      <div className="space-y-1.5 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Título</label>
                          <input
                            type="text"
                            disabled={!isEditingContent}
                            value={hl.title}
                            onChange={(e) => {
                              const updated = [...tempContent.highlights];
                              updated[idx].title = e.target.value;
                              setTempContent({ ...tempContent, highlights: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-white border border-slate-200 font-bold text-slate-800 disabled:bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Descrição</label>
                          <textarea
                            rows={2}
                            disabled={!isEditingContent}
                            value={hl.description}
                            onChange={(e) => {
                              const updated = [...tempContent.highlights];
                              updated[idx].description = e.target.value;
                              setTempContent({ ...tempContent, highlights: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 disabled:bg-transparent"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Categoria</label>
                            <input
                              type="text"
                              disabled={!isEditingContent}
                              value={hl.category}
                              onChange={(e) => {
                                const updated = [...tempContent.highlights];
                                updated[idx].category = e.target.value;
                                setTempContent({ ...tempContent, highlights: updated });
                              }}
                              className="w-full px-2 py-1 rounded bg-white border border-slate-200 disabled:bg-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Data</label>
                            <input
                              type="text"
                              disabled={!isEditingContent}
                              value={hl.date}
                              onChange={(e) => {
                                const updated = [...tempContent.highlights];
                                updated[idx].date = e.target.value;
                                setTempContent({ ...tempContent, highlights: updated });
                              }}
                              className="w-24 px-2 py-1 rounded bg-white border border-slate-200 disabled:bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 3: GALERIA PUBLICITÁRIA DE IMAGENS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">Galeria Oficial</span>
                  <h4 className="font-bold text-base text-[#04063f]">
                    3. Galeria de Imagens Publicitárias (Substituir e Eliminar Fotos de Exemplo)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Apenas as imagens validadas e publicadas nesta galeria serão visíveis aos encarregados na Área Publicitária.
                  </p>
                </div>

                {isEditingContent && (
                  <button
                    onClick={() => {
                      const newPhoto: GalleryPhoto = {
                        id: 'gal-' + Date.now(),
                        title: newGalleryTitle || 'Nova Imagem do Colégio',
                        imageUrl: newGalleryImg || '/src/assets/images/cep_school_campus_1790861289408.jpg',
                        category: newGalleryCat
                      };
                      setTempContent({
                        ...tempContent,
                        gallery: [newPhoto, ...tempContent.gallery]
                      });
                      setNewGalleryTitle('');
                      showToast('Foto adicionada à galeria publicitária!');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#fd761a]" />
                    <span>Adicionar à Galeria</span>
                  </button>
                )}
              </div>

              {/* Form to add new photo to Gallery */}
              {isEditingContent && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 text-xs">
                  <div className="font-bold text-[#04063f] flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#fd761a]" />
                    <span>Carregar Nova Fotografia Real para a Galeria:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Legenda da Imagem</label>
                      <input
                        type="text"
                        value={newGalleryTitle}
                        onChange={(e) => setNewGalleryTitle(e.target.value)}
                        placeholder="Ex.: Sala de Informática ou Turma da 1.ª Classe..."
                        className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Categoria</label>
                      <select
                        value={newGalleryCat}
                        onChange={(e) => setNewGalleryCat(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none"
                      >
                        <option value="Salas de Aula">Salas de Aula</option>
                        <option value="Campus">Campus</option>
                        <option value="Fardamento">Fardamento</option>
                        <option value="Desporto & Recreio">Desporto & Recreio</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          handleImageUpload((dataUrl) => {
                            setNewGalleryImg(dataUrl);
                          });
                        }}
                        className="w-full py-2 px-3 rounded bg-[#04063f] text-white font-bold hover:bg-[#1b1f54] flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#fd761a]" />
                        <span>Escolher Arquivo do Dispositivo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tempContent.gallery.map((photo, idx) => (
                  <div key={photo.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden border border-slate-300">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-36 object-cover"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold uppercase">
                          {photo.category}
                        </span>
                      </div>

                      {isEditingContent && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleImageUpload((dataUrl) => {
                                const updated = [...tempContent.gallery];
                                updated[idx].imageUrl = dataUrl;
                                setTempContent({ ...tempContent, gallery: updated });
                                showToast('Foto da galeria substituída por foto real!');
                              });
                            }}
                            className="flex-1 py-1 px-2 rounded bg-white border border-slate-300 text-[#04063f] text-[11px] font-bold hover:bg-slate-100 flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Upload className="w-3 h-3 text-[#fd761a]" />
                            <span>Trocar Foto Real</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = tempContent.gallery.filter((g) => g.id !== photo.id);
                              setTempContent({ ...tempContent, gallery: updated });
                              showToast('Foto removida da galeria.');
                            }}
                            className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            title="Eliminar foto de exemplo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Legenda</label>
                        <input
                          type="text"
                          disabled={!isEditingContent}
                          value={photo.title}
                          onChange={(e) => {
                            const updated = [...tempContent.gallery];
                            updated[idx].title = e.target.value;
                            setTempContent({ ...tempContent, gallery: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-slate-800 disabled:bg-transparent font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 4: CORPO DIRECTIVO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">Liderança</span>
                <h4 className="font-bold text-base text-[#04063f]">
                  4. Corpo Directivo Institucional (Director Geral, Subdirector Pedagógico e Administrativo)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {tempContent.directors.map((dir, idx) => (
                  <div key={dir.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={dir.photoUrl}
                          alt={dir.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#04063f]/20 shadow-sm shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-[#fd761a] uppercase block">
                            Perfil {idx + 1}
                          </span>
                          <input
                            type="text"
                            disabled={!isEditingContent}
                            value={dir.role}
                            onChange={(e) => {
                              const updated = [...tempContent.directors];
                              updated[idx].role = e.target.value;
                              setTempContent({ ...tempContent, directors: updated });
                            }}
                            className="font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:outline-none w-full text-xs"
                          />
                        </div>
                      </div>

                      {isEditingContent && (
                        <button
                          type="button"
                          onClick={() => {
                            handleImageUpload((dataUrl) => {
                              const updated = [...tempContent.directors];
                              updated[idx].photoUrl = dataUrl;
                              setTempContent({ ...tempContent, directors: updated });
                              showToast('Foto do director atualizada!');
                            });
                          }}
                          className="w-full py-1.5 px-2 rounded bg-white border border-slate-300 text-[#04063f] text-[11px] font-bold hover:bg-slate-100 flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Upload className="w-3 h-3 text-[#fd761a]" />
                          <span>Substituir Fotografia do Director</span>
                        </button>
                      )}

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          disabled={!isEditingContent}
                          value={dir.name}
                          onChange={(e) => {
                            const updated = [...tempContent.directors];
                            updated[idx].name = e.target.value;
                            setTempContent({ ...tempContent, directors: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-white border border-slate-200 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Biografia Resumida</label>
                        <textarea
                          rows={3}
                          disabled={!isEditingContent}
                          value={dir.bio}
                          onChange={(e) => {
                            const updated = [...tempContent.directors];
                            updated[idx].bio = e.target.value;
                            setTempContent({ ...tempContent, directors: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-white border border-slate-200 leading-relaxed text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 5: LEMA & ESTATÍSTICAS INSTITUCIONAIS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fd761a]">Métricas Oficiais</span>
                <h4 className="font-bold text-sm text-[#04063f] uppercase tracking-wide">
                  5. Lema Institucional e Números de Impacto
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Lema Oficial</label>
                  <input
                    type="text"
                    disabled={!isEditingContent}
                    value={tempContent.motto}
                    onChange={(e) => setTempContent({ ...tempContent, motto: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04063f] disabled:bg-slate-100 italic"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número de Alunos Ativos</label>
                  <input
                    type="number"
                    disabled={!isEditingContent}
                    value={tempContent.stats.activeStudents}
                    onChange={(e) => setTempContent({
                      ...tempContent,
                      stats: { ...tempContent.stats, activeStudents: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número de Alunos Formados (Concluintes)</label>
                  <input
                    type="number"
                    disabled={!isEditingContent}
                    value={tempContent.stats.graduatedStudents}
                    onChange={(e) => setTempContent({
                      ...tempContent,
                      stats: { ...tempContent.stats, graduatedStudents: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Anos de Existência da Instituição</label>
                  <input
                    type="number"
                    disabled={!isEditingContent}
                    value={tempContent.stats.yearsOfExistence}
                    onChange={(e) => setTempContent({
                      ...tempContent,
                      stats: { ...tempContent.stats, yearsOfExistence: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professores Qualificados Existentes</label>
                  <input
                    type="number"
                    disabled={!isEditingContent}
                    value={tempContent.stats.teachersCount}
                    onChange={(e) => setTempContent({
                      ...tempContent,
                      stats: { ...tempContent.stats, teachersCount: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: QR CODE DO PORTAL                                  */}
        {/* ========================================================= */}
        {activeTab === 'qrcode' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
                  Material Publicitário Oficial
                </span>
                <h3 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                  Código QR do Portal de Matrícula
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Gere e imprima cartazes com o QR Code para afixar nas vitrines da escola, portaria e materiais de divulgação no Cuanza Sul. Qualquer encarregado que escanear será direcionado imediatamente para a Área Publicitária.
                </p>
              </div>

              {/* QR Code Preview */}
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl inline-block shadow-inner mx-auto">
                <svg
                  className="w-48 h-48 mx-auto text-[#04063f]"
                  viewBox="0 0 200 200"
                  fill="currentColor"
                >
                  <rect x="10" y="10" width="50" height="50" fill="#04063f" rx="6" />
                  <rect x="20" y="20" width="30" height="30" fill="white" rx="3" />
                  <rect x="28" y="28" width="14" height="14" fill="#fd761a" rx="2" />
                  <rect x="140" y="10" width="50" height="50" fill="#04063f" rx="6" />
                  <rect x="150" y="20" width="30" height="30" fill="white" rx="3" />
                  <rect x="158" y="28" width="14" height="14" fill="#fd761a" rx="2" />
                  <rect x="10" y="140" width="50" height="50" fill="#04063f" rx="6" />
                  <rect x="20" y="150" width="30" height="30" fill="white" rx="3" />
                  <rect x="28" y="158" width="14" height="14" fill="#fd761a" rx="2" />
                  <rect x="70" y="70" width="14" height="14" fill="#04063f" rx="3" />
                  <rect x="105" y="95" width="14" height="14" fill="#fd761a" rx="3" />
                  <rect x="70" y="20" width="10" height="10" rx="2" />
                  <rect x="100" y="35" width="10" height="10" rx="2" />
                  <rect x="20" y="70" width="10" height="10" rx="2" />
                  <rect x="115" y="115" width="10" height="10" rx="2" />
                  <rect x="155" y="115" width="10" height="10" rx="2" />
                  <rect x="80" y="165" width="10" height="10" rx="2" />
                </svg>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={onOpenQRCodePoster}
                  className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-all shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#fd761a]" />
                  <span>Imprimir Cartaz com QR Code em A4</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin);
                    showToast('Link do portal copiado!');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Copiar Link do Portal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: BASE DE DADOS SUPABASE (MULTI-DISPOSITIVO)         */}
        {/* ========================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            {/* Status Card */}
            <div className={`p-6 rounded-2xl border shadow-sm ${
              supabaseConnected 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4 border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    supabaseConnected ? 'bg-emerald-600 text-white' : 'bg-[#04063f] text-[#fd761a]'
                  }`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#fd761a] block">
                      Base de Dados em Nuvem (PostgreSQL)
                    </span>
                    <h3 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                      {supabaseConnected ? 'Supabase Conectado & Operacional' : 'Supabase em Modo Local'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowSupabaseModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#04063f] hover:bg-[#191d57] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Database className="w-4 h-4 text-[#fd761a]" />
                  <span>{supabaseConnected ? 'Configurar / Alterar Chaves' : 'Colar Projecto e Anon Key'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">PROJECT URL</span>
                  <span className="font-mono text-slate-700 truncate block">
                    {currentSupabaseConfig.url || 'Não configurado (Usando cache local)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">ANO LECTIVO DEFINIDO</span>
                  <span className="font-bold text-[#04063f] block">
                    {currentSupabaseConfig.academicYear || enrollmentPeriod.schoolYear}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">MULTI-DISPOSITIVO</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sincronização em tempo real ativa
                  </span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-base text-[#04063f]">
                Como Ligar o Supabase em 3 Passos Simples:
              </h4>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#04063f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-bold">Aceder ao seu Projeto Supabase:</strong>
                    No painel do Supabase, clique em <strong>Project Settings</strong> (ícone de engrenagem) e selecione <strong>API</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#04063f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-bold">Copiar o Project URL e a Anon Key:</strong>
                    Copie o <strong>Project URL</strong> (ex: <code>https://xyz.supabase.co</code>) e a chave pública <strong>anon / public</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#04063f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-bold">Colar na Plataforma:</strong>
                    Clique no botão <strong>Colar Projecto e Anon Key</strong> acima, cole os dados e clique em <strong>Guardar & Conectar</strong>. A partir desse momento, as matrículas criadas no telemóvel de qualquer encarregado aparecem imediatamente no computador da escola!
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setShowSupabaseModal(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#fd761a] hover:bg-[#ea580c] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Abrir Tela para Colar Projecto & Ano</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onConfigSaved={(cfg) => {
          setCurrentSupabaseConfig(cfg);
          setSupabaseConnected(!!cfg.url && !!cfg.anonKey);
          showToast('Configurações do Supabase guardadas com sucesso!');
          if (onSupabaseConfigSaved) {
            onSupabaseConfigSaved(cfg);
          }
        }}
      />
    </div>
  );
};
