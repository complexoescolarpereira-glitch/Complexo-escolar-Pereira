import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Lock, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  School, 
  Award, 
  BookOpen, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Clock, 
  Send,
  Sparkles,
  QrCode,
  UserPlus,
  LogIn
} from 'lucide-react';
import { 
  ApplicationRecord, 
  EnrollmentPeriodConfig, 
  PublicContentConfig 
} from '../types';
import { EnrollmentWizard } from './EnrollmentWizard';

interface PublicAreaProps {
  enrollmentPeriod: EnrollmentPeriodConfig;
  publicContent: PublicContentConfig;
  applications: ApplicationRecord[];
  onApplicationCreated: (app: ApplicationRecord) => void;
  onTrackApplication: (code: string) => void;
  onGoToPortal: (email?: string, name?: string) => void;
  onGoToAdmin: () => void;
  onPrintVoucher: (app: ApplicationRecord) => void;
  onOpenQRCodePoster: () => void;
}

export const PublicArea: React.FC<PublicAreaProps> = ({
  enrollmentPeriod,
  publicContent,
  applications,
  onApplicationCreated,
  onTrackApplication,
  onGoToPortal,
  onGoToAdmin,
  onPrintVoucher,
  onOpenQRCodePoster
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchTerm] = useState('');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Informações sobre Matrículas');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Quick Auth / Registration Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  const filteredGallery = publicContent.gallery.filter((item) => {
    if (selectedGalleryCategory === 'all') return true;
    return item.category === selectedGalleryCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthModal(false);
    onGoToPortal(authEmail || 'antonio.gaspar@exemplo.ao', authName || 'Dr. António Pereira Gaspar');
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {/* ========================================================= */}
      {/* 1. PUBLIC HEADER & LOGO BRANDING                          */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm no-print">
        {/* Top utility stripe */}
        <div className="bg-[#04063f] text-white py-1.5 text-xs font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-y-1">
            <div className="flex items-center gap-4 text-slate-200">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#fd761a]" />
                <a href="tel:922071870" className="hover:text-white">922071870</a> / 
                <a href="tel:937775839" className="hover:text-white">937775839</a>
              </span>
              <span className="hidden sm:inline-block opacity-40">|</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#fd761a]" />
                Cuanza Sul, Angola
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="italic font-serif-headline text-xs opacity-80 tracking-wide hidden md:inline">
                {publicContent.motto}
              </span>
              {/* Access to Admin */}
              <button
                onClick={onGoToAdmin}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#ffdbca] transition-all"
                title="Acesso exclusivo à Área Administrativa"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#fd761a]" />
                <span>Área Administrativa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Brand Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Institution Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#04063f] text-white flex items-center justify-center font-serif-headline text-2xl font-bold shadow-md border-2 border-[#fd761a]/30">
              CEP
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#fd761a] leading-none">
                Instituto de Ensino de Excelência
              </span>
              <span className="font-serif-headline text-xl sm:text-2xl text-[#04063f] uppercase font-bold tracking-tight leading-none mt-1">
                CEP Pereira
              </span>
              <span className="text-xs text-slate-500 font-medium leading-none mt-1">
                Ensino Primário e I.º Ciclo
              </span>
            </div>
          </div>

          {/* Search Box as requested */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative ml-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar no site ou portal..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f]"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick QR Code Poster trigger */}
            <button
              onClick={onOpenQRCodePoster}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Visualizar e Imprimir QR Code do Portal"
            >
              <QrCode className="w-4 h-4 text-[#04063f]" />
              <span>QR Code</span>
            </button>

            {/* Auth Button: Entrar ou Criar Conta */}
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#04063f] text-white text-xs sm:text-sm font-semibold hover:bg-[#1b1f54] transition-all shadow-sm flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#fd761a]" />
              <span>Entrar / Criar Conta</span>
            </button>

            {/* Jump to Enrollment Button */}
            <a
              href="#matricula-section"
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#fd761a] text-white text-xs sm:text-sm font-bold hover:bg-[#ea580c] transition-all shadow-sm"
            >
              Matrícula Virtual
            </a>

            {/* Three bars lateral menu */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Drawer Menu */}
        {mobileDrawerOpen && (
          <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <a href="#destaques" onClick={() => setMobileDrawerOpen(false)} className="py-1 hover:text-[#04063f]">
                Destaques & Actividades
              </a>
              <a href="#corpo-directivo" onClick={() => setMobileDrawerOpen(false)} className="py-1 hover:text-[#04063f]">
                Corpo Directivo
              </a>
              <a href="#numeros" onClick={() => setMobileDrawerOpen(false)} className="py-1 hover:text-[#04063f]">
                Números Institucionais
              </a>
              <a href="#galeria" onClick={() => setMobileDrawerOpen(false)} className="py-1 hover:text-[#04063f]">
                Galeria Publicitária
              </a>
              <a href="#matricula-section" onClick={() => setMobileDrawerOpen(false)} className="py-1 text-[#fd761a] font-bold">
                Portal de Matrícula Virtual
              </a>
              <a href="#contactos" onClick={() => setMobileDrawerOpen(false)} className="py-1 hover:text-[#04063f]">
                Contactos & Localização
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onGoToAdmin();
                }}
                className="text-[#04063f] font-bold flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#fd761a]" />
                <span>Painel Administrativo</span>
              </button>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenQRCodePoster();
                }}
                className="text-slate-600 flex items-center gap-1"
              >
                <QrCode className="w-4 h-4" />
                <span>Imprimir QR Code</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. ENROLLMENT PERIOD STATUS HERO NOTICE                   */}
      {/* ========================================================= */}
      <section className="w-full">
        {enrollmentPeriod.isOpen ? (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-600 text-white py-3.5 px-4 text-center text-xs font-semibold shadow-inner flex flex-wrap items-center justify-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="uppercase font-bold tracking-wider sm:text-sm">
              INSCRIÇÕES OFICIAIS ABERTAS • ANO LECTIVO {enrollmentPeriod.schoolYear}
            </span>
            <a href="#matricula-section" className="px-3 py-1 rounded bg-white text-emerald-900 font-bold hover:bg-[#ffdbca] hover:text-[#04063f] transition-all ml-1 shadow-sm">
              Fazer Inscrição Agora →
            </a>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white py-3.5 px-4 text-center shadow-md">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
              <div className="text-xs sm:text-sm text-center sm:text-left">
                <strong className="uppercase font-bold tracking-wider">
                  INSCRIÇÕES ENCERRADAS
                </strong>
                <span className="text-slate-100 font-light ml-2">
                  — As matrículas encontram-se temporariamente encerradas no portal pela Direcção Pedagógica.
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 3. HERO SHOWCASE                                          */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#04063f] via-[#1b1f54] to-[#04063f] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#ffdbca] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#fd761a]" />
                {publicContent.heroNotice}
              </div>

              <h1 className="font-serif-headline text-3xl sm:text-5xl font-bold leading-tight">
                {publicContent.heroTitle || 'Complexo Escolar Privado Pereira'}
              </h1>

              <blockquote className="italic font-serif-headline text-lg sm:text-xl text-slate-200 border-l-2 border-[#fd761a] pl-4 py-1 leading-snug">
                {publicContent.motto}
              </blockquote>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-xl">
                {publicContent.heroSubtitle || 'Instituição de referência vocacionada ao Ensino Primário integral (Iniciação à 6.ª Classe) na província do Cuanza Sul. Turmas estruturadas com rigor pedagógico e foco na consolidação da leitura, escrita, cálculo e formação cívica.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#matricula-section"
                  className="px-6 py-3 rounded-lg bg-[#fd761a] text-white font-bold text-sm hover:bg-[#ea580c] transition-all shadow-md flex items-center gap-2"
                >
                  <span>Aceder à Matrícula Virtual</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Google 1-Click direct entry */}
                <button
                  onClick={() => onGoToPortal('complexoescolarpereira@gmail.com', 'Encarregado Google (Pereira)')}
                  className="px-5 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
                  title="Aceda imediatamente com a sua conta Google"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Começar com a Conta Google</span>
                </button>

                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="px-5 py-3 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#ffdbca]" />
                  <span>Portal do Encarregado</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <img
                src={publicContent.heroImage || '/src/assets/images/cep_school_campus_1790861289408.jpg'}
                alt="Campus Escolar CEP Pereira"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl border-2 border-white/20"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-[#04063f] p-4 rounded-xl shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#04063f] text-[#fd761a] flex items-center justify-center font-bold text-lg">
                  25
                </div>
                <div>
                  <strong className="text-xs uppercase block font-bold">Rácio Garantido</strong>
                  <span className="text-[11px] text-slate-500">Máximo 25 alunos por turma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3.5. SOBRE A INSTITUIÇÃO (HISTÓRIA, RIGOR E FORMAÇÃO)     */}
      {/* ========================================================= */}
      <section id="sobre" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#fd761a]">
                Conheça a Nossa Escola
              </span>
              <h2 className="font-serif-headline text-2xl sm:text-4xl font-bold text-[#04063f] mt-1">
                {publicContent.aboutTitle || 'Sobre o Complexo Escolar Privado Pereira'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#fd761a] text-xs font-bold">
                Ensino Primário de Referência • Cuanza Sul
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-slate-700 leading-relaxed text-sm">
              <p className="font-light leading-relaxed whitespace-pre-line text-slate-600 sm:text-base">
                {publicContent.aboutDescription || 'Fundado com a missão de elevar a qualidade do Ensino Primário no Cuanza Sul, o CEP Pereira conjuga uma infraestrutura moderna e segura a um corpo docente rigorosamente qualificado.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-[#04063f] text-[#fd761a] flex items-center justify-center font-bold text-xs mb-2">
                    25
                  </div>
                  <strong className="block text-xs text-[#04063f] font-bold">Rácio Rigoroso</strong>
                  <span className="text-[11px] text-slate-500">Máximo 25 educandos por turma</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#fd761a] flex items-center justify-center font-bold text-xs mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <strong className="block text-xs text-[#04063f] font-bold">Corpo Docente de Mérito</strong>
                  <span className="text-[11px] text-slate-500">Professores habilitados pelo MED</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#04063f] flex items-center justify-center font-bold text-xs mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <strong className="block text-xs text-[#04063f] font-bold">Formação Moral & Cívica</strong>
                  <span className="text-[11px] text-slate-500">Valores, disciplina e respeito</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-xl overflow-hidden shadow-md border border-slate-200">
              <img
                src={publicContent.heroImage || '/src/assets/images/cep_school_campus_1790861289408.jpg'}
                alt="Instalações"
                className="w-full h-56 object-cover"
              />
              <div className="p-3 bg-slate-50 text-[11px] text-slate-600 text-center font-medium">
                Instalações do Complexo Escolar Privado Pereira em Sumbe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. DESTAQUES & PUBLICIDADES DE ACTIVIDADES ESCOLARES       */}
      {/* ========================================================= */}
      <section id="destaques" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fd761a]">
              Actividades da Instituição
            </span>
            <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
              Destaques & Publicidades Escolares
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Publicações oficiais geridas pela Direcção Pedagógica do CEP Pereira.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicContent.highlights.map((hl) => (
            <div
              key={hl.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hl.imageUrl}
                  alt={hl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#04063f]/80 text-white text-[10px] font-bold uppercase backdrop-blur-sm">
                  {hl.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono block">{hl.date}</span>
                  <h3 className="font-bold text-base text-[#04063f] leading-snug">
                    {hl.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {hl.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. MISSÃO, VISÃO E CORPO DIRECTIVO (3 GALERIAS DE PERFIS)  */}
      {/* ========================================================= */}
      <section id="corpo-directivo" className="bg-[#f0f3ff] py-16 border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#fd761a] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-headline text-xl font-bold text-[#04063f]">
                Nossa Missão
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {publicContent.mission}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#04063f] flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <h3 className="font-serif-headline text-xl font-bold text-[#04063f]">
                Nossa Visão
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {publicContent.vision}
              </p>
            </div>
          </div>

          {/* 3 Leadership Profiles Gallery */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fd761a]">
                Liderança Pedagógica & Administrativa
              </span>
              <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
                Corpo Directivo Institucional
              </h2>
              <p className="text-xs text-slate-500">
                Profissionais dedicados ao desenvolvimento contínuo dos nossos alunos e encarregados no Cuanza Sul.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publicContent.directors.map((director) => (
                <div
                  key={director.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 hover:border-[#04063f]/30 transition-all"
                >
                  <img
                    src={director.photoUrl}
                    alt={director.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#04063f]/10 shadow-md"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#fd761a] block">
                      {director.role}
                    </span>
                    <h4 className="font-serif-headline text-lg font-bold text-[#04063f]">
                      {director.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {director.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. NÚMEROS DE IMPACTO DA INSTITUIÇÃO                     */}
      {/* ========================================================= */}
      <section id="numeros" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-[#04063f] text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#ffdbca]">
              Compromisso Histórico & Resultados
            </span>
            <h2 className="font-serif-headline text-2xl sm:text-4xl font-bold">
              Surgimos Para Formar Quadros de Excelência
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Métricas que comprovam a dedicação diária à educação primária angolana.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center relative z-10">
            <div className="space-y-1">
              <div className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#fd761a]">
                {publicContent.stats.activeStudents}+
              </div>
              <span className="text-xs text-slate-300 block font-medium">Alunos Matriculados</span>
            </div>

            <div className="space-y-1">
              <div className="font-serif-headline text-3xl sm:text-4xl font-bold text-white">
                {publicContent.stats.graduatedStudents}+
              </div>
              <span className="text-xs text-slate-300 block font-medium">Alunos Formados</span>
            </div>

            <div className="space-y-1">
              <div className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#fd761a]">
                {publicContent.stats.yearsOfExistence}
              </div>
              <span className="text-xs text-slate-300 block font-medium">Anos de Existência</span>
            </div>

            <div className="space-y-1">
              <div className="font-serif-headline text-3xl sm:text-4xl font-bold text-white">
                {publicContent.stats.teachersCount}
              </div>
              <span className="text-xs text-slate-300 block font-medium">Professores Qualificados</span>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#fd761a]">
                {publicContent.stats.staffCount}
              </div>
              <span className="text-xs text-slate-300 block font-medium">Funcionários de Apoio</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. GALERIA PUBLICITÁRIA DE IMAGENS                        */}
      {/* ========================================================= */}
      <section id="galeria" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fd761a]">
              Imagens Oficiais
            </span>
            <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
              Galeria da Vida Escolar
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fotografias oficiais publicadas pela Área Administrativa.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {['all', 'Salas de Aula', 'Campus', 'Fardamento'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedGalleryCategory === cat
                    ? 'bg-[#04063f] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'Todas as Imagens' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGallery.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-sm">
                  {img.category}
                </span>
              </div>
              <div className="p-4">
                <strong className="text-xs text-[#04063f] font-semibold block">
                  {img.title}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. MATRÍCULA VIRTUAL (ENROLLMENT WIZARD GATEWAY)           */}
      {/* ========================================================= */}
      <section id="matricula-section" className="w-full pt-10">
        {!enrollmentPeriod.isOpen ? (
          <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4 bg-white rounded-2xl border border-red-200 shadow-md">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#04063f]">
              Inscrições Encerradas no Momento
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              {enrollmentPeriod.closedMessage}
            </p>
            <div className="pt-2">
              <a
                href="#contactos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-colors"
              >
                <span>Falar com a Secretaria no Cuanza Sul</span>
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <EnrollmentWizard
            existingApplications={applications}
            onApplicationCreated={onApplicationCreated}
            onTrackApplication={onTrackApplication}
            onGoToPortal={onGoToPortal}
            onPrintVoucher={onPrintVoucher}
          />
        )}
      </section>

      {/* ========================================================= */}
      {/* 9. CONTACTOS & FORMULÁRIO DE MANDAR MENSAGEM              */}
      {/* ========================================================= */}
      <section id="contactos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
            Atendimento Oficial
          </span>
          <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
            Fale Diretamente com o CEP Pereira
          </h2>
          <p className="text-xs text-slate-500">
            A nossa secretaria na província do Cuanza Sul está pronta para esclarecer qualquer dúvida.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Institutional Contact Info */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#04063f] uppercase tracking-wide">
              Localização & Horários de Atendimento
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#04063f]">Endereço</strong>
                  <span>Província do Cuanza Sul, República de Angola</span>
                  <div className="text-xs text-slate-400 mt-0.5">Sede em Sumbe • Zona Segura</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#04063f]">Telefones da Secretaria</strong>
                  <span className="font-mono text-xs">+244 922 071 870 / +244 937 775 839</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#04063f]">E-mail Institucional</strong>
                  <span className="font-mono text-xs">secretaria@escola-pereira.ao</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#04063f]">Horário Escolar</strong>
                  <span>Segunda a Sexta-feira: 07h30 às 16h30</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={onOpenQRCodePoster}
                className="text-xs font-bold text-[#04063f] hover:text-[#fd761a] flex items-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#fd761a]" />
                <span>Imprimir Cartaz com QR Code Oficial</span>
              </button>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#04063f] uppercase tracking-wide">
              Mandar Mensagem à Secretaria
            </h3>

            {contactSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Mensagem enviada com sucesso! A secretaria responderá em breve.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex.: Manuel Francisco Pereira"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correio Electrónico (E-mail) *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="seuemail@exemplo.ao"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assunto *</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                    >
                      <option value="Informações sobre Matrículas">Informações sobre Matrículas</option>
                      <option value="Agendamento de Visita">Agendamento de Visita ao Campus</option>
                      <option value="Dúvidas sobre Documentação">Dúvidas sobre Documentação</option>
                      <option value="Outro Assunto">Outro Assunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mensagem *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Escreva a sua mensagem para a direcção do colégio..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#04063f] text-white text-xs font-bold hover:bg-[#1b1f54] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. AUTH MODAL (ENTRAR OU CRIAR CONTA)                    */}
      {/* ========================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#fd761a]" />
                <h3 className="font-bold text-base text-[#04063f]">
                  {authMode === 'login' ? 'Entrar no Portal do Encarregado' : 'Criar Nova Conta de Encarregado'}
                </h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Authentication One-Click Button */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  onGoToPortal('complexoescolarpereira@gmail.com', 'Encarregado Google (Pereira)');
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2.5 hover:border-slate-400"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Começar com a Conta Google</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] uppercase font-bold text-slate-400">ou aceder com e-mail</span>
                <span className="flex-1 h-px bg-slate-200" />
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo do Encarregado *</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Ex.: António Pereira Gaspar"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contacto Telefónico *</label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+244 922..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Registado *</label>
                <input
                  type="email"
                  required
                  value={authEmail || 'antonio.gaspar@exemplo.ao'}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="encarregado@exemplo.ao"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Palavra-passe *</label>
                <input
                  type="password"
                  required
                  value={authPassword || '••••••••••••'}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#fd761a] text-white text-xs font-bold hover:bg-[#ea580c] transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{authMode === 'login' ? 'Entrar na Área Reservada' : 'Confirmar e Criar Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-[#04063f] font-semibold hover:underline"
                >
                  {authMode === 'login'
                    ? 'Ainda não tem conta? Criar nova conta de encarregado'
                    : 'Já tem conta registada? Entrar com as suas credenciais'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
