import { 
  AcademicSession, 
  Subject, 
  Student, 
  StudentResult, 
  GradingRule, 
  Announcement,
  StudentClass
} from '../types';

export const INITIAL_SESSIONS: AcademicSession[] = [
  { id: 'sess-1', name: '2024/2025', isCurrent: false },
  { id: 'sess-2', name: '2025/2026', isCurrent: true }
];

export const CLASSES: StudentClass[] = [
  'SS1A',
  'SS1B',
  'SS2 Science',
  'SS2 Arts',
  'SS3 Science',
  'SS3 Arts'
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-math', name: 'Mathematics', code: 'MTH', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS2 Arts', 'SS3 Science', 'SS3 Arts'] },
  { id: 'sub-eng', name: 'English Language', code: 'ENG', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS2 Arts', 'SS3 Science', 'SS3 Arts'] },
  { id: 'sub-phy', name: 'Physics', code: 'PHY', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS3 Science'] },
  { id: 'sub-chm', name: 'Chemistry', code: 'CHM', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS3 Science'] },
  { id: 'sub-bio', name: 'Biology', code: 'BIO', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS3 Science'] },
  { id: 'sub-lit', name: 'Literature in English', code: 'LIT', classes: ['SS1A', 'SS1B', 'SS2 Arts', 'SS3 Arts'] },
  { id: 'sub-gov', name: 'Government', code: 'GOV', classes: ['SS1A', 'SS1B', 'SS2 Arts', 'SS3 Arts'] },
  { id: 'sub-crs', name: 'Christian Religious Studies', code: 'CRS', classes: ['SS1A', 'SS1B', 'SS2 Arts', 'SS3 Arts'] },
  { id: 'sub-civ', name: 'Civic Education', code: 'CIV', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS2 Arts', 'SS3 Science', 'SS3 Arts'] },
  { id: 'sub-eco', name: 'Economics', code: 'ECN', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS2 Arts', 'SS3 Science', 'SS3 Arts'] },
  { id: 'sub-agri', name: 'Agricultural Science', code: 'AGR', classes: ['SS1A', 'SS1B', 'SS2 Science', 'SS2 Arts', 'SS3 Science', 'SS3 Arts'] }
];

// Seed some elegant avatar icons using SVG markup
// Seed blank modern placeholder profile icons as SVG markup
export const STUDENT_AVATARS = {
  male: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f1f5f9"/><circle cx="50" cy="38" r="20" fill="%23475569"/><path d="M18,85 C18,70 30,58 50,58 C70,58 82,70 82,85 Z" fill="%231e293b"/></svg>',
  female: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23faf5ff"/><circle cx="50" cy="38" r="20" fill="%23db2777"/><path d="M18,85 C18,70 30,58 50,58 C70,58 82,70 82,85 Z" fill="%239d174d"/><path d="M26,38 C26,22 40,16 50,16 C60,16 74,22 74,38" fill="none" stroke="%239d174d" stroke-width="5" stroke-linecap="round"/></svg>'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    regNo: 'CSS/IDO/2026/001',
    pin: '2468',
    name: 'Adekunle Chidi Ibrahim',
    classId: 'SS3 Science',
    department: 'Science',
    passportUrl: STUDENT_AVATARS.male,
    gender: 'Male',
    guardianName: 'Chief Olumide Ibrahim',
    guardianPhone: '+234 803 123 4567'
  },
  {
    id: 'std-2',
    regNo: 'CSS/IDO/2026/002',
    pin: '1357',
    name: 'Chioma Precious Nwachukwu',
    classId: 'SS3 Science',
    department: 'Science',
    passportUrl: STUDENT_AVATARS.female,
    gender: 'Female',
    guardianName: 'Dr. (Mrs) Ngozi Nwachukwu',
    guardianPhone: '+234 812 345 6789'
  },
  {
    id: 'std-3',
    regNo: 'CSS/IDO/2026/003',
    pin: '9876',
    name: 'Musa Abdullahi Bello',
    classId: 'SS3 Arts',
    department: 'Arts',
    passportUrl: STUDENT_AVATARS.male,
    gender: 'Male',
    guardianName: 'Mallam Abdullahi Bello',
    guardianPhone: '+234 705 987 6543'
  },
  {
    id: 'std-4',
    regNo: 'CSS/IDO/2026/004',
    pin: '4321',
    name: 'Funmilayo Grace Balogun',
    classId: 'SS3 Arts',
    department: 'Arts',
    passportUrl: STUDENT_AVATARS.female,
    gender: 'Female',
    guardianName: 'Pastor Samuel Balogun',
    guardianPhone: '+234 813 555 4321'
  },
  {
    id: 'std-5',
    regNo: 'CSS/IDO/2026/005',
    pin: '5544',
    name: 'Emeka Divine Okafor',
    classId: 'SS2 Science',
    department: 'Science',
    passportUrl: STUDENT_AVATARS.male,
    gender: 'Male',
    guardianName: 'Mrs. Janet Okafor',
    guardianPhone: '+234 806 777 8888'
  },
  {
    id: 'std-6',
    regNo: 'CSS/IDO/2026/006',
    pin: '8899',
    name: 'Aisha Yusuf Saliu',
    classId: 'SS2 Arts',
    department: 'Arts',
    passportUrl: STUDENT_AVATARS.female,
    gender: 'Female',
    guardianName: 'Alhaji Yusuf Saliu',
    guardianPhone: '+234 902 444 1111'
  },
  {
    id: 'std-7',
    regNo: 'CSS/IDO/2026/007',
    pin: '1212',
    name: 'Tobi Daniel Alao',
    classId: 'SS1A',
    department: 'General',
    passportUrl: STUDENT_AVATARS.male,
    gender: 'Male',
    guardianName: 'Mr. Gabriel Alao',
    guardianPhone: '+234 803 111 2222'
  },
  {
    id: 'std-8',
    regNo: 'CSS/IDO/2026/008',
    pin: '1313',
    name: 'Zainab Aminu Dike',
    classId: 'SS1B',
    department: 'General',
    passportUrl: STUDENT_AVATARS.female,
    gender: 'Female',
    guardianName: 'Dr. Aminu Dike',
    guardianPhone: '+234 815 333 4444'
  }
];

export const DEFAULT_GRADING_RULES: GradingRule[] = [
  { grade: 'A1', minScore: 75, maxScore: 100, remark: 'Excellent' },
  { grade: 'B2', minScore: 70, maxScore: 74, remark: 'Very Good' },
  { grade: 'B3', minScore: 65, maxScore: 69, remark: 'Good' },
  { grade: 'C4', minScore: 60, maxScore: 64, remark: 'Credit' },
  { grade: 'C5', minScore: 55, maxScore: 59, remark: 'Credit' },
  { grade: 'C6', minScore: 50, maxScore: 54, remark: 'Credit' },
  { grade: 'D7', minScore: 45, maxScore: 49, remark: 'Pass' },
  { grade: 'E8', minScore: 40, maxScore: 44, remark: 'Pass' },
  { grade: 'F9', minScore: 0, maxScore: 39, remark: 'Fail' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Release of 2025/2026 Second Term Results',
    content: 'All terminal results for the Second Term academic session of 2025/2026 have been successfully compiled. Parents and guardians are advised to obtain result checking PINs from the Administrative block or view them directly if already assigned. Academic excellence remains our ultimate target.',
    date: '2026-04-10',
    category: 'academic'
  },
  {
    id: 'ann-2',
    title: 'Inter-House Sports Competition Postponement',
    content: 'Due to scheduled structural enhancements on our primary sporting grounds, the annual Inter-House Sports competition has been rescheduled to hold on the 5th of November. We apologize for any convenience and appreciate our student houses for their continued preparation.',
    date: '2026-06-18',
    category: 'general'
  },
  {
    id: 'ann-3',
    title: 'External NECO/WAEC Examination Preparation Classes',
    content: 'Compulsory preparatory sessions for all SS3 students registered for WAEC and NECO external examinations will commence next Monday. High discipline and punctual attendance is demanded from all final year candidates.',
    date: '2026-07-01',
    category: 'exam'
  }
];

// Helper to calculate score grade based on grading rules
export function getGradeForScore(score: number, rules: GradingRule[] = DEFAULT_GRADING_RULES): { grade: string; remark: string } {
  const rule = rules.find(r => score >= r.minScore && score <= r.maxScore);
  return rule ? { grade: rule.grade, remark: rule.remark } : { grade: 'F9', remark: 'Fail' };
}

// Generate realistic results for SS3 students
// Session: sess-2 (2025/2026), Term: First Term / Second Term
export const INITIAL_RESULTS: StudentResult[] = [
  // Adekunle Chidi Ibrahim - SS3 Science - First Term (Published)
  {
    id: 'res-std1-s2t1',
    studentId: 'std-1',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS3 Science',
    scores: [
      { subjectId: 'sub-math', caScore: 28, examScore: 62, totalScore: 90, grade: 'A1' },
      { subjectId: 'sub-eng', caScore: 24, examScore: 56, totalScore: 80, grade: 'A1' },
      { subjectId: 'sub-phy', caScore: 26, examScore: 54, totalScore: 80, grade: 'A1' },
      { subjectId: 'sub-chm', caScore: 25, examScore: 49, totalScore: 74, grade: 'B2' },
      { subjectId: 'sub-bio', caScore: 27, examScore: 52, totalScore: 79, grade: 'A1' },
      { subjectId: 'sub-civ', caScore: 22, examScore: 48, totalScore: 70, grade: 'B2' },
      { subjectId: 'sub-eco', caScore: 24, examScore: 51, totalScore: 75, grade: 'A1' },
      { subjectId: 'sub-agri', caScore: 28, examScore: 58, totalScore: 86, grade: 'A1' }
    ],
    totalScore: 634,
    averageScore: 79.25,
    overallGrade: 'Excellent',
    classPosition: 1,
    attendance: 94,
    teacherRemark: 'Chidi is an exceptional student with a brilliant analytical mind. He maintains consistent focus in all scientific subjects.',
    principalRemark: 'An outstanding academic performance. Keep up the high standard.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },
  // Chioma Precious Nwachukwu - SS3 Science - First Term (Published)
  {
    id: 'res-std2-s2t1',
    studentId: 'std-2',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS3 Science',
    scores: [
      { subjectId: 'sub-math', caScore: 25, examScore: 52, totalScore: 77, grade: 'A1' },
      { subjectId: 'sub-eng', caScore: 28, examScore: 58, totalScore: 86, grade: 'A1' },
      { subjectId: 'sub-phy', caScore: 22, examScore: 46, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-chm', caScore: 24, examScore: 53, totalScore: 77, grade: 'A1' },
      { subjectId: 'sub-bio', caScore: 28, examScore: 54, totalScore: 82, grade: 'A1' },
      { subjectId: 'sub-civ', caScore: 26, examScore: 52, totalScore: 78, grade: 'A1' },
      { subjectId: 'sub-eco', caScore: 23, examScore: 45, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-agri', caScore: 25, examScore: 53, totalScore: 78, grade: 'A1' }
    ],
    totalScore: 614,
    averageScore: 76.75,
    overallGrade: 'Excellent',
    classPosition: 2,
    attendance: 98,
    teacherRemark: 'Precious is diligent, respectful, and highly motivated. She has excellent communication and writing skills.',
    principalRemark: 'A highly commendable performance. Continue to strive for excellence.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },
  // Emeka Divine Okafor - SS2 Science - First Term (Published)
  {
    id: 'res-std5-s2t1',
    studentId: 'std-5',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS2 Science',
    scores: [
      { subjectId: 'sub-math', caScore: 21, examScore: 44, totalScore: 65, grade: 'B3' },
      { subjectId: 'sub-eng', caScore: 20, examScore: 42, totalScore: 62, grade: 'C4' },
      { subjectId: 'sub-phy', caScore: 23, examScore: 45, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-chm', caScore: 19, examScore: 38, totalScore: 57, grade: 'C5' },
      { subjectId: 'sub-bio', caScore: 22, examScore: 48, totalScore: 70, grade: 'B2' },
      { subjectId: 'sub-civ', caScore: 18, examScore: 41, totalScore: 59, grade: 'C5' },
      { subjectId: 'sub-eco', caScore: 20, examScore: 40, totalScore: 60, grade: 'C4' },
      { subjectId: 'sub-agri', caScore: 24, examScore: 48, totalScore: 72, grade: 'B2' }
    ],
    totalScore: 513,
    averageScore: 64.13,
    overallGrade: 'Good',
    classPosition: 1,
    attendance: 88,
    teacherRemark: 'Emeka has shown satisfactory effort this term. There is room for improvement in Chemistry and Civic Education.',
    principalRemark: 'A good result, but you are capable of far better scores if you stay fully focused.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },
  // Musa Abdullahi Bello - SS3 Arts - First Term (Published)
  {
    id: 'res-std3-s2t1',
    studentId: 'std-3',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS3 Arts',
    scores: [
      { subjectId: 'sub-math', caScore: 18, examScore: 36, totalScore: 54, grade: 'C6' },
      { subjectId: 'sub-eng', caScore: 25, examScore: 54, totalScore: 79, grade: 'A1' },
      { subjectId: 'sub-lit', caScore: 28, examScore: 52, totalScore: 80, grade: 'A1' },
      { subjectId: 'sub-gov', caScore: 26, examScore: 55, totalScore: 81, grade: 'A1' },
      { subjectId: 'sub-crs', caScore: 24, examScore: 48, totalScore: 72, grade: 'B2' },
      { subjectId: 'sub-civ', caScore: 25, examScore: 50, totalScore: 75, grade: 'A1' },
      { subjectId: 'sub-eco', caScore: 21, examScore: 46, totalScore: 67, grade: 'B3' },
      { subjectId: 'sub-agri', caScore: 23, examScore: 45, totalScore: 68, grade: 'B3' }
    ],
    totalScore: 576,
    averageScore: 72.00,
    overallGrade: 'Very Good',
    classPosition: 1,
    attendance: 91,
    teacherRemark: 'Musa has shown a fantastic aptitude for government and humanities. He should dedicate more study time to mathematics.',
    principalRemark: 'Very impressive results in Arts subjects. Maintain the momentum.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },
  // Funmilayo Grace Balogun - SS3 Arts - First Term (Published)
  {
    id: 'res-std4-s2t1',
    studentId: 'std-4',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS3 Arts',
    scores: [
      { subjectId: 'sub-math', caScore: 20, examScore: 42, totalScore: 62, grade: 'C4' },
      { subjectId: 'sub-eng', caScore: 24, examScore: 50, totalScore: 74, grade: 'B2' },
      { subjectId: 'sub-lit', caScore: 22, examScore: 46, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-gov', caScore: 23, examScore: 48, totalScore: 71, grade: 'B2' },
      { subjectId: 'sub-crs', caScore: 25, examScore: 51, totalScore: 76, grade: 'A1' },
      { subjectId: 'sub-civ', caScore: 24, examScore: 45, totalScore: 69, grade: 'B3' },
      { subjectId: 'sub-eco', caScore: 22, examScore: 46, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-agri', caScore: 21, examScore: 44, totalScore: 65, grade: 'B3' }
    ],
    totalScore: 553,
    averageScore: 69.13,
    overallGrade: 'Good',
    classPosition: 2,
    attendance: 95,
    teacherRemark: 'Grace is an active, polite, and very helpful class member. Her academic reports are solid and robust.',
    principalRemark: 'An encouraging report card. Keep up the clean efforts.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },
  // Aisha Yusuf Saliu - SS2 Arts - First Term (Published)
  {
    id: 'res-std6-s2t1',
    studentId: 'std-6',
    sessionId: 'sess-2',
    term: 'First Term',
    classId: 'SS2 Arts',
    scores: [
      { subjectId: 'sub-math', caScore: 16, examScore: 35, totalScore: 51, grade: 'C6' },
      { subjectId: 'sub-eng', caScore: 22, examScore: 43, totalScore: 65, grade: 'B3' },
      { subjectId: 'sub-lit', caScore: 24, examScore: 48, totalScore: 72, grade: 'B2' },
      { subjectId: 'sub-gov', caScore: 21, examScore: 40, totalScore: 61, grade: 'C4' },
      { subjectId: 'sub-crs', caScore: 23, examScore: 45, totalScore: 68, grade: 'B3' },
      { subjectId: 'sub-civ', caScore: 22, examScore: 44, totalScore: 66, grade: 'B3' },
      { subjectId: 'sub-eco', caScore: 18, examScore: 40, totalScore: 58, grade: 'C5' },
      { subjectId: 'sub-agri', caScore: 20, examScore: 41, totalScore: 61, grade: 'C4' }
    ],
    totalScore: 502,
    averageScore: 62.75,
    overallGrade: 'Good',
    classPosition: 1,
    attendance: 87,
    teacherRemark: 'Aisha works well in groups. She should attempt more algebraic exercises at home to enhance her math skills.',
    principalRemark: 'Satisfactory academic results. You can achieve more by staying focused.',
    isPublished: true,
    publishedDate: '2025-12-18'
  },

  // Second Term results (Some draft, some published)
  // Chidi Ibrahim - SS3 Science - Second Term (Published)
  {
    id: 'res-std1-s2t2',
    studentId: 'std-1',
    sessionId: 'sess-2',
    term: 'Second Term',
    classId: 'SS3 Science',
    scores: [
      { subjectId: 'sub-math', caScore: 29, examScore: 64, totalScore: 93, grade: 'A1' },
      { subjectId: 'sub-eng', caScore: 25, examScore: 58, totalScore: 83, grade: 'A1' },
      { subjectId: 'sub-phy', caScore: 27, examScore: 58, totalScore: 85, grade: 'A1' },
      { subjectId: 'sub-chm', caScore: 26, examScore: 52, totalScore: 78, grade: 'A1' },
      { subjectId: 'sub-bio', caScore: 28, examScore: 55, totalScore: 83, grade: 'A1' },
      { subjectId: 'sub-civ', caScore: 24, examScore: 50, totalScore: 74, grade: 'B2' },
      { subjectId: 'sub-eco', caScore: 26, examScore: 53, totalScore: 79, grade: 'A1' },
      { subjectId: 'sub-agri', caScore: 29, examScore: 60, totalScore: 89, grade: 'A1' }
    ],
    totalScore: 664,
    averageScore: 83.00,
    overallGrade: 'Excellent',
    classPosition: 1,
    attendance: 96,
    teacherRemark: 'Chidi continues to demonstrate an exemplary level of academic devotion. Brilliant marks.',
    principalRemark: 'Magnificent performance. A true beacon of scholastic excellence.',
    isPublished: true,
    publishedDate: '2026-04-10'
  },
  // Chioma Precious Nwachukwu - SS3 Science - Second Term (Draft)
  {
    id: 'res-std2-s2t2',
    studentId: 'std-2',
    sessionId: 'sess-2',
    term: 'Second Term',
    classId: 'SS3 Science',
    scores: [
      { subjectId: 'sub-math', caScore: 26, examScore: 54, totalScore: 80, grade: 'A1' },
      { subjectId: 'sub-eng', caScore: 27, examScore: 59, totalScore: 86, grade: 'A1' },
      { subjectId: 'sub-phy', caScore: 24, examScore: 48, totalScore: 72, grade: 'B2' },
      { subjectId: 'sub-chm', caScore: 26, examScore: 54, totalScore: 80, grade: 'A1' },
      { subjectId: 'sub-bio', caScore: 27, examScore: 55, totalScore: 82, grade: 'A1' },
      { subjectId: 'sub-civ', caScore: 25, examScore: 51, totalScore: 76, grade: 'A1' },
      { subjectId: 'sub-eco', caScore: 24, examScore: 47, totalScore: 71, grade: 'B2' },
      { subjectId: 'sub-agri', caScore: 26, examScore: 52, totalScore: 78, grade: 'A1' }
    ],
    totalScore: 625,
    averageScore: 78.13,
    overallGrade: 'Excellent',
    classPosition: 2,
    attendance: 97,
    teacherRemark: 'Precious has maintained her elite standing. Her test scripts are highly clean and well-structured.',
    principalRemark: 'Excellent. Keep this up for the final terminal examination.',
    isPublished: false
  }
];
