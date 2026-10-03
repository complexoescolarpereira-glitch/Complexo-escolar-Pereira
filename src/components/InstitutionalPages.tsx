import React from 'react';
import { 
  School, 
  Award, 
  BookOpen, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Download, 
  Sparkles,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface InstitutionalPagesProps {
  view: string;
  onNavigate: (view: string) => void;
}

export const InstitutionalPages: React.FC<InstitutionalPagesProps> = ({ view, onNavigate }) => {
  // PÁGINA INÍCIO
  if (view === 'inicio') {
    return (
      <div className="space-y-16 py-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#04063f] to-[#1b1f54] text-white rounded-2xl mx-4 sm:mx-6 max-w-7xl lg:mx-auto p-8 sm:p-14 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ffdbca] text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#fd761a] animate-pulse" />
                Educação de Rigor no Cuanza Sul
              </div>
              <h1 className="font-serif-headline text-3xl sm:text-5xl font-bold leading-tight">
                Complexo Escolar Privado Pereira
              </h1>
              <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-light">
                “Surgimos para formar quadros de excelência”. Do ensino infantil à conclusão do 1.º ciclo do Ensino Primário, proporcionamos uma formação humanista, científica e disciplinar inigualável.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('matricula-virtual')}
                  className="px-6 py-3 rounded-lg bg-[#fd761a] text-white font-bold text-sm hover:bg-[#ea580c] transition-all shadow-md flex items-center gap-2"
                >
                  <span>Matrícula Virtual 2024/2025</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('sobre')}
                  className="px-6 py-3 rounded-lg bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-all border border-white/20"
                >
                  Conhecer o Nosso Projeto
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <img
                src="/src/assets/images/cep_school_campus_1790861289408.jpg"
                alt="Campus do CEP Pereira em Cuanza Sul"
                className="w-full h-80 object-cover rounded-xl shadow-2xl border-2 border-white/20"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-[#04063f] p-3.5 rounded-xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#04063f] text-[#fd761a] flex items-center justify-center font-bold">
                  25
                </div>
                <div>
                  <strong className="text-xs uppercase block font-bold">Rácio Garantido</strong>
                  <span className="text-[11px] text-slate-500">Máximo 25 alunos por turma</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
              Pilares Pedagógicos
            </span>
            <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
              Excelência Educativa Desde os Primeiros Passos
            </h2>
            <p className="text-sm text-slate-600">
              Uma abordagem pedagógica pensada para desenvolver a autonomia, raciocínio lógico e a consciência cívica dos futuros líderes angolanos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fd761a] flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#04063f]">Alfabetização & Leitura Sólida</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidação rigorosa da leitura fluente, escrita ortográfica e cálculo mental a partir da Iniciação e 1.ª classe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#04063f] flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#04063f]">Quadro de Mérito e Valores</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reconhecimento contínuo de mérito acadêmico, comportamento exemplar e respeito pelos símbolos nacionais da República de Angola.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#04063f]">Acompanhamento Tutorial</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diálogo próximo entre professores e encarregados através do Portal Digital, canais directos e assembleias de pais.
              </p>
            </div>
          </div>
        </section>

        {/* Classroom Experience Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
                Ambiente Pedagógico Moderno
              </span>
              <h2 className="font-serif-headline text-2xl sm:text-3xl font-bold text-[#04063f]">
                Salas Climatizadas, Recursos Didácticos e Segurança Integral
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                As nossas salas de aula foram projetadas para estimular a curiosidade científica e o amor pelo estudo. Com turmas reduzidas, cada criança tem a atenção individualizada que merece.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Laboratório infantil de informática e experimentação científica</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Biblioteca com acervo infanto-juvenil e clássicos da literatura</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quadra polidesportiva para educação física e recreio monitorado</span>
                </li>
              </ul>
              <div className="pt-3">
                <button
                  onClick={() => onNavigate('vitrine')}
                  className="text-xs font-bold text-[#04063f] hover:text-[#fd761a] transition-colors flex items-center gap-1.5"
                >
                  <span>Explorar Vitrine Escolar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[300px]">
              <img
                src="/src/assets/images/cep_classroom_learning_1790861301453.jpg"
                alt="Sala de aula no CEP Pereira"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // PÁGINA SOBRE
  if (view === 'sobre') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
            Projecto Pedagógico & Directoria
          </span>
          <h1 className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#04063f]">
            Sobre o Complexo Escolar Privado Pereira
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Fundado na província do Cuanza Sul com a missão inabalável de oferecer educação de topo, pautada em padrões internacionais de disciplina, rigor e afectividade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
              A Nossa História e Compromisso com Angola
            </h2>
            <p>
              O CEP Pereira nasceu da aspiração de proporcionar às famílias do Cuanza Sul uma alternativa educativa privada que combina rigor metodológico, corpo docente especializado e infraestruturas concebidas para o desenvolvimento pleno da criança.
            </p>
            <p>
              Homologado oficialmente pelas entidades do Ministério da Educação, o colégio centra o seu plano pedagógico estritamente no <strong>Ensino Primário (Iniciação à 6.ª Classe)</strong>, garantindo foco total na etapa mais decisiva da vida formativa.
            </p>
            <div className="p-4 bg-[#f2f3ff] rounded-xl border border-indigo-100 space-y-2">
              <strong className="text-xs text-[#04063f] uppercase block font-bold">
                Lema Institucional
              </strong>
              <blockquote className="italic font-serif-headline text-base text-[#04063f]">
                “Surgimos para formar quadros de excelência, dotando a nova geração angolana de rigor e consciência moral.”
              </blockquote>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src="/src/assets/images/cep_school_campus_1790861289408.jpg"
              alt="Instalações"
              className="w-full h-72 object-cover rounded-xl shadow-md border border-slate-200"
            />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="font-serif-headline text-2xl font-bold text-[#04063f]">100%</span>
                <div className="text-[11px] text-slate-500 font-medium">Docentes com Formação Superior Pedagógica</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="font-serif-headline text-2xl font-bold text-[#fd761a]">25</span>
                <div className="text-[11px] text-slate-500 font-medium">Alunos por Turma (Limite Rígido)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA ENSINO
  if (view === 'ensino') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
            Ciclos e Matriz Curricular Oficial
          </span>
          <h1 className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#04063f]">
            Oferta Curricular: Iniciação à 6.ª Classe
          </h1>
          <p className="text-sm text-slate-600">
            Conheça o plano curricular estruturado segundo as directrizes ministeriais para o Ensino Primário.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Iniciação (Pré-Escolar)',
              age: '5 aos 6 anos',
              desc: 'Socialização, coordenação motora fina, introdução lúdica às letras e aos números, expressão musical e plástica.',
              turnos: 'Manhã / Tarde'
            },
            {
              title: '1.ª e 2.ª Classes',
              age: '6 aos 8 anos',
              desc: 'Alfabetização intensiva, leitura fonética e compreensiva, operações fundamentais de cálculo, estudo do meio circundante.',
              turnos: 'Manhã / Tarde'
            },
            {
              title: '3.ª e 4.ª Classes',
              age: '8 aos 10 anos',
              desc: 'Desenvolvimento de raciocínio lógico-matemático, redação estruturada, história de Angola e cidadania cívica.',
              turnos: 'Manhã / Tarde'
            },
            {
              title: '5.ª e 6.ª Classes',
              age: '10 aos 12 anos',
              desc: 'Conclusão do Ensino Primário com preparação rigorosa para o 1.º Ciclo do Ensino Secundário. Ciências naturais, geografia e produção textual.',
              turnos: 'Manhã / Tarde'
            },
            {
              title: 'Actividades Extracurriculares',
              age: 'Todas as turmas',
              desc: 'Xadrez escolar, noções básicas de programação infantil, coral escolar, teatro pedagógico e ginástica formativa.',
              turnos: 'Sábados e Contra-turno'
            },
            {
              title: 'Apoio ao Estudo & Tutoria',
              age: 'Alunos com necessidade de reforço',
              desc: 'Aulas de recuperação e consolidação de leitura e cálculo sem custo adicional para os encarregados.',
              turnos: 'Acompanhamento Diário'
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#fd761a] uppercase">{item.age}</span>
                <span className="text-[10px] font-mono text-slate-400">{item.turnos}</span>
              </div>
              <h3 className="font-bold text-lg text-[#04063f]">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('matricula-virtual')}
            className="px-6 py-3 rounded-lg bg-[#04063f] text-white font-bold text-sm hover:bg-[#1b1f54] transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Submeter Candidatura de Matrícula</span>
            <ArrowRight className="w-4 h-4 text-[#fd761a]" />
          </button>
        </div>
      </div>
    );
  }

  // PÁGINA VITRINE
  if (view === 'vitrine') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
            Galeria & Vida Escolar
          </span>
          <h1 className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#04063f]">
            Vitrine do Complexo Escolar Privado Pereira
          </h1>
          <p className="text-sm text-slate-600">
            Momentos especiais, actividades desportivas, feira das ciências e celebrações cívicas dos nossos educandos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-3">
            <img
              src="/src/assets/images/cep_classroom_learning_1790861301453.jpg"
              alt="Aula de Leitura"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#fd761a]">Sala de Aula</span>
              <h4 className="font-bold text-base text-[#04063f]">Semana da Língua Portuguesa</h4>
              <p className="text-xs text-slate-500">Recital de poesia e apresentação de contos tradicionais angolanos pelos educandos da 2.ª e 3.ª classes.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-3">
            <img
              src="/src/assets/images/cep_school_campus_1790861289408.jpg"
              alt="Campus Escolar"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#fd761a]">Instalações</span>
              <h4 className="font-bold text-base text-[#04063f]">Pátio Escolar e Desporto</h4>
              <p className="text-xs text-slate-500">Momentos de recreio activo, convívio monitorado e torneio inter-turmas de futebol e basquetebol infantil.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-3">
            <img
              src="/src/assets/images/cep_student_portrait_1790861275389.jpg"
              alt="Quadro de Honra"
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#fd761a]">Mérito Acadêmico</span>
              <h4 className="font-bold text-base text-[#04063f]">Cerimónia do Quadro de Excelência</h4>
              <p className="text-xs text-slate-500">Homenagem aos melhores alunos do trimestre com entrega de diplomas e livros didácticos.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA REVISTA / REPOSITÓRIO
  if (view === 'revista' || view === 'repositorio') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
            {view === 'revista' ? 'Revista Escolar Periódica' : 'Repositório Pedagógico & Fichas'}
          </span>
          <h1 className="font-serif-headline text-3xl font-bold text-[#04063f]">
            {view === 'revista' ? 'A Voz do CEP Pereira' : 'Biblioteca Digital & Materiais de Apoio'}
          </h1>
          <p className="text-sm text-slate-600">
            Documentos, edições informativas e cadernos de exercícios para apoio aos estudos em casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Revista CEP Pereira - Edição Especial de Abertura 2024/2025', date: 'Julho 2024', size: '4.2 MB', category: 'Publicação Oficial' },
            { title: 'Caderno de Fichas de Apoio - Língua Portuguesa (1.ª à 3.ª Classe)', date: 'Agosto 2024', size: '2.8 MB', category: 'Pedagógico' },
            { title: 'Guia do Encarregado de Educação - Normas e Rotinas Escolares', date: 'Setembro 2024', size: '1.5 MB', category: 'Regulamento' },
            { title: 'Coletânea de Exercícios de Matemática Elementar (4.ª à 6.ª Classe)', date: 'Setembro 2024', size: '3.1 MB', category: 'Pedagógico' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#fd761a]">{item.category} • {item.date}</span>
                <h4 className="font-bold text-sm text-[#04063f]">{item.title}</h4>
                <span className="text-xs text-slate-400 font-mono">Tamanho: {item.size} • Formato PDF</span>
              </div>
              <button
                onClick={() => alert(`Download iniciado: ${item.title}`)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#04063f] border border-slate-200 transition-colors"
                title="Descarregar ficheiro"
              >
                <Download className="w-5 h-5 text-[#fd761a]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PÁGINA CONTACTOS
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-wider text-[#fd761a] font-bold">
          Localização e Atendimento
        </span>
        <h1 className="font-serif-headline text-3xl font-bold text-[#04063f]">
          Contacte a Secretaria Escolar
        </h1>
        <p className="text-sm text-slate-600">
          Estamos à sua disposição para visitas guiadas, matrículas e esclarecimento pedagógico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-[#04063f]">Canais de Atendimento Direto</h3>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#04063f]">Localização</strong>
                <span>Província do Cuanza Sul, República de Angola</span>
                <div className="text-xs text-slate-500 mt-0.5">Sede em Sumbe • Acesso asfaltado com parque seguro</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#04063f]">Linhas Telefónicas Oficiais</strong>
                <span className="font-mono">+244 922 071 870 / 937 775 839</span>
                <div className="text-xs text-slate-500 mt-0.5">Atendimento geral e apoio ao encarregado</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#04063f]">Correio Electrónico</strong>
                <span className="font-mono">secretaria@escola-pereira.ao</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#04063f]">Horário de Secretaria</strong>
                <span>Segunda a Sexta-feira: 07h30 às 16h30</span>
                <div className="text-xs text-slate-500 mt-0.5">Sábados: Atendimento por marcação para visitas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-[#04063f]">Envie uma Mensagem à Direcção</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Mensagem enviada com sucesso à Direcção do CEP Pereira!');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-[#04063f] mb-1">O seu Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex.: Maria Luísa Pereira"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#04063f] mb-1">Contacto Telefónico *</label>
                <input
                  type="tel"
                  required
                  placeholder="+244 922..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#04063f] mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.ao"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#04063f] mb-1">Assunto</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]">
                <option>Pedido de Informações sobre Matrículas</option>
                <option>Agendamento de Visita às Instalações</option>
                <option>Apoio com Documentação Escolar</option>
                <option>Outro Assunto</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#04063f] mb-1">Mensagem *</label>
              <textarea
                rows={4}
                required
                placeholder="Escreva a sua questão ou mensagem para a equipa pedagógica..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04063f]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#04063f] text-white font-bold text-xs hover:bg-[#1b1f54] transition-colors shadow-sm"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
