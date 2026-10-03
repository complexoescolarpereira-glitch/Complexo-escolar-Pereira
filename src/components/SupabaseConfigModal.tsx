import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Globe, 
  Key, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Laptop
} from 'lucide-react';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  clearSupabaseConfig,
  SupabaseConfig 
} from '../services/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: SupabaseConfig) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [academicYear, setAcademicYear] = useState('2024 / 2025');
  const [autoSync, setAutoSync] = useState(true);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setAcademicYear(cfg.academicYear || '2024 / 2025');
      setAutoSync(cfg.autoSync !== false);
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection({
        url: url.trim(),
        anonKey: anonKey.trim(),
        academicYear,
        autoSync
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Erro ao tentar conectar ao Supabase.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const newConfig: SupabaseConfig = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      academicYear: academicYear.trim(),
      autoSync
    };
    saveSupabaseConfig(newConfig);
    onConfigSaved(newConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigSaved({
      url: '',
      anonKey: '',
      academicYear,
      autoSync: false
    });
  };

  const sqlQuickScript = `-- SCRIPT COMPLETO DE TABELAS SUPABASE:
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollment_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year TEXT NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    official_notice TEXT
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cep_code TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL,
    class_order_number INTEGER NOT NULL,
    student_full_name TEXT NOT NULL,
    student_birth_date DATE NOT NULL,
    student_gender TEXT NOT NULL,
    guardian_name TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    guardian_email TEXT,
    preferred_shift TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    rejection_reason TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'current_config',
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT,
    hero_notice TEXT,
    motto TEXT,
    about_title TEXT,
    about_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlQuickScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-[#04063f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fd761a]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Conexão Supabase Multi-Dispositivo
              </h2>
              <p className="text-xs text-slate-300">
                Ligue a plataforma para sincronizar em computadores, tablets e telemóveis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Sincronização em Tempo Real</strong>
              Ao colar aqui o seu **Project URL** e a chave pública **Anon Key** do Supabase, 
              as matrículas e alterações feitas no <em>Dispositivo A</em> (ex: computador da secretaria) 
              aparecerão instantaneamente no <em>Dispositivo B</em> (ex: telemóvel do diretor ou encarregado).
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#fd761a]" />
                  Project URL do Supabase *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Project Settings &gt; API &gt; Project URL
                </span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo-id.supabase.co"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#fd761a]/30 focus:border-[#fd761a] transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Supabase Anon Key */}
            <div>
              <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#fd761a]" />
                  Chave Anon / Chave Pública (Anon Key) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Project Settings &gt; API &gt; Project API keys (anon, public)
                </span>
              </label>
              <textarea
                rows={2}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#fd761a]/30 focus:border-[#fd761a] transition-all bg-slate-50 focus:bg-white resize-none"
              />
            </div>

            {/* Academic Year Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#fd761a]" />
                  Ano Lectivo Oficial *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#fd761a]/30 focus:border-[#fd761a] transition-all bg-white"
                >
                  <option value="2024 / 2025">2024 / 2025 (Ano Corrente)</option>
                  <option value="2025 / 2026">2025 / 2026 (Próximo Ano)</option>
                  <option value="2026 / 2027">2026 / 2027</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#04063f] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#fd761a]" />
                  Sincronização em Nuvem
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 text-[#fd761a] rounded focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Actualizar dados automaticamente entre dispositivos
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in duration-200 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <strong className="block font-bold">
                  {testResult.success ? 'Conexão Supabase Estabelecida!' : 'Erro na Verificação'}
                </strong>
                <p className="leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Save Success Banner */}
          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configuração guardada com sucesso! Conectando...</span>
            </div>
          )}

          {/* SQL Assistant Accordion */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#04063f] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#fd761a]" />
                Script SQL para criar as tabelas no Supabase
              </span>
              <button
                type="button"
                onClick={copySql}
                className="px-3 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Se ainda não criou as tabelas no Supabase, clique em <strong>Copiar SQL</strong>, abra o <strong>SQL Editor</strong> no Supabase e clique em <strong>Run</strong>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {url && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
              >
                Desconectar / Limpar Dados
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !url || !anonKey}
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'A testar...' : 'Testar Conexão'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!url || !anonKey}
              className="px-5 py-2.5 rounded-lg bg-[#04063f] hover:bg-[#191d57] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#fd761a]" />
              <span>Guardar & Conectar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
