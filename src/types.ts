export type Term = 'First Term' | 'Second Term' | 'Third Term';

export type StudentClass = 
  | 'SS1A' 
  | 'SS1B' 
  | 'SS2 Science' 
  | 'SS2 Arts' 
  | 'SS3 Science' 
  | 'SS3 Arts';

export interface AcademicSession {
  id: string;
  name: string; // e.g. "2025/2026"
  isCurrent: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classes: StudentClass[]; // assigned classes
}

export interface Student {
  id: string;
  regNo: string;
  pin: string;
  name: string;
  classId: StudentClass;
  department: 'Science' | 'Arts' | 'General';
  passportUrl: string; // Base64 or placeholder URL
  gender: 'Male' | 'Female';
  guardianPhone?: string;
  guardianName?: string;
}

export interface SubjectScore {
  subjectId: string;
  caScore: number;   // Max 30 or 40
  examScore: number; // Max 60 or 70
  totalScore: number; // caScore + examScore
  grade: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  sessionId: string;
  term: Term;
  classId: StudentClass;
  scores: SubjectScore[];
  totalScore: number;
  averageScore: number;
  overallGrade: string;
  classPosition: number;
  attendance?: number; // e.g. percentage or days
  teacherRemark: string;
  principalRemark: string;
  isPublished: boolean;
  publishedDate?: string;
  positionOverride?: string;
}

export interface GradingRule {
  grade: string;
  minScore: number;
  maxScore: number;
  remark: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'academic' | 'general' | 'holiday' | 'exam';
}

export interface CSSIdoNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface PinResetRequest {
  id: string;
  regNo: string;
  studentName: string;
  contactInfo: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface SmsLog {
  id: string;
  phone: string;
  name: string;
  regNo: string;
  pin: string;
  body: string;
  status: 'delivered' | 'pending' | 'failed';
  sentAt: string;
}


