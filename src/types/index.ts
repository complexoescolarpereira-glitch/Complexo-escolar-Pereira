export type GradeLevel = 
  | 'Iniciação'
  | '1.ª Classe'
  | '2.ª Classe'
  | '3.ª Classe'
  | '4.ª Classe'
  | '5.ª Classe'
  | '6.ª Classe';

export type Shift = 'Manhã (07h30 - 12h15)' | 'Tarde (13h00 - 17h45)';

export type ApplicationStatus = 
  | 'Pendente' 
  | 'Em Análise' 
  | 'Aprovada' 
  | 'Documentação Pendente' 
  | 'Rejeitada';

export interface ApplicationRecord {
  sequenceNumber: number; // 1, 2, 3...
  id: string; // e.g. CEPP-2024-8942
  createdAt: string;
  student: {
    name: string;
    birthDate: string;
    age: string;
    gender: 'Masculino' | 'Feminino' | '';
    documentNumber: string;
    birthPlace: string;
    address: string;
    avatarUrl?: string;
  };
  academic: {
    grade: GradeLevel;
    shift: Shift;
    schoolYear: string;
    entryType: string;
    originSchool?: string;
  };
  guardian: {
    name: string;
    kinship: string;
    documentNumber: string;
    profession: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  documents: {
    identityDoc: boolean;
    identityFileName?: string;
    certificateDoc: boolean;
    certificateFileName?: string;
    medicalDoc: boolean;
    medicalFileName?: string;
  };
  status: ApplicationStatus;
  statusNotes?: string;
  assignedClassRoom?: string;
}

export interface EnrollmentPeriodConfig {
  isOpen: boolean;
  schoolYear: string;
  startDate: string;
  endDate: string;
  closedMessage: string;
}

export interface GuardianRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  enrolledStudentsCount: number;
  studentsList: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador Principal' | 'Secretaria Pedagógica' | 'Gestor de Matrículas';
  createdAt: string;
  isActive: boolean;
}

export interface DirectorProfile {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
}

export interface HighlightArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  category: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface PublicContentConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroNotice: string;
  heroImage: string;
  motto: string;
  aboutTitle: string;
  aboutDescription: string;
  mission: string;
  vision: string;
  stats: {
    activeStudents: number;
    graduatedStudents: number;
    yearsOfExistence: number;
    teachersCount: number;
    staffCount: number;
  };
  directors: DirectorProfile[];
  highlights: HighlightArticle[];
  gallery: GalleryPhoto[];
}
