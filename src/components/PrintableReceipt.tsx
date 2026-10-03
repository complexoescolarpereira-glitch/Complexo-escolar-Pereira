import React from 'react';
import { ApplicationRecord } from '../types';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';

interface PrintableReceiptProps {
  application: ApplicationRecord;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ application, onClose }) => {
  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error('Print error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95 relative printable-area">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#04063f]">Visualizador de Impressão Oficial</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-xs font-mono">
              {application.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-[#fd761a]" />
              <span>Imprimir Documento</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Area */}
        <div className="p-6 border-2 border-slate-300 rounded-lg text-slate-900 space-y-6 bg-white font-serif-headline">
          {/* Official Letterhead */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600">
              República de Angola • Província do Cuanza Sul
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#04063f] uppercase">
              COMPLEXO ESCOLAR PRIVADO PEREIRA
            </h1>
            <div className="text-xs font-sans text-slate-600">
              Ensino Primário e I.º Ciclo • Alvará M.E.D. Cuanza Sul
            </div>
            <div className="italic text-xs font-serif-headline text-[#fd761a] pt-1">
              “Surgimos para formar quadros de excelência”
            </div>
          </div>

          {/* Title and Protocol Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 font-sans">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#fd761a] block">
                Comprovativo Oficial de Matrícula Provisória
              </span>
              <h2 className="text-lg font-bold text-[#04063f]">
                Ano Lectivo 2024 / 2025
              </h2>
              <span className="text-xs text-slate-500">Registo de Entrada no Portal Virtual</span>
            </div>

            <div className="text-right flex items-center gap-4">
              <div className="border-2 border-slate-900 px-3 py-1.5 rounded text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">N.º de Protocolo</span>
                <span className="font-mono text-base font-bold text-[#04063f]">{application.id}</span>
              </div>
              <div className="px-3 py-2 rounded bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs uppercase">
                {application.status}
              </div>
            </div>
          </div>

          {/* Section 1: Candidate Identification */}
          <div className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#04063f] uppercase tracking-wide">
                1. Identificação do Aluno / Educando
              </h3>
              <span className="text-xs text-slate-400 font-mono">Dossiê Civil</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img
                src={application.student.avatarUrl || '/src/assets/images/cep_student_portrait_1790861275389.jpg'}
                alt={application.student.name}
                className="w-24 h-28 object-cover rounded border border-slate-400 shadow-sm shrink-0"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Nome Completo:</span>
                  <strong className="text-sm text-slate-900">{application.student.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">N.º do B.I. ou Assento:</span>
                  <strong className="font-mono text-slate-900">{application.student.documentNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Data de Nascimento / Idade:</span>
                  <span>{application.student.birthDate} ({application.student.age})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Naturalidade / Município:</span>
                  <span>{application.student.birthPlace}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Endereço Residencial:</span>
                  <span>{application.student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-bold text-sm text-[#04063f] uppercase tracking-wide">
                2. Enquadramento Escolar & Turno
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Classe Pretendida:</span>
                <strong className="text-sm text-[#fd761a]">{application.academic.grade}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Turno:</span>
                <strong>{application.academic.shift.split(' ')[0]}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Tipo de Ingresso:</span>
                <span>{application.academic.entryType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Escola Anterior:</span>
                <span className="truncate block">{application.academic.originSchool || 'Primeira Matrícula'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Guardian */}
          <div className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-bold text-sm text-[#04063f] uppercase tracking-wide">
                3. Dados do Encarregado de Educação
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nome do Encarregado:</span>
                <strong>{application.guardian.name}</strong> ({application.guardian.kinship})
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">N.º do B.I.:</span>
                <span className="font-mono">{application.guardian.documentNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Telefone / WhatsApp:</span>
                <span className="font-mono">{application.guardian.phone}</span>
              </div>
            </div>
          </div>

          {/* Institutional Stamp & Signatures */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center font-sans text-xs">
            <div className="space-y-4">
              <div className="h-14 flex items-end justify-center">
                <span className="border-b border-slate-600 w-4/5 inline-block" />
              </div>
              <div>
                <strong>O(A) Encarregado(a) de Educação</strong>
                <div className="text-[10px] text-slate-500">Assinatura de compromisso</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-14 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#04063f]/50 flex items-center justify-center text-[9px] uppercase font-bold text-[#04063f] text-center p-1 leading-tight transform -rotate-12">
                  CEP PEREIRA<br />SECRETARIA<br />CUANZA SUL
                </div>
              </div>
              <div>
                <strong>A Secretaria Pedagógica</strong>
                <div className="text-[10px] text-slate-500">Conferência e Carimbo Oficial</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 font-sans pt-4 border-t border-slate-200">
            Documento gerado pelo Portal de Matrícula Virtual do Complexo Escolar Privado Pereira • Emitido em {application.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};
