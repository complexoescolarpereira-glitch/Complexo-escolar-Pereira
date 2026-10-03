import React from 'react';
import { Phone, Mail, Clock, MapPin, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#1b1f54] text-white mt-16 pt-16 pb-8 shadow-[0_-4px_24px_rgba(4,6,63,0.08)] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Institutional column */}
          <div className="space-y-4">
            <h3 className="font-serif-headline text-lg text-white font-bold tracking-tight">
              COMPLEXO ESCOLAR PRIVADO PEREIRA
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Instituição vocacionada à educação integral do Ensino Primário e Primeiro Ciclo. Pautamos a nossa conduta pedagógica na transmissão de valores cívicos, disciplina e excelência científica.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold text-slate-200">
              <Award className="w-4 h-4 text-[#fd761a]" />
              <span>Registo M.E.D. Cuanza Sul • Reconhecimento Oficial</span>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-base text-white font-semibold mb-4">
              Navegação e Serviços
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-white transition-colors text-left">
                  Página Inicial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sobre')} className="hover:text-white transition-colors text-left">
                  Projecto Pedagógico & Directoria
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ensino')} className="hover:text-white transition-colors text-left">
                  Ciclos e Matriz Curricular
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('matricula-virtual')} className="hover:text-[#ffdbca] text-[#fd761a] font-medium transition-colors text-left">
                  Candidaturas e Matrículas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('repositorio')} className="hover:text-white transition-colors text-left">
                  Biblioteca & Fichas de Apoio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('revista')} className="hover:text-white transition-colors text-left">
                  Revista Escolar & Eventos
                </button>
              </li>
            </ul>
          </div>

          {/* Motto column */}
          <div>
            <h4 className="text-base text-white font-semibold mb-4">
              Lema & Compromisso
            </h4>
            <blockquote className="italic font-serif-headline text-sm leading-snug text-slate-200 border-l-2 border-[#fd761a] pl-3 py-1 mb-3">
              “Surgimos para formar quadros de excelência, dotando a nova geração angolana de rigor e consciência moral.”
            </blockquote>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Acompanhamento individualizado e rigor na consolidação da leitura, cálculo e expressão artística em turmas de até 25 educandos.
            </p>
          </div>

          {/* Headquarter & Contacts */}
          <div>
            <h4 className="text-base text-white font-semibold mb-4">
              Sede e Atendimento
            </h4>
            <div className="space-y-2.5 text-xs text-slate-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#fd761a] shrink-0 mt-0.5" />
                <span>Província do Cuanza Sul, República de Angola</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#fd761a] shrink-0" />
                <span>+244 922 071 870 / 937 775 839</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#fd761a] shrink-0" />
                <span>secretaria@escola-pereira.ao</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fd761a] shrink-0" />
                <span>Segunda a Sexta: 07h30 - 16h30</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Complexo Escolar Privado Pereira. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('portal-do-encarregado')} className="hover:text-white transition-colors">
              Área Reservada
            </button>
            <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
              Secretaria Digital
            </button>
            <button onClick={() => onNavigate('contactos')} className="hover:text-white transition-colors">
              Regulamento Interno
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
