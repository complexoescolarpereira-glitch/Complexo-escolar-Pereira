import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  School, 
  User, 
  Phone, 
  Mail, 
  Search, 
  Lock, 
  Copy, 
  Printer, 
  PlusCircle, 
  Check, 
  AlertCircle, 
  Building2,
  FileCheck,
  MessageCircle,
  Camera,
  FileBadge
} from 'lucide-react';
import { GradeLevel, Shift, ApplicationRecord } from '../types';

interface EnrollmentWizardProps {
  onApplicationCreated: (app: ApplicationRecord) => void;
  onTrackApplication: (code: string) => void;
  onGoToPortal: () => void;
  onPrintVoucher: (app: ApplicationRecord) => void;
  existingApplications: ApplicationRecord[];
}

export const EnrollmentWizard: React.FC<EnrollmentWizardProps> = ({
  onApplicationCreated,
  onTrackApplication,
  onGoToPortal,
  onPrintVoucher,
  existingApplications
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Student Form State
  const [studentPhoto, setStudentPhoto] = useState<string>('/src/assets/images/cep_student_portrait_1790861275389.jpg');
  const [studentName, setStudentName] = useState<string>('Manuel Domingos Pereira Gaspar');
  const [studentBirthDate, setStudentBirthDate] = useState<string>('2017-04-12');
  const [studentAge, setStudentAge] = useState<string>('7 anos');
  const [studentGender, setStudentGender] = useState<'Masculino' | 'Feminino' | ''>('Masculino');
  const [studentDoc, setStudentDoc] = useState<string>('007421890KS043');
  const [studentBirthPlace, setStudentBirthPlace] = useState<string>('Sumbe, Cuanza Sul');
  const [studentAddress, setStudentAddress] = useState<string>('Bairro Chingo, Rua da Liberdade, Casa N.º 42');

  // Academic Form State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('1.ª Classe');
  const [selectedShift, setSelectedShift] = useState<Shift>('Manhã (07h30 - 12h15)');
  const [schoolYear] = useState<string>('2024 / 2025');
  const [entryType, setEntryType] = useState<string>('Primeira Matrícula');
  const [originSchool, setOriginSchool] = useState<string>('Colégio São José (ou Primeira Matrícula)');

  // Guardian Form State
  const [guardianName, setGuardianName] = useState<string>('Dr. António Pereira Gaspar');
  const [guardianKinship, setGuardianKinship] = useState<string>('Pai');
  const [guardianBI, setGuardianBI] = useState<string>('003819284KS012');
  const [guardianProfession, setGuardianProfession] = useState<string>('Engenheiro Agrónomo');
  const [guardianPhone, setGuardianPhone] = useState<string>('922 071 870');
  const [guardianWhatsapp, setGuardianWhatsapp] = useState<string>('937 775 839');
  const [guardianEmail, setGuardianEmail] = useState<string>('antonio.gaspar@exemplo.ao');

  // Documents State
  const [doc1Name, setDoc1Name] = useState<string>('Cedula_Manuel_Gaspar.pdf');
  const [doc2Name, setDoc2Name] = useState<string>('Certificado_Iniciacao_2024.pdf');
  const [doc3Name, setDoc3Name] = useState<string>('Atestado_Medico_Sumbe.pdf');

  // Confirmation State
  const [termAccepted, setTermAccepted] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [latestCreatedRecord, setLatestCreatedRecord] = useState<ApplicationRecord | null>(null);

  // Status Tracker Widget State in sidebar
  const [trackQuery, setTrackQuery] = useState<string>('CEPP-2024-8942');
  const [trackResult, setTrackResult] = useState<{
    found: boolean;
    status: string;
    message: string;
    app?: ApplicationRecord;
  } | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculate age automatically from birth date
  const handleDateChange = (dateStr: string) => {
    setStudentBirthDate(dateStr);
    if (!dateStr) {
      setStudentAge('');
      return;
    }
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setStudentAge(age > 0 ? `${age} anos` : 'Recém-nascido');
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStudentPhoto(event.target.result as string);
          showToast('Fotografia tipo passe carregada com sucesso!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step navigation with validation
  const goToStep = (step: number) => {
    if (step < 1 || step > totalSteps) return;
    setCurrentStep(step);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Handle Submit Form
  const handleSubmitApplication = () => {
    if (!termAccepted) {
      showToast('Por favor, assinale o termo de responsabilidade.');
      return;
    }

    setIsSubmitting(true);

    const generatedCode = 'CEPP-2024-' + Math.floor(1000 + Math.random() * 9000);

    setTimeout(() => {
      const nextSeqNumber = existingApplications.length + 1;
      const newRecord: ApplicationRecord = {
        sequenceNumber: nextSeqNumber,
        id: generatedCode,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        student: {
          name: studentName || 'Aluno Sem Nome',
          birthDate: studentBirthDate,
          age: studentAge || '7 anos',
          gender: studentGender || 'Masculino',
          documentNumber: studentDoc || '007421890KS043',
          birthPlace: studentBirthPlace || 'Sumbe, Cuanza Sul',
          address: studentAddress || 'Cuanza Sul, Angola',
          avatarUrl: studentPhoto
        },
        academic: {
          grade: selectedGrade,
          shift: selectedShift,
          schoolYear,
          entryType,
          originSchool
        },
        guardian: {
          name: guardianName || 'Encarregado',
          kinship: guardianKinship,
          documentNumber: guardianBI || '003819284KS012',
          profession: guardianProfession,
          phone: guardianPhone ? `+244 ${guardianPhone}` : '+244 922 071 870',
          whatsapp: guardianWhatsapp ? `+244 ${guardianWhatsapp}` : '+244 937 775 839',
          email: guardianEmail || 'encarregado@exemplo.ao'
        },
        documents: {
          identityDoc: Boolean(doc1Name),
          identityFileName: doc1Name,
          certificateDoc: Boolean(doc2Name),
          certificateFileName: doc2Name,
          medicalDoc: Boolean(doc3Name),
          medicalFileName: doc3Name
        },
        status: 'Pendente',
        statusNotes: 'Candidatura submetida com sucesso via Portal Virtual. Aguardando conferência física de documentos.',
        assignedClassRoom: `${selectedGrade} - Em análise de vaga`
      };

      setSubmittedCode(generatedCode);
      setLatestCreatedRecord(newRecord);
      onApplicationCreated(newRecord);
      setIsSubmitting(false);
      setCurrentStep(6); // Success Step
      showToast('Matrícula registada com sucesso! Guarde o seu código.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 1100);
  };

  // Quick Tracker Check
  const handleQuickTrack = () => {
    if (!trackQuery.trim()) {
      showToast('Introduza um código ou e-mail válido.');
      return;
    }
    const cleanQuery = trackQuery.trim().toLowerCase();
    const found = existingApplications.find(
      (app) =>
        app.id.toLowerCase() === cleanQuery ||
        app.guardian.email.toLowerCase() === cleanQuery ||
        app.student.documentNumber.toLowerCase() === cleanQuery
    );

    if (found) {
      setTrackResult({
        found: true,
        status: found.status,
        message: `Inscrição ${found.id} para ${found.student.name} localizada. Turma: ${found.academic.grade}.`,
        app: found
      });
      showToast(`Inscrição localizada: Estado ${found.status}`);
    } else {
      setTrackResult({
        found: false,
        status: 'Não Encontrado',
        message: 'Nenhum registo encontrado com estes dados. Verifique o código e tente novamente.'
      });
      showToast('Código de inscrição não encontrado.');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Código copiado para a área de transferência!');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl bg-[#04063f] text-white text-sm animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#fd761a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#04063f] via-[#1b1f54] to-[#04063f] text-white py-10 sm:py-14">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#fd761a]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[#ffdbca] text-xs font-semibold tracking-wider uppercase">
                <span className="inline-block w-2 h-2 rounded-full bg-[#fd761a] animate-pulse" />
                Ano Lectivo 2024 / 2025 • Inscrições Oficiais
              </div>
              <h1 className="font-serif-headline text-3xl sm:text-4xl lg:text-5xl text-white leading-tight font-bold tracking-tight">
                Portal de Matrícula Virtual
              </h1>
              <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl font-light">
                Portal do Encarregado — crie uma conta para matricular os seus educandos e acompanhar o estado das inscrições em tempo real no Complexo Escolar Privado Pereira.
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#fd761a]" />
                  Ensino Oficialmente Reconhecido
                </span>
                <span className="flex items-center gap-1.5">
                  <School className="w-4 h-4 text-[#fd761a]" />
                  Iniciação à 6.ª Classe Exclusivamente
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#fd761a]" />
                  Supabase Cloud Security
                </span>
              </div>
            </div>

            {/* Quick Status Card in Hero */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl max-w-sm w-full shadow-lg border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-[#ffdbca] font-semibold">
                  Período Letivo Corrente
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fd761a] text-white text-xs font-bold">
                  Fase Aberta
                </span>
              </div>
              <div className="text-white font-serif-headline text-2xl font-bold">
                15 Julho – 30 Setembro
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Inscrições para o ano letivo na Iniciação e Ensino Primário no Complexo Escolar Privado Pereira.
              </p>
            </div>
          </div>

          {/* Process Progress Bar Component */}
          {currentStep <= 5 && (
            <div className="mt-8 pt-6 bg-white/5 rounded-xl p-4 sm:p-5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold mb-3 text-slate-300 px-1">
                <span className="text-[#ffdbca] uppercase tracking-wider font-bold">
                  Progresso da Submissão
                </span>
                <span className="text-white font-bold">
                  Etapa {currentStep} de {totalSteps} ({Math.round((currentStep / totalSteps) * 100)}%)
                </span>
              </div>

              {/* Track Bar */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-5">
                <div
                  className="bg-[#fd761a] h-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              {/* Stepper Navigation Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { num: 1, title: 'Educando', subtitle: 'Identificação & Foto' },
                  { num: 2, title: 'Escolaridade', subtitle: 'Classe & Turno' },
                  { num: 3, title: 'Encarregado', subtitle: 'BI & Contactos' },
                  { num: 4, title: 'Documentos', subtitle: 'Upload Digital' },
                  { num: 5, title: 'Confirmação', subtitle: 'Validação Final' },
                ].map((step) => {
                  const isDone = currentStep > step.num;
                  const isCurrent = currentStep === step.num;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => goToStep(step.num)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                        isCurrent
                          ? 'bg-white text-[#04063f] ring-2 ring-[#fd761a] shadow-sm font-semibold'
                          : isDone
                          ? 'bg-white/90 text-[#04063f] hover:bg-white'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone
                            ? 'bg-[#fd761a] text-white'
                            : isCurrent
                            ? 'bg-[#04063f] text-white'
                            : 'bg-white/30 text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate leading-tight">{step.title}</div>
                        <div className="text-[10px] opacity-80 truncate">{step.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Two-Column Bento Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Interactive Multi-Step Form (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 sm:p-8 relative overflow-hidden">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* ========================================== */}
                {/* ETAPA 1: DADOS DO EDUCANDO                */}
                {/* ========================================== */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[#fd761a] text-xs uppercase tracking-wider font-bold">
                          Etapa 01
                        </span>
                        <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                          Identificação do Educando
                        </h2>
                        <p className="text-xs text-slate-500">
                          Insira com rigor os dados biográficos conforme constam na Cédula ou BI do candidato.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#04063f] flex items-center justify-center shrink-0 border border-slate-200">
                        <User className="w-6 h-6 text-[#04063f]" />
                      </div>
                    </div>

                    {/* Photo Upload Avatar Box */}
                    <div className="bg-[#f2f3ff] p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-center gap-5 border border-indigo-100/60">
                      <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-white border-2 border-dashed border-slate-300 shrink-0 flex flex-col items-center justify-center text-center p-1 group">
                        {studentPhoto ? (
                          <img
                            src={studentPhoto}
                            alt="Fotografia do Aluno"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Camera className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 font-medium leading-tight">
                              Passe (3×4)<br />Aguardando
                            </span>
                          </div>
                        )}
                        <label className="absolute inset-0 bg-[#04063f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-md">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold">Alterar Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="space-y-1.5 text-center sm:text-left flex-1">
                        <h4 className="text-base font-bold text-[#04063f]">
                          Fotografia Tipo Passe
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Carregamento para o bucket <code className="text-[#04063f] font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold">educandos-avatars</code> do Supabase Storage. Formato JPEG ou PNG, fundo neutro.
                        </p>
                        <div className="pt-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                            <Upload className="w-3.5 h-3.5 text-[#fd761a]" />
                            <span>Selecionar Fotografia</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                        Nome Completo do Aluno *
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Ex.: Manuel Domingos Pereira Gaspar"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm"
                      />
                    </div>

                    {/* Date of Birth & Gender & Age calculation */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Data de Nascimento *
                        </label>
                        <input
                          type="date"
                          value={studentBirthDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          required
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Idade Estimada
                        </label>
                        <input
                          type="text"
                          value={studentAge}
                          readOnly
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Género *
                        </label>
                        <select
                          value={studentGender}
                          onChange={(e) => setStudentGender(e.target.value as any)}
                          required
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm"
                        >
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                        </select>
                      </div>
                    </div>

                    {/* Document Number & Nationality */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          N.º do B.I. ou Assento de Nascimento *
                        </label>
                        <input
                          type="text"
                          value={studentDoc}
                          onChange={(e) => setStudentDoc(e.target.value.toUpperCase())}
                          placeholder="Ex.: 007421890KS043"
                          required
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] uppercase focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Naturalidade / Município
                        </label>
                        <input
                          type="text"
                          value={studentBirthPlace}
                          onChange={(e) => setStudentBirthPlace(e.target.value)}
                          placeholder="Ex.: Sumbe, Cuanza Sul"
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Residence in Cuanza Sul */}
                    <div>
                      <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                        Endereço Residencial (Cuanza Sul) *
                      </label>
                      <input
                        type="text"
                        value={studentAddress}
                        onChange={(e) => setStudentAddress(e.target.value)}
                        placeholder="Ex.: Bairro Chingo, Rua da Liberdade, Casa N.º 42"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] focus:bg-white text-sm"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
                      >
                        <span>Continuar para Dados Escolares</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* ETAPA 2: DADOS ESCOLARES                   */}
                {/* ========================================== */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[#fd761a] text-xs uppercase tracking-wider font-bold">
                          Etapa 02
                        </span>
                        <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                          Dados Académicos e Ciclos
                        </h2>
                        <p className="text-xs text-slate-500">
                          Complexo Escolar Privado Pereira — Oferta pedagógica restrita do Ensino Primário.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#04063f] flex items-center justify-center shrink-0 border border-slate-200">
                        <School className="w-6 h-6 text-[#04063f]" />
                      </div>
                    </div>

                    {/* Official Limitation Notice Banner */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="font-bold">Aviso Normativo do Regulamento Interno:</strong> Por directriz ministerial e alvará institucional, o CEP Pereira lecciona exclusivamente desde a <strong>Iniciação à 6.ª Classe</strong>. Candidaturas para 7.ª classe em diante não são contempladas nesta instituição.
                      </div>
                    </div>

                    {/* Grade Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-2">
                        Classe Pretendida (Obrigatória) *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { grade: 'Iniciação', category: 'Infantil' },
                          { grade: '1.ª Classe', category: 'Primário' },
                          { grade: '2.ª Classe', category: 'Primário' },
                          { grade: '3.ª Classe', category: 'Primário' },
                          { grade: '4.ª Classe', category: 'Primário' },
                          { grade: '5.ª Classe', category: 'Primário' },
                          { grade: '6.ª Classe', category: 'Conclusão Primária' },
                        ].map((item) => {
                          const isSelected = selectedGrade === item.grade;
                          return (
                            <button
                              key={item.grade}
                              type="button"
                              onClick={() => {
                                setSelectedGrade(item.grade as GradeLevel);
                                showToast(`Classe selecionada: ${item.grade}`);
                              }}
                              className={`p-3 rounded-xl transition-all flex flex-col justify-between h-20 text-left border ${
                                isSelected
                                  ? 'bg-[#eaedff] border-[#04063f] ring-2 ring-[#04063f] text-[#04063f]'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                isSelected ? 'text-[#fd761a]' : 'text-slate-500'
                              }`}>
                                {item.category}
                              </span>
                              <span className="font-bold text-base text-[#04063f]">
                                {item.grade}
                              </span>
                            </button>
                          );
                        })}

                        {/* Disabled 7.ª Classe Block */}
                        <div className="p-3 rounded-xl bg-slate-100/70 border border-dashed border-slate-200 flex flex-col justify-center items-center text-center opacity-60 cursor-not-allowed">
                          <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                            7.ª Classe +<br />Não Disponível
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Turno & Ano Letivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-2">
                          Turno Requerido *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedShift('Manhã (07h30 - 12h15)')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedShift.startsWith('Manhã')
                                ? 'bg-[#eaedff] border-[#04063f] ring-2 ring-[#04063f]'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-bold text-sm text-[#04063f]">Manhã</div>
                            <div className="text-[11px] text-slate-500">07h30 – 12h15</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedShift('Tarde (13h00 - 17h45)')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedShift.startsWith('Tarde')
                                ? 'bg-[#eaedff] border-[#04063f] ring-2 ring-[#04063f]'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-bold text-sm text-[#04063f]">Tarde</div>
                            <div className="text-[11px] text-slate-500">13h00 – 17h45</div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-2">
                          Ano Lectivo Oficial
                        </label>
                        <input
                          type="text"
                          value={schoolYear}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[#04063f] font-bold text-sm"
                        />
                      </div>
                    </div>

                    {/* Entry Type & Origin School */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Tipo de Ingresso
                        </label>
                        <select
                          value={entryType}
                          onChange={(e) => setEntryType(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        >
                          <option value="Primeira Matrícula">Primeira Matrícula (Aluno Novo)</option>
                          <option value="Transferência de Outra Escola">Transferência de Outra Escola</option>
                          <option value="Renovação de Matrícula">Renovação de Matrícula Interna</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Escola de Proveniência
                        </label>
                        <input
                          type="text"
                          value={originSchool}
                          onChange={(e) => setOriginSchool(e.target.value)}
                          placeholder="Ex.: Colégio São José (ou Primeira Matrícula)"
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
                      >
                        <span>Dados do Encarregado</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* ETAPA 3: ENCARREGADO DE EDUCAÇÃO           */}
                {/* ========================================== */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[#fd761a] text-xs uppercase tracking-wider font-bold">
                          Etapa 03
                        </span>
                        <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                          Encarregado de Educação
                        </h2>
                        <p className="text-xs text-slate-500">
                          Pessoa legalmente responsável pela vida académica e financeira do educando.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#04063f] flex items-center justify-center shrink-0 border border-slate-200">
                        <User className="w-6 h-6 text-[#04063f]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Nome Completo do Encarregado *
                        </label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="Ex.: Dr. António Pereira Gaspar"
                          required
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Grau de Parentesco *
                        </label>
                        <select
                          value={guardianKinship}
                          onChange={(e) => setGuardianKinship(e.target.value)}
                          required
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        >
                          <option value="Pai">Pai</option>
                          <option value="Mãe">Mãe</option>
                          <option value="Tutor Legal">Tutor Legal</option>
                          <option value="Avô / Avó">Avô / Avó</option>
                          <option value="Tio(a)">Tio(a)</option>
                          <option value="Outro Responsável">Outro Responsável</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          N.º do B.I. do Encarregado *
                        </label>
                        <input
                          type="text"
                          value={guardianBI}
                          onChange={(e) => setGuardianBI(e.target.value.toUpperCase())}
                          placeholder="Ex.: 003819284KS012"
                          required
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Profissão / Actividade Profissional
                        </label>
                        <input
                          type="text"
                          value={guardianProfession}
                          onChange={(e) => setGuardianProfession(e.target.value)}
                          placeholder="Ex.: Engenheiro Agrónomo, Professor..."
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                        />
                      </div>
                    </div>

                    {/* Phones & WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          Contacto Telefónico Principal *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-500 font-semibold text-xs">
                            +244
                          </span>
                          <input
                            type="tel"
                            value={guardianPhone}
                            onChange={(e) => setGuardianPhone(e.target.value)}
                            placeholder="922 071 870"
                            required
                            className="w-full pl-14 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                          WhatsApp / Contacto de Avisos *
                        </label>
                        <div className="relative">
                          <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                          <input
                            type="tel"
                            value={guardianWhatsapp}
                            onChange={(e) => setGuardianWhatsapp(e.target.value)}
                            placeholder="937 775 839"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5">
                        Correio Electrónico (E-mail para Acesso ao Portal) *
                      </label>
                      <input
                        type="email"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        placeholder="encarregado@exemplo.ao"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 inline-block">
                        Este e-mail será utilizado para autenticação no Supabase Auth do Portal do Encarregado.
                      </span>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(4)}
                        className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
                      >
                        <span>Documentação Digital</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* ETAPA 4: DOCUMENTOS & ANEXOS               */}
                {/* ========================================== */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[#fd761a] text-xs uppercase tracking-wider font-bold">
                          Etapa 04
                        </span>
                        <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                          Documentos Digitais & Anexos
                        </h2>
                        <p className="text-xs text-slate-500">
                          Carregamento encriptado para a pasta oficial do educando no Supabase Storage.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#04063f] flex items-center justify-center shrink-0 border border-slate-200">
                        <Upload className="w-6 h-6 text-[#04063f]" />
                      </div>
                    </div>

                    {/* Doc 1 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#04063f] text-white flex items-center justify-center shrink-0">
                          <FileBadge className="w-5 h-5 text-[#fd761a]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#04063f]">
                            Cópia do BI / Assento de Nascimento *
                          </h4>
                          <p className="text-xs text-slate-500">PDF ou JPG legível frente e verso (Máx. 5MB).</p>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[220px] font-mono">{doc1Name}</span>
                          </div>
                        </div>
                      </div>

                      <label className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm text-center cursor-pointer">
                        Substituir Ficheiro
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setDoc1Name(e.target.files[0].name);
                              showToast('Ficheiro de Identificação carregado!');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Doc 2 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#04063f] text-white flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5 text-[#fd761a]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#04063f]">
                            Certificado da Classe Anterior ou Declaração *
                          </h4>
                          <p className="text-xs text-slate-500">Dispensado apenas para matrículas na Iniciação.</p>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[220px] font-mono">{doc2Name}</span>
                          </div>
                        </div>
                      </div>

                      <label className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm text-center cursor-pointer">
                        Substituir Ficheiro
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setDoc2Name(e.target.files[0].name);
                              showToast('Certificado anterior carregado!');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Doc 3 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#04063f] text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-[#fd761a]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#04063f]">
                            Atestado Médico e Cartão de Vacinas *
                          </h4>
                          <p className="text-xs text-slate-500">Comprovativo de aptidão física e vacinas actualizadas.</p>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[220px] font-mono">{doc3Name}</span>
                          </div>
                        </div>
                      </div>

                      <label className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 text-[#04063f] text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm text-center cursor-pointer">
                        Substituir Ficheiro
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setDoc3Name(e.target.files[0].name);
                              showToast('Atestado médico anexado!');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#04063f] shrink-0" />
                      <span>Os ficheiros são armazenados no Supabase Storage em bucket privado com acesso exclusivo pela Secretaria Pedagógica.</span>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(5)}
                        className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
                      >
                        <span>Revisão e Submissão</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* ETAPA 5: RESUMO, TERMO & CONFIRMAÇÃO       */}
                {/* ========================================== */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[#fd761a] text-xs uppercase tracking-wider font-bold">
                          Etapa 05
                        </span>
                        <h2 className="font-serif-headline text-2xl font-bold text-[#04063f]">
                          Resumo e Confirmação Oficial
                        </h2>
                        <p className="text-xs text-slate-500">
                          Confira atentamente os dados antes da emissão definitiva da candidatura.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#04063f] flex items-center justify-center shrink-0 border border-slate-200">
                        <FileCheck className="w-6 h-6 text-[#04063f]" />
                      </div>
                    </div>

                    {/* Official Voucher Preview Card */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={studentPhoto}
                            alt="Aluno"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-300 shadow-sm"
                          />
                          <div>
                            <span className="font-serif-headline text-base sm:text-lg font-bold text-[#04063f] block leading-tight">
                              COMPLEXO ESCOLAR PRIVADO PEREIRA
                            </span>
                            <div className="text-[11px] text-slate-500">
                              Ficha de Registo Provisório • Província do Cuanza Sul
                            </div>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
                          ESTADO: PENDENTE
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-slate-500 block uppercase text-[10px] font-bold">Candidato / Educando</span>
                          <strong className="text-[#04063f] text-sm block">{studentName || 'Manuel Gaspar'}</strong>
                          <span className="text-slate-600">Doc / B.I.: {studentDoc || '---'} ({studentAge || '7 anos'})</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 block uppercase text-[10px] font-bold">Classe e Turno Selecionados</span>
                          <strong className="text-[#fd761a] text-sm block">{selectedGrade} — {selectedShift.split(' ')[0]}</strong>
                          <span className="text-slate-600">Ano Lectivo: {schoolYear} • {entryType}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 block uppercase text-[10px] font-bold">Encarregado de Educação</span>
                          <strong className="text-[#04063f] block">{guardianName}</strong>
                          <span className="text-slate-600">Grau: {guardianKinship} • B.I.: {guardianBI}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 block uppercase text-[10px] font-bold">Comunicação e Contacto</span>
                          <span className="text-[#04063f] block font-mono font-medium">{guardianEmail}</span>
                          <span className="text-slate-600">Tel: +244 {guardianPhone} • WhatsApp activo</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-[#04063f]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>3 Documentos digitais vinculados ao dossiê civil</span>
                        </span>
                        <span className="font-semibold text-[#fd761a]">Supabase Storage RLS</span>
                      </div>
                    </div>

                    {/* Term of Responsibility */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termAccepted}
                          onChange={(e) => setTermAccepted(e.target.checked)}
                          required
                          className="mt-1 w-4 h-4 text-[#04063f] rounded focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          Declaro sob compromisso de honra que as informações aqui prestadas são verdadeiras e correspondem fielmente aos documentos oficiais do educando. Autorizo o Complexo Escolar Privado Pereira a proceder ao tratamento dos dados escolares para efeitos de matrícula e validação pedagógica.
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => goToStep(4)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSubmitApplication}
                        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#fd761a] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-md transform hover:scale-[1.01] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>A gravar na base de dados...</span>
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4" />
                            <span>Submeter Matrícula no Sistema</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* ETAPA SUCESSO: COMPROVATIVO EMITIDO       */}
                {/* ========================================== */}
                {currentStep === 6 && (
                  <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-400">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[#fd761a] text-xs uppercase tracking-widest font-bold">
                        Matrícula Registada com Sucesso
                      </span>
                      <h2 className="font-serif-headline text-3xl font-bold text-[#04063f]">
                        Candidatura Submetida ao Sistema
                      </h2>
                      <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                        A inscrição provisória foi gravada na base de dados com o estado inicial <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs">PENDENTE</span>.
                      </p>
                    </div>

                    {/* Protocol Voucher Box */}
                    <div className="max-w-md mx-auto p-5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-3">
                      <div className="text-xs text-slate-500 font-medium">Código Único de Acompanhamento:</div>
                      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-inner">
                        <span className="font-serif-headline text-2xl font-bold text-[#04063f] tracking-wider font-mono">
                          {submittedCode || 'CEPP-2024-8942'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(submittedCode || 'CEPP-2024-8942')}
                          className="text-[#fd761a] hover:text-[#ea580c] text-xs font-bold flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-orange-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Guarde este código para consultar o andamento da matrícula pelo Portal do Encarregado ou por chamada telefónica com a Secretaria Escolar.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      {latestCreatedRecord && (
                        <button
                          type="button"
                          onClick={() => onPrintVoucher(latestCreatedRecord)}
                          className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-[#04063f] text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          <Printer className="w-4 h-4 text-[#fd761a]" />
                          <span>Imprimir Ficha de Inscrição</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={onGoToPortal}
                        className="px-6 py-2.5 rounded-lg bg-[#04063f] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Aceder ao Portal do Encarregado</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                        }}
                        className="px-4 py-2.5 rounded-lg text-slate-600 text-sm font-medium hover:text-[#04063f] flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Nova Inscrição</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Clarification & Standards Bento Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <CheckCircle2 className="w-6 h-6 text-[#fd761a]" />
                  <h4 className="text-base font-bold text-[#04063f]">Validação Documental</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A secretaria analisa as cópias no prazo de 48 horas úteis para validação de vagas.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#fd761a] mt-4 uppercase tracking-wider">
                  Rigor Pedagógico
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <School className="w-6 h-6 text-[#fd761a]" />
                  <h4 className="text-base font-bold text-[#04063f]">Quadro de Excelência</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Acompanhamento contínuo dos primeiros passos da alfabetização ao 1.º ciclo.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#fd761a] mt-4 uppercase tracking-wider">
                  Iniciação à 6.ª Classe
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <ShieldCheck className="w-6 h-6 text-[#fd761a]" />
                  <h4 className="text-base font-bold text-[#04063f]">Segurança Supabase</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Transmissão com criptografia de ponta a ponta e salvaguarda de ficheiros civis.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#fd761a] mt-4 uppercase tracking-wider">
                  RLS Activado
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Encarregado Quick Panel & Live Tracker (4 Columns) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Live Status Tracker Card */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 space-y-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-slate-100 text-[#04063f] text-[10px] font-bold uppercase tracking-wider">
                  Consulta Imediata
                </span>
                <h3 className="text-lg font-bold text-[#04063f]">
                  Já possui inscrição realizada?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Insira o código de inscrição ou o e-mail do encarregado para consultar o estado atual.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#04063f]">
                  Código (ex: CEPP-2024-8942) ou E-mail
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="CEPP-2024-8942"
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#04063f] text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleQuickTrack}
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-[#04063f] text-white hover:bg-[#1b1f54] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Status Result Box */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase text-slate-500">
                    Estado Registado:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      trackResult?.found
                        ? trackResult.status === 'Aprovada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trackResult.status === 'Documentação Pendente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {trackResult ? trackResult.status : 'Pronto para pesquisa'}
                  </span>
                </div>

                <div className="text-slate-600 leading-relaxed text-[11px]">
                  {trackResult ? (
                    trackResult.message
                  ) : (
                    'Introduza o código obtido no ato de submissão para verificar aprovação, análise da secretaria ou pendências de documentos.'
                  )}
                </div>

                {trackResult?.app && (
                  <button
                    type="button"
                    onClick={() => onPrintVoucher(trackResult.app!)}
                    className="w-full mt-2 py-1.5 rounded bg-white border border-slate-300 text-[#04063f] text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#fd761a]" />
                    <span>Ver Ficha Oficial de Inscrição</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleQuickTrack}
                className="w-full py-2.5 rounded-lg bg-[#04063f] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Consultar Estado Online</span>
              </button>
            </div>

            {/* Portal do Encarregado Quick Auth Card */}
            <div className="bg-[#04063f] text-white p-5 rounded-xl shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#fd761a]/20 blur-xl pointer-events-none" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#ffdbca] text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-[#fd761a]" />
                  <span>Supabase Auth</span>
                </div>
                <h3 className="font-serif-headline text-xl text-white font-bold">
                  Portal do Encarregado
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Acompanhe o estado de aprovação da matrícula do seu educando, consulte as informações da escola e emita a ficha oficial.
                </p>
              </div>

              {/* Google 1-click login */}
              <button
                type="button"
                onClick={onGoToPortal}
                className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Começar com a Conta Google</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="flex-1 h-px bg-white/20" />
                <span className="text-[10px] uppercase font-bold text-slate-300">ou com e-mail</span>
                <span className="flex-1 h-px bg-white/20" />
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  defaultValue="antonio.gaspar@exemplo.ao"
                  placeholder="E-mail de Encarregado Registado"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 placeholder-slate-400 text-white text-xs border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#fd761a]"
                />
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  placeholder="Palavra-passe de Acesso"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 placeholder-slate-400 text-white text-xs border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#fd761a]"
                />
              </div>

              <button
                type="button"
                onClick={onGoToPortal}
                className="w-full py-2.5 rounded-lg bg-[#fd761a] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-md"
              >
                <span>Entrar na Área Reservada</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => showToast('Ligação de recuperação enviada para o e-mail!')}
                  className="text-[11px] text-[#ffdbca] hover:underline"
                >
                  Esqueceu a palavra-passe ou primeiro acesso?
                </button>
              </div>
            </div>

            {/* Direct Support Card */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 space-y-3">
              <h4 className="text-base font-bold text-[#04063f] flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#fd761a]" />
                <span>Apoio à Matrícula</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dúvidas no preenchimento ou validação de turmas? Fale diretamente com a Secretaria Escolar no Cuanza Sul:
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <a
                  href="tel:922071870"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-[#04063f] font-semibold"
                >
                  <Phone className="w-4 h-4 text-[#fd761a]" />
                  <span>+244 922 071 870 (Geral)</span>
                </a>
                <a
                  href="https://wa.me/244937775839"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-900 font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>+244 937 775 839 (WhatsApp Apoio)</span>
                </a>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Horário: Segunda a Sexta das 07h30 às 16h30</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
