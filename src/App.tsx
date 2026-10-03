/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PublicArea } from './components/PublicArea';
import { AdminPanel } from './components/AdminPanel';
import { PortalEncarregadoView } from './components/PortalEncarregadoView';
import { PrintableReceipt } from './components/PrintableReceipt';
import { PrintableQRCode } from './components/PrintableQRCode';
import { Footer } from './components/Footer';
import { 
  DEFAULT_ENROLLMENT_PERIOD, 
  INITIAL_APPLICATIONS, 
  INITIAL_GUARDIANS, 
  INITIAL_ADMINS, 
  INITIAL_PUBLIC_CONTENT 
} from './data/mockData';
import { 
  ApplicationRecord, 
  EnrollmentPeriodConfig, 
  GuardianRecord, 
  AdminUser, 
  PublicContentConfig 
} from './types';
import { 
  isSupabaseConnected, 
  fetchApplicationsFromSupabase, 
  saveApplicationToSupabase, 
  updateApplicationStatusInSupabase, 
  deleteApplicationFromSupabase, 
  SupabaseConfig 
} from './services/supabaseClient';
import { ShieldCheck, Globe, Lock, Eye } from 'lucide-react';

export default function App() {
  // Main Area Switcher: 'publicitaria' vs 'administrativa' vs 'portal_encarregado'
  const [currentArea, setCurrentArea] = useState<'publicitaria' | 'administrativa' | 'portal_encarregado'>('publicitaria');

  // School Enrollment Period State
  const [enrollmentPeriod, setEnrollmentPeriod] = useState<EnrollmentPeriodConfig>(() => {
    const saved = localStorage.getItem('cep_period');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_ENROLLMENT_PERIOD; }
    }
    return DEFAULT_ENROLLMENT_PERIOD;
  });

  // Applications List State (Numbered Sequentially 1, 2, 3...)
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('cep_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_APPLICATIONS; }
    }
    return INITIAL_APPLICATIONS;
  });

  // Guardians State
  const [guardians, setGuardians] = useState<GuardianRecord[]>(() => {
    const saved = localStorage.getItem('cep_guardians');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_GUARDIANS; }
    }
    return INITIAL_GUARDIANS;
  });

  // Administrators State
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('cep_admins');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ADMINS; }
    }
    return INITIAL_ADMINS;
  });

  // Public Website CMS Content State
  const [publicContent, setPublicContent] = useState<PublicContentConfig>(() => {
    const saved = localStorage.getItem('cep_content');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PUBLIC_CONTENT; }
    }
    return INITIAL_PUBLIC_CONTENT;
  });

  // Modal States
  const [printableApp, setPrintableApp] = useState<ApplicationRecord | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState<boolean>(false);

  // Active student for parent portal
  const [activeStudentApp, setActiveStudentApp] = useState<ApplicationRecord>(applications[0] || INITIAL_APPLICATIONS[0]);

  // Logged-in Guardian User (Google or email)
  const [loggedGuardianUser, setLoggedGuardianUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('cep_logged_guardian');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const handleGoToPortal = (email?: string, name?: string) => {
    const finalEmail = email || loggedGuardianUser?.email || 'complexoescolarpereira@gmail.com';
    const finalName = name || loggedGuardianUser?.name || 'Encarregado Google (Pereira)';
    const userObj = { name: finalName, email: finalEmail };
    setLoggedGuardianUser(userObj);
    try { localStorage.setItem('cep_logged_guardian', JSON.stringify(userObj)); } catch (e) {}

    // Find matching application for this guardian or fallback to first
    const matchingApp = applications.find(
      (a) => a.guardian.email.toLowerCase() === finalEmail.toLowerCase()
    );
    if (matchingApp) {
      setActiveStudentApp(matchingApp);
    } else if (applications.length > 0) {
      setActiveStudentApp(applications[0]);
    }

    setCurrentArea('portal_encarregado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial sync from Supabase if connected
  useEffect(() => {
    const syncFromSupabase = async () => {
      if (isSupabaseConnected()) {
        try {
          const remoteApps = await fetchApplicationsFromSupabase();
          if (remoteApps && remoteApps.length > 0) {
            setApplications(remoteApps);
            try { localStorage.setItem('cep_applications', JSON.stringify(remoteApps)); } catch (e) {}
          }
        } catch (err) {
          console.warn('Initial Supabase sync check:', err);
        }
      }
    };
    syncFromSupabase();
  }, []);

  // Handlers
  const handleUpdatePeriod = (config: EnrollmentPeriodConfig) => {
    setEnrollmentPeriod(config);
    try { localStorage.setItem('cep_period', JSON.stringify(config)); } catch (e) {}
  };

  const handleApplicationCreated = (newApp: ApplicationRecord) => {
    const nextSeqNumber = applications.length + 1;
    const finalApp: ApplicationRecord = {
      ...newApp,
      sequenceNumber: nextSeqNumber
    };

    const updatedApps = [finalApp, ...applications];
    setApplications(updatedApps);
    setActiveStudentApp(finalApp);
    try { localStorage.setItem('cep_applications', JSON.stringify(updatedApps)); } catch (e) {}

    // Also sync to Supabase if connected
    if (isSupabaseConnected()) {
      saveApplicationToSupabase(finalApp).catch((e) => console.warn('Supabase save error:', e));
    }

    // Update or add guardian
    const existingGuardian = guardians.find((g) => g.email.toLowerCase() === newApp.guardian.email.toLowerCase());
    if (existingGuardian) {
      const updatedGuardians = guardians.map((g) => {
        if (g.id === existingGuardian.id) {
          return {
            ...g,
            enrolledStudentsCount: g.enrolledStudentsCount + 1,
            studentsList: [...g.studentsList, `${newApp.student.name} (${newApp.academic.grade})`]
          };
        }
        return g;
      });
      setGuardians(updatedGuardians);
      try { localStorage.setItem('cep_guardians', JSON.stringify(updatedGuardians)); } catch (e) {}
    } else {
      const newG: GuardianRecord = {
        id: 'G-' + (guardians.length + 101),
        name: newApp.guardian.name,
        email: newApp.guardian.email,
        phone: newApp.guardian.phone,
        registeredAt: new Date().toISOString().substring(0, 10),
        enrolledStudentsCount: 1,
        studentsList: [`${newApp.student.name} (${newApp.academic.grade})`]
      };
      const updatedGuardians = [...guardians, newG];
      setGuardians(updatedGuardians);
      try { localStorage.setItem('cep_guardians', JSON.stringify(updatedGuardians)); } catch (e) {}
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationRecord['status'], note?: string) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status: newStatus,
          statusNotes: note || app.statusNotes
        };
      }
      return app;
    });
    setApplications(updated);
    try { localStorage.setItem('cep_applications', JSON.stringify(updated)); } catch (e) {}

    if (isSupabaseConnected()) {
      updateApplicationStatusInSupabase(id, newStatus, note).catch((e) => console.warn('Supabase update status error:', e));
    }
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications
      .filter((app) => app.id !== id)
      .map((app, index) => ({
        ...app,
        sequenceNumber: index + 1 // Re-index sequentially from 1
      }));
    setApplications(updated);
    try { localStorage.setItem('cep_applications', JSON.stringify(updated)); } catch (e) {}

    if (isSupabaseConnected()) {
      deleteApplicationFromSupabase(id).catch((e) => console.warn('Supabase delete error:', e));
    }
  };

  const handleSupabaseConfigSaved = async (newConfig: SupabaseConfig) => {
    if (newConfig.academicYear && newConfig.academicYear !== enrollmentPeriod.schoolYear) {
      const updatedPeriod = { ...enrollmentPeriod, schoolYear: newConfig.academicYear };
      setEnrollmentPeriod(updatedPeriod);
      try { localStorage.setItem('cep_period', JSON.stringify(updatedPeriod)); } catch (e) {}
    }
    if (newConfig.url && newConfig.anonKey) {
      try {
        const remoteApps = await fetchApplicationsFromSupabase();
        if (remoteApps && remoteApps.length > 0) {
          setApplications(remoteApps);
          try { localStorage.setItem('cep_applications', JSON.stringify(remoteApps)); } catch (e) {}
        }
      } catch (e) {
        console.warn('Supabase initial fetch after config:', e);
      }
    }
  };

  const handleAddAdmin = (newAdmin: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const adminObj: AdminUser = {
      ...newAdmin,
      id: 'adm-' + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10)
    };
    const updated = [...admins, adminObj];
    setAdmins(updated);
    try { localStorage.setItem('cep_admins', JSON.stringify(updated)); } catch (e) {}
  };

  const handleDeleteAdmin = (id: string) => {
    const updated = admins.filter((a) => a.id !== id);
    setAdmins(updated);
    try { localStorage.setItem('cep_admins', JSON.stringify(updated)); } catch (e) {}
  };

  const handleSaveContent = (newContent: PublicContentConfig) => {
    setPublicContent(newContent);
    try { localStorage.setItem('cep_content', JSON.stringify(newContent)); } catch (e) {}
  };

  const handleTrackApplication = (code: string) => {
    const found = applications.find((a) => a.id.toLowerCase() === code.toLowerCase());
    if (found) {
      setPrintableApp(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#ffdbca] selection:text-[#341100]">
      {/* Floating Environment Bar to easily identify and switch between Área Administrativa and Área Publicitária */}
      <aside aria-label="Controle de Áreas" className="sticky top-0 z-50 bg-[#04063f] text-white px-4 py-2 border-b border-indigo-900 shadow-md flex items-center justify-between no-print text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium hidden sm:inline">Ambiente Atual:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${
            currentArea === 'administrativa'
              ? 'bg-[#fd761a] text-white shadow-sm'
              : currentArea === 'portal_encarregado'
              ? 'bg-blue-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            {currentArea === 'administrativa'
              ? 'Área Administrativa (Backoffice)'
              : currentArea === 'portal_encarregado'
              ? 'Portal do Encarregado (Matrículas)'
              : 'Área Publicitária (Site Público)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentArea !== 'publicitaria' && (
            <button
              onClick={() => {
                setCurrentArea('publicitaria');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[#ffdbca] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ir para Área Publicitária</span>
            </button>
          )}

          {currentArea !== 'administrativa' && (
            <button
              onClick={() => {
                setCurrentArea('administrativa');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-md bg-[#fd761a] hover:bg-[#ea580c] text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aceder ao Painel Administrativo</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Area View Routing */}
      <main className="flex-1 w-full">
        {currentArea === 'publicitaria' && (
          <PublicArea
            enrollmentPeriod={enrollmentPeriod}
            publicContent={publicContent}
            applications={applications}
            onApplicationCreated={handleApplicationCreated}
            onTrackApplication={handleTrackApplication}
            onGoToPortal={handleGoToPortal}
            onGoToAdmin={() => {
              setCurrentArea('administrativa');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrintVoucher={(app) => setPrintableApp(app)}
            onOpenQRCodePoster={() => setShowQRCodeModal(true)}
          />
        )}

        {currentArea === 'administrativa' && (
          <AdminPanel
            applications={applications}
            enrollmentPeriod={enrollmentPeriod}
            guardians={guardians}
            admins={admins}
            publicContent={publicContent}
            onUpdatePeriod={handleUpdatePeriod}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
            onAddAdmin={handleAddAdmin}
            onDeleteAdmin={handleDeleteAdmin}
            onSaveContent={handleSaveContent}
            onPrintVoucher={(app) => setPrintableApp(app)}
            onOpenQRCodePoster={() => setShowQRCodeModal(true)}
            onViewPublicSite={() => {
              setCurrentArea('publicitaria');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSupabaseConfigSaved={handleSupabaseConfigSaved}
          />
        )}

        {currentArea === 'portal_encarregado' && (
          <PortalEncarregadoView
            currentApp={activeStudentApp}
            guardianApps={applications.filter((a) => {
              if (!loggedGuardianUser) return true;
              return a.guardian.email.toLowerCase() === loggedGuardianUser.email.toLowerCase() ||
                     loggedGuardianUser.email === 'complexoescolarpereira@gmail.com';
            })}
            guardianUser={loggedGuardianUser || { name: activeStudentApp?.guardian.name || 'Encarregado Pereira', email: 'complexoescolarpereira@gmail.com' }}
            onSelectApp={(app) => setActiveStudentApp(app)}
            onLogout={() => {
              setLoggedGuardianUser(null);
              try { localStorage.removeItem('cep_logged_guardian'); } catch (e) {}
              setCurrentArea('publicitaria');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToWizard={() => {
              setCurrentArea('publicitaria');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrintVoucher={(app) => setPrintableApp(app)}
          />
        )}
      </main>

      {/* Printable Receipt Modal */}
      {printableApp && (
        <PrintableReceipt
          application={printableApp}
          onClose={() => setPrintableApp(null)}
        />
      )}

      {/* Printable QR Code Poster Modal */}
      {showQRCodeModal && (
        <PrintableQRCode
          portalUrl={window.location.origin}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}

      {/* Footer (Available on Public View) */}
      {currentArea === 'publicitaria' && (
        <Footer
          onNavigate={(view) => {
            if (view === 'portal-do-encarregado') {
              setCurrentArea('portal_encarregado');
            } else if (view === 'admin') {
              setCurrentArea('administrativa');
            } else {
              const el = document.getElementById(view);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        />
      )}
    </div>
  );
}
