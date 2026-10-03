import { 
  ApplicationRecord, 
  EnrollmentPeriodConfig, 
  GuardianRecord, 
  AdminUser, 
  PublicContentConfig 
} from '../types';

export const DEFAULT_ENROLLMENT_PERIOD: EnrollmentPeriodConfig = {
  isOpen: true,
  schoolYear: '2024 / 2025',
  startDate: '15 de Julho de 2024',
  endDate: '30 de Setembro de 2024',
  closedMessage: 'As inscrições e matrículas para o ano letivo corrente encontram-se oficialmente encerradas pela Direcção Pedagógica do CEP Pereira.'
};

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    sequenceNumber: 1,
    id: 'CEPP-2024-8942',
    createdAt: '2024-07-20 09:30',
    student: {
      name: 'Manuel Domingos Pereira Gaspar',
      birthDate: '2017-04-12',
      age: '7 anos',
      gender: 'Masculino',
      documentNumber: '007421890KS043',
      birthPlace: 'Sumbe, Cuanza Sul',
      address: 'Bairro Chingo, Rua da Liberdade, Casa N.º 42',
      avatarUrl: '/src/assets/images/cep_student_portrait_1790861275389.jpg'
    },
    academic: {
      grade: '1.ª Classe',
      shift: 'Manhã (07h30 - 12h15)',
      schoolYear: '2024 / 2025',
      entryType: 'Primeira Matrícula',
      originSchool: 'Complexo Escolar Privado Pereira (Iniciação)'
    },
    guardian: {
      name: 'Dr. António Pereira Gaspar',
      kinship: 'Pai',
      documentNumber: '003819284KS012',
      profession: 'Engenheiro Agrónomo',
      phone: '+244 922 071 870',
      whatsapp: '+244 937 775 839',
      email: 'antonio.gaspar@exemplo.ao'
    },
    documents: {
      identityDoc: true,
      identityFileName: 'Cedula_Manuel_Gaspar.pdf',
      certificateDoc: true,
      certificateFileName: 'Declaracao_Iniciacao_CEP.pdf',
      medicalDoc: true,
      medicalFileName: 'Atestado_Medico_2024.pdf'
    },
    status: 'Pendente',
    statusNotes: 'Documentos recebidos digitalmente. Em fila para validação física pela secretaria.',
    assignedClassRoom: 'Aguardando atribuição de Turma'
  },
  {
    sequenceNumber: 2,
    id: 'CEPP-2024-5120',
    createdAt: '2024-07-18 14:15',
    student: {
      name: 'Maria Luísa Chingando Bento',
      birthDate: '2016-09-05',
      age: '8 anos',
      gender: 'Feminino',
      documentNumber: '008912340KS055',
      birthPlace: 'Porto Amboim, Cuanza Sul',
      address: 'Bairro Aeroporto, Sumbe',
      avatarUrl: '/src/assets/images/cep_student_portrait_1790861275389.jpg'
    },
    academic: {
      grade: '2.ª Classe',
      shift: 'Manhã (07h30 - 12h15)',
      schoolYear: '2024 / 2025',
      entryType: 'Renovação de Matrícula',
      originSchool: 'CEP Pereira'
    },
    guardian: {
      name: 'Eng.ª Teresa Chingando',
      kinship: 'Mãe',
      documentNumber: '004123987KS091',
      profession: 'Bióloga Marinha',
      phone: '+244 924 112 334',
      whatsapp: '+244 924 112 334',
      email: 'teresa.bento@exemplo.ao'
    },
    documents: {
      identityDoc: true,
      identityFileName: 'BI_Maria_Luisa.pdf',
      certificateDoc: true,
      certificateFileName: 'Pauta_1aClasse_Final.pdf',
      medicalDoc: true,
      medicalFileName: 'Cartao_Vacinas_Actualizado.pdf'
    },
    status: 'Aprovada',
    statusNotes: 'Vaga homologada pela Direcção Pedagógica. Turma A confirmada.',
    assignedClassRoom: '2.ª Classe - Turma A (Sala 06)'
  },
  {
    sequenceNumber: 3,
    id: 'CEPP-2024-3401',
    createdAt: '2024-07-22 11:00',
    student: {
      name: 'João Baptista Ndalu',
      birthDate: '2018-02-14',
      age: '6 anos',
      gender: 'Masculino',
      documentNumber: '009844211KS082',
      birthPlace: 'Sumbe, Cuanza Sul',
      address: 'Zona Comercial, Sumbe',
    },
    academic: {
      grade: 'Iniciação',
      shift: 'Manhã (07h30 - 12h15)',
      schoolYear: '2024 / 2025',
      entryType: 'Primeira Matrícula',
      originSchool: 'Creche Arco-Íris'
    },
    guardian: {
      name: 'Mateus Ndalu',
      kinship: 'Pai',
      documentNumber: '002998412KS044',
      profession: 'Comerciante',
      phone: '+244 912 345 678',
      whatsapp: '+244 912 345 678',
      email: 'mateus.ndalu@exemplo.ao'
    },
    documents: {
      identityDoc: true,
      identityFileName: 'Assento_Nascimento_Ndalu.pdf',
      certificateDoc: false,
      medicalDoc: true,
      medicalFileName: 'Atestado_Medico_Hospital_Sumbe.pdf'
    },
    status: 'Documentação Pendente',
    statusNotes: 'Falta entrega do cartão de vacinação com a dose tríplice comprovada.',
    assignedClassRoom: 'Iniciação - Pré-reserva'
  }
];

export const INITIAL_GUARDIANS: GuardianRecord[] = [
  {
    id: 'G-101',
    name: 'Dr. António Pereira Gaspar',
    email: 'antonio.gaspar@exemplo.ao',
    phone: '+244 922 071 870',
    registeredAt: '2024-07-20',
    enrolledStudentsCount: 1,
    studentsList: ['Manuel Domingos Pereira Gaspar (1.ª Classe)']
  },
  {
    id: 'G-102',
    name: 'Eng.ª Teresa Chingando',
    email: 'teresa.bento@exemplo.ao',
    phone: '+244 924 112 334',
    registeredAt: '2024-07-18',
    enrolledStudentsCount: 1,
    studentsList: ['Maria Luísa Chingando Bento (2.ª Classe)']
  },
  {
    id: 'G-103',
    name: 'Mateus Ndalu',
    email: 'mateus.ndalu@exemplo.ao',
    phone: '+244 912 345 678',
    registeredAt: '2024-07-22',
    enrolledStudentsCount: 1,
    studentsList: ['João Baptista Ndalu (Iniciação)']
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm-01',
    name: 'Direcção Geral (Admin Principal)',
    email: 'complexoescolarpereira@gmail.com',
    role: 'Administrador Principal',
    createdAt: '2024-01-10',
    isActive: true
  },
  {
    id: 'adm-02',
    name: 'Secretaria Pedagógica Sumbe',
    email: 'secretaria@escola-pereira.ao',
    role: 'Secretaria Pedagógica',
    createdAt: '2024-02-15',
    isActive: true
  }
];

export const INITIAL_PUBLIC_CONTENT: PublicContentConfig = {
  heroTitle: 'Complexo Escolar Privado Pereira',
  heroSubtitle: 'Instituição de referência vocacionada ao Ensino Primário integral (Iniciação à 6.ª Classe) na província do Cuanza Sul. Turmas estruturadas com rigor pedagógico e foco na consolidação da leitura, escrita, cálculo e formação cívica.',
  heroNotice: 'Ano Lectivo 2024 / 2025 • Inscrições Oficiais da Iniciação à 6.ª Classe',
  heroImage: '/src/assets/images/cep_school_campus_1790861289408.jpg',
  motto: '“Surgimos para formar quadros de excelência, dotando a nova geração angolana de rigor e consciência moral.”',
  aboutTitle: 'Sobre o Complexo Escolar Privado Pereira',
  aboutDescription: 'Fundado com a nobre missão de elevar a qualidade do Ensino Primário no Cuanza Sul, o CEP Pereira conjuga uma infraestrutura moderna e segura a um corpo docente rigorosamente qualificado. Cumprimos estritamente o limite pedagógico de 25 alunos por turma, garantindo um acompanhamento próximo e afectuoso de cada criança.',
  stats: {
    activeStudents: 385,
    graduatedStudents: 1420,
    yearsOfExistence: 12,
    teachersCount: 26,
    staffCount: 15
  },
  mission: 'Proporcionar uma formação escolar primária integral, que alia solidez científica, disciplina cívica e respeito aos valores da pátria angolana.',
  vision: 'Ser a instituição de referência no Ensino Primário da província do Cuanza Sul e modelo nacional de qualidade pedagógica e formação moral.',
  directors: [
    {
      id: 'dir-1',
      name: 'Dr. Pereira Gaspar',
      role: 'Director Geral da Instituição',
      photoUrl: '/src/assets/images/cep_student_portrait_1790861275389.jpg',
      bio: 'Mestre em Ciências da Educação com mais de 20 anos de docência e gestão escolar na província do Cuanza Sul.'
    },
    {
      id: 'dir-2',
      name: 'Prof.ª Domingas Quaresma',
      role: 'Subdirectora Pedagógica',
      photoUrl: '/src/assets/images/cep_classroom_learning_1790861301453.jpg',
      bio: 'Especialista em Metodologia de Alfabetização do 1.º Ciclo e coordenação curricular primária.'
    },
    {
      id: 'dir-3',
      name: 'Dr. Faustino Candimba',
      role: 'Subdirector Administrativo & Financeiro',
      photoUrl: '/src/assets/images/cep_school_campus_1790861289408.jpg',
      bio: 'Responsável pela infraestrutura, recursos humanos, apoio aos encarregados e segurança institucional.'
    }
  ],
  highlights: [
    {
      id: 'hl-1',
      title: 'Abertura Solene do Ano Lectivo com Novos Recursos Didácticos',
      description: 'O CEP Pereira inicia o novo ano letivo reforçando o material experimental das salas de aula e novos manuais de apoio à leitura.',
      imageUrl: '/src/assets/images/cep_classroom_learning_1790861301453.jpg',
      date: '15 de Julho',
      category: 'Actividade Escolar'
    },
    {
      id: 'hl-2',
      title: 'Visita de Inspeção Escolar Governamental Confirma Padrão de Excelência',
      description: 'A Direcção Provincial da Educação do Cuanza Sul elogiou a organização, disciplina e o cumprimento rígido de 25 alunos por turma.',
      imageUrl: '/src/assets/images/cep_school_campus_1790861289408.jpg',
      date: '28 de Agosto',
      category: 'Reconhecimento'
    },
    {
      id: 'hl-3',
      title: 'Cerimónia Trimestral de Entrega dos Diplomas do Quadro de Honra',
      description: 'Reconhecimento aos educandos que atingiram médias superiores a 17 valores, estimulando o mérito e a dedicação ao estudo diário.',
      imageUrl: '/src/assets/images/cep_student_portrait_1790861275389.jpg',
      date: '10 de Setembro',
      category: 'Mérito Académico'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Leitura Orientada e Cálculo nas Salas Climatizadas',
      imageUrl: '/src/assets/images/cep_classroom_learning_1790861301453.jpg',
      category: 'Salas de Aula'
    },
    {
      id: 'gal-2',
      title: 'Fachada Principal e Pátio Central do Campus Escolar',
      imageUrl: '/src/assets/images/cep_school_campus_1790861289408.jpg',
      category: 'Campus'
    },
    {
      id: 'gal-3',
      title: 'Fardamento e Distintivo Oficial dos Educandos',
      imageUrl: '/src/assets/images/cep_student_portrait_1790861275389.jpg',
      category: 'Fardamento'
    }
  ]
};

export const GRADE_CAPACITY = [
  { grade: 'Iniciação', maxCapacity: 25, enrolled: 25, shift: 'Manhã/Tarde', status: 'Esgotado' },
  { grade: '1.ª Classe', maxCapacity: 25, enrolled: 22, shift: 'Manhã', status: '3 Vagas Restantes' },
  { grade: '2.ª Classe', maxCapacity: 25, enrolled: 20, shift: 'Manhã', status: '5 Vagas Restantes' },
  { grade: '3.ª Classe', maxCapacity: 25, enrolled: 19, shift: 'Tarde', status: '6 Vagas Restantes' },
  { grade: '4.ª Classe', maxCapacity: 25, enrolled: 23, shift: 'Tarde', status: '2 Vagas Restantes' },
  { grade: '5.ª Classe', maxCapacity: 25, enrolled: 21, shift: 'Manhã', status: '4 Vagas Restantes' },
  { grade: '6.ª Classe', maxCapacity: 25, enrolled: 24, shift: 'Manhã', status: '1 Vaga Restante' },
];

export const ANNOUNCEMENTS = [
  {
    id: 'aviso-1',
    date: '28 Setembro 2024',
    title: 'Reunião Trimestral com os Encarregados de Educação',
    content: 'Convocatória para a 1.ª Assembleia Geral de Pais e Encarregados de Educação a realizar-se no Salão Nobre do CEP Pereira no próximo sábado, pelas 09h00.',
    category: 'Geral',
    author: 'Direcção Pedagógica'
  },
  {
    id: 'aviso-2',
    date: '15 Setembro 2024',
    title: 'Uso Obrigatório do Uniforme Oficial e Bata Escolar',
    content: 'Recordamos a todos os encarregados que a partir de 1 de Outubro é obrigatório o porte do fardamento completo com o distintivo oficial do colégio.',
    category: 'Regulamento',
    author: 'Secretaria Escolar'
  },
  {
    id: 'aviso-3',
    date: '02 Setembro 2024',
    title: 'Inauguração do Laboratório Infantil de Ciências e Informática',
    content: 'Com grande satisfação informamos a conclusão da sala de experimentação pedagógica para apoio prático ao Estudo do Meio desde a 1.ª à 6.ª classe.',
    category: 'Infraestrutura',
    author: 'Direcção Geral'
  }
];
