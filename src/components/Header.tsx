import React from 'react';
import { Phone, MapPin, ShieldCheck, Lock, UserCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'public' | 'guardian' | 'admin';
  onSwitchRole: (role: 'public' | 'guardian' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onSwitchRole
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'ensino', label: 'Ensino' },
    { id: 'vitrine', label: 'Vitrine' },
    { id: 'revista', label: 'Revista' },
    { id: 'repositorio', label: 'Repositório' },
    { id: 'contactos', label: 'Contactos' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(17,20,56,0.06)] no-print">
      {/* Top Utility Ribbon */}
      <div className="bg-[#04063f] text-white py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-y-1">
          <div className="flex items-center gap-4 text-slate-200">
            <span className="flex items-center gap-1.5 opacity-90">
              <Phone className="w-3.5 h-3.5 text-[#fd761a]" />
              <a href="tel:922071870" className="hover:text-white transition-colors">922071870</a> / 
              <a href="tel:937775839" className="hover:text-white transition-colors">937775839</a>
            </span>
            <span className="hidden sm:inline-block opacity-40">|</span>
            <span className="hidden sm:flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5 text-[#fd761a]" />
              Cuanza Sul, Angola
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="italic font-serif-headline text-xs opacity-80 tracking-wide hidden md:inline">
              “Surgimos para formar quadros de excelência”
            </span>
            <button
              onClick={() => {
                if (userRole === 'admin') {
                  onSwitchRole('public');
                  onNavigate('matricula-virtual');
                } else {
                  onSwitchRole('admin');
                  onNavigate('admin');
                }
              }}
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded transition-all ${
                userRole === 'admin' 
                  ? 'bg-amber-500/20 text-[#ffb690] border border-amber-500/30' 
                  : 'text-[#ffdbca] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{userRole === 'admin' ? 'Painel Admin Activo' : 'Acesso Administrativo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-3 shrink-0 text-left focus:outline-none"
        >
          <div className="w-11 h-11 rounded-lg bg-[#04063f] text-white flex items-center justify-center font-serif-headline text-xl font-bold shadow-md">
            CEP
          </div>
          <div className="flex flex-col">
            <span className="font-serif-headline text-xl sm:text-2xl text-[#04063f] uppercase font-bold tracking-tight leading-none">
              CEP Pereira
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              Ensino Primário e I.º Ciclo
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-sm font-semibold transition-colors py-2 relative ${
                currentView === link.id
                  ? 'text-[#04063f] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#fd761a]'
                  : 'text-slate-600 hover:text-[#04063f]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('matricula-virtual')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 ${
              currentView === 'matricula-virtual'
                ? 'bg-[#ea580c] text-white ring-2 ring-[#fd761a]'
                : 'bg-[#fd761a] text-white hover:bg-[#ea580c]'
            }`}
          >
            <span>Matrícula Virtual</span>
          </button>

          <button
            onClick={() => {
              if (userRole === 'guardian') {
                onNavigate('portal-do-encarregado');
              } else {
                onSwitchRole('guardian');
                onNavigate('portal-do-encarregado');
              }
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              userRole === 'guardian' && currentView === 'portal-do-encarregado'
                ? 'bg-[#1b1f54] text-white ring-2 ring-[#bec2ff]'
                : 'bg-[#04063f] text-white hover:bg-[#1b1f54]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal do Encarregado</span>
            <span className="sm:hidden">Portal</span>
          </button>

          {/* User Role Indicator / Switcher */}
          <div className="pl-2 border-l border-slate-200 hidden md:flex items-center gap-2">
            <div 
              title={userRole === 'admin' ? 'Perfil: Secretaria / Administrador' : userRole === 'guardian' ? 'Perfil: Encarregado de Educação' : 'Visitante'} 
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-inner cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                  : userRole === 'guardian'
                  ? 'bg-blue-100 text-blue-900 border-2 border-blue-400'
                  : 'bg-slate-100 text-slate-700'
              }`}
              onClick={() => {
                if (userRole === 'public') {
                  onSwitchRole('guardian');
                  onNavigate('portal-do-encarregado');
                } else if (userRole === 'guardian') {
                  onSwitchRole('admin');
                  onNavigate('admin');
                } else {
                  onSwitchRole('public');
                  onNavigate('matricula-virtual');
                }
              }}
            >
              {userRole === 'admin' ? 'ADM' : userRole === 'guardian' ? 'ENC' : 'VIS'}
            </div>
          </div>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === link.id
                  ? 'bg-slate-100 text-[#04063f] font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onSwitchRole('admin');
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs font-semibold text-slate-700 hover:text-[#04063f] px-3 py-2 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#fd761a]" /> Acesso Administrativo (Secretaria)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
