import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApplicationRecord, EnrollmentPeriodConfig, PublicContentConfig } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  academicYear: string;
  autoSync: boolean;
}

const STORAGE_KEY = 'cep_supabase_config_v1';

// Read initial config from localStorage or Vite environment variables
export const getStoredSupabaseConfig = (): SupabaseConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          academicYear: parsed.academicYear || '2024 / 2025',
          autoSync: parsed.autoSync !== false
        };
      }
    }
  } catch (e) {
    console.warn('Could not read Supabase config from storage:', e);
  }

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl.trim(),
    anonKey: envKey.trim(),
    academicYear: '2024 / 2025',
    autoSync: true
  };
};

let cachedClient: SupabaseClient | null = null;
let currentConfig: SupabaseConfig = getStoredSupabaseConfig();

export const initSupabaseClient = (config: SupabaseConfig): SupabaseClient | null => {
  if (!config.url || !config.anonKey) {
    cachedClient = null;
    return null;
  }
  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    currentConfig = config;
    return cachedClient;
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    cachedClient = null;
    return null;
  }
};

// Initialize on module load if config exists
if (currentConfig.url && currentConfig.anonKey) {
  initSupabaseClient(currentConfig);
}

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!cachedClient && currentConfig.url && currentConfig.anonKey) {
    return initSupabaseClient(currentConfig);
  }
  return cachedClient;
};

export const saveSupabaseConfig = (config: SupabaseConfig): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    currentConfig = config;
    initSupabaseClient(config);
    return true;
  } catch (err) {
    console.error('Failed to save Supabase config:', err);
    return false;
  }
};

export const clearSupabaseConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    currentConfig = {
      url: '',
      anonKey: '',
      academicYear: '2024 / 2025',
      autoSync: false
    };
    cachedClient = null;
  } catch (e) {
    console.error('Error clearing config:', e);
  }
};

export const isSupabaseConnected = (): boolean => {
  return !!cachedClient;
};

// Test connection by checking public schema
export const testSupabaseConnection = async (
  configToTest?: SupabaseConfig
): Promise<{ success: boolean; message: string; details?: any }> => {
  const targetConfig = configToTest || currentConfig;
  if (!targetConfig.url || !targetConfig.anonKey) {
    return {
      success: false,
      message: 'Insira o URL do Projeto Supabase e a Chave Anon (Chave Pública).'
    };
  }

  try {
    const tempClient = createClient(targetConfig.url, targetConfig.anonKey);
    
    // Attempt to query site_content or applications
    const { data, error } = await tempClient
      .from('site_content')
      .select('id')
      .limit(1);

    if (error) {
      // If table does not exist yet, it's still a valid connection to Supabase!
      if (error.code === '42P01' || error.message.includes('relation "public.site_content" does not exist')) {
        return {
          success: true,
          message: 'Conectado ao Supabase com Sucesso! (Execute o script SQL fornecido para criar as tabelas)'
        };
      }
      return {
        success: false,
        message: `Falha na verificação: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Conexão validada com sucesso! Base de dados pronta e sincronizada.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Erro inesperado ao conectar ao Supabase.'
    };
  }
};

// -------------------------------------------------------------
// Database Operations (Applications)
// -------------------------------------------------------------

const normalizeStatusToDB = (status: string): string => {
  if (status === 'Aprovada') return 'Aprovado';
  if (status === 'Rejeitada') return 'Rejeitado';
  return status;
};

const normalizeStatusFromDB = (status?: string): ApplicationRecord['status'] => {
  if (!status) return 'Pendente';
  if (status === 'Aprovado') return 'Aprovada';
  if (status === 'Rejeitado') return 'Rejeitada';
  return status as ApplicationRecord['status'];
};

export const fetchApplicationsFromSupabase = async (): Promise<ApplicationRecord[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('applications')
      .select('*')
      .order('class_order_number', { ascending: true });

    if (error) {
      console.warn('Supabase fetch applications notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      sequenceNumber: row.class_order_number || 1,
      id: row.cep_code || row.id,
      createdAt: row.submission_date || row.created_at || new Date().toISOString(),
      student: {
        name: row.student_full_name,
        birthDate: row.student_birth_date || '',
        age: row.student_age || '',
        gender: row.student_gender === 'F' ? 'Feminino' : 'Masculino',
        documentNumber: row.id_card_number || '',
        birthPlace: row.birth_place || 'Cuanza Sul',
        address: row.student_address || 'Sumbe',
        avatarUrl: row.student_photo_url || ''
      },
      academic: {
        grade: row.class_name,
        shift: row.preferred_shift === 'Tarde' ? 'Tarde (13h00 - 17h45)' : 'Manhã (07h30 - 12h15)',
        schoolYear: row.academic_year || currentConfig.academicYear,
        entryType: row.entry_type || 'Matrícula Nova'
      },
      guardian: {
        name: row.guardian_name,
        kinship: row.guardian_relationship || 'Pai/Mãe',
        documentNumber: row.guardian_id_doc || '',
        profession: row.guardian_profession || '',
        phone: row.guardian_phone,
        whatsapp: row.guardian_whatsapp || row.guardian_phone,
        email: row.guardian_email || ''
      },
      documents: {
        identityDoc: true,
        certificateDoc: true,
        medicalDoc: true
      },
      status: normalizeStatusFromDB(row.status),
      statusNotes: row.rejection_reason || ''
    }));
  } catch (e) {
    console.error('Error fetching applications from Supabase:', e);
    return null;
  }
};

export const saveApplicationToSupabase = async (app: ApplicationRecord): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      cep_code: app.id,
      class_name: app.academic.grade,
      class_order_number: app.sequenceNumber,
      student_full_name: app.student.name,
      student_birth_date: app.student.birthDate || '2016-01-01',
      student_gender: app.student.gender === 'Feminino' ? 'F' : 'M',
      student_photo_url: app.student.avatarUrl || null,
      guardian_name: app.guardian.name,
      guardian_phone: app.guardian.phone,
      guardian_email: app.guardian.email || null,
      guardian_relationship: app.guardian.kinship || 'Encarregado',
      preferred_shift: app.academic.shift.includes('Tarde') ? 'Tarde' : 'Manhã',
      status: normalizeStatusToDB(app.status),
      submission_date: app.createdAt
    };

    const { error } = await client
      .from('applications')
      .upsert(payload, { onConflict: 'cep_code' });

    if (error) {
      console.error('Failed to save application to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving application to Supabase:', e);
    return false;
  }
};

export const updateApplicationStatusInSupabase = async (
  cepCode: string,
  newStatus: string,
  reason?: string
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('applications')
      .update({
        status: normalizeStatusToDB(newStatus),
        rejection_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('cep_code', cepCode);

    return !error;
  } catch (e) {
    console.error('Error updating status in Supabase:', e);
    return false;
  }
};

export const deleteApplicationFromSupabase = async (cepCode: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('applications')
      .delete()
      .eq('cep_code', cepCode);

    return !error;
  } catch (e) {
    console.error('Error deleting application in Supabase:', e);
    return false;
  }
};
