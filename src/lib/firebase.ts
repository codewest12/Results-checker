import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query,
  where,
  limit
} from 'firebase/firestore';
import { 
  AcademicSession, 
  Subject, 
  Student, 
  StudentResult, 
  GradingRule, 
  Announcement,
  CSSIdoNotification,
  PinResetRequest,
  SmsLog
} from '../types';
import { 
  INITIAL_SESSIONS, 
  INITIAL_SUBJECTS, 
  INITIAL_STUDENTS, 
  INITIAL_RESULTS, 
  DEFAULT_GRADING_RULES, 
  INITIAL_ANNOUNCEMENTS 
} from '../data/mockData';

// Firebase Config derived from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyC9szFEBHmc1zeh8cofX8uwWxPBzYLuSfQ",
  authDomain: "community-secondary-school-ido.firebaseapp.com",
  projectId: "community-secondary-school-ido",
  storageBucket: "community-secondary-school-ido.firebasestorage.app",
  messagingSenderId: "86601384478",
  appId: "1:86601384478:web:c558004beb9e000fdbe40f",
  measurementId: "G-SQ14VLE1CQ",
};
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the named database from the config
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// ----------------------------------------------------
// SECURITY ERROR HANDLING & DATA SANITIZATION
// ----------------------------------------------------

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Drops all `undefined` values recursively so Firestore never complains about unsupported fields
function sanitizeData<T>(data: T): any {
  return JSON.parse(JSON.stringify(data));
}

async function safeSetDoc(docRef: any, data: any, path: string): Promise<void> {
  try {
    const sanitized = sanitizeData(data);
    await setDoc(docRef, sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

async function safeGetDocs(queryOrCol: any, path: string): Promise<any> {
  try {
    return await getDocs(queryOrCol);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

async function safeDeleteDoc(docRef: any, path: string): Promise<void> {
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Seeding function to populate Firestore if collections are empty
export async function seedDatabaseIfEmpty() {
  try {
    const sessionsSnap = await safeGetDocs(collection(db, 'sessions'), 'sessions');
    if (sessionsSnap.empty) {
      console.log('Seeding initial sessions...');
      for (const s of INITIAL_SESSIONS) {
        await safeSetDoc(doc(db, 'sessions', s.id), s, 'sessions');
      }
    }

    const subjectsSnap = await safeGetDocs(collection(db, 'subjects'), 'subjects');
    if (subjectsSnap.empty) {
      console.log('Seeding initial subjects...');
      for (const s of INITIAL_SUBJECTS) {
        await safeSetDoc(doc(db, 'subjects', s.id), s, 'subjects');
      }
    }

    const studentsSnap = await safeGetDocs(collection(db, 'students'), 'students');
    if (studentsSnap.empty) {
      console.log('Seeding initial students...');
      for (const s of INITIAL_STUDENTS) {
        await safeSetDoc(doc(db, 'students', s.id), s, 'students');
      }
    } else {
      // Database has existing data, let's proactively search and delete any old SS1 Science/Arts students
      try {
        const q1 = query(collection(db, 'students'), where('classId', '==', 'SS1 Science'));
        const q2 = query(collection(db, 'students'), where('classId', '==', 'SS1 Arts'));
        const [snap1, snap2] = await Promise.all([
          safeGetDocs(q1, 'students_cleanup_science'),
          safeGetDocs(q2, 'students_cleanup_arts')
        ]);
        
        const obsoleteStudents: any[] = [];
        snap1.forEach((d: any) => obsoleteStudents.push(d));
        snap2.forEach((d: any) => obsoleteStudents.push(d));
        
        if (obsoleteStudents.length > 0) {
          console.log(`Cleaning up ${obsoleteStudents.length} obsolete SS1 Science/Arts students...`);
          for (const sDoc of obsoleteStudents) {
            await safeDeleteDoc(doc(db, 'students', sDoc.id), 'students');
            
            // Clean up corresponding student results to keep database fast & relational integrity secure
            const qr = query(collection(db, 'results'), where('studentId', '==', sDoc.id));
            const resSnap = await safeGetDocs(qr, 'results_cleanup_obsolete');
            resSnap.forEach(async (rDoc: any) => {
              await safeDeleteDoc(doc(db, 'results', rDoc.id), 'results');
            });
          }
        }
      } catch (cleanErr) {
        console.error('Error during database cleanup of obsolete SS1 student documents:', cleanErr);
      }
    }

    const resultsSnap = await safeGetDocs(collection(db, 'results'), 'results');
    if (resultsSnap.empty) {
      console.log('Seeding initial results...');
      for (const r of INITIAL_RESULTS) {
        await safeSetDoc(doc(db, 'results', r.id), r, 'results');
      }
    }

    const gradingSnap = await safeGetDocs(collection(db, 'gradingRules'), 'gradingRules');
    if (gradingSnap.empty) {
      console.log('Seeding initial grading rules...');
      for (const g of DEFAULT_GRADING_RULES) {
        await safeSetDoc(doc(db, 'gradingRules', g.grade), g, 'gradingRules');
      }
    }

    const announcementsSnap = await safeGetDocs(collection(db, 'announcements'), 'announcements');
    if (announcementsSnap.empty) {
      console.log('Seeding initial announcements...');
      for (const a of INITIAL_ANNOUNCEMENTS) {
        await safeSetDoc(doc(db, 'announcements', a.id), a, 'announcements');
      }
    }
  } catch (error) {
    console.error('Error seeding database: ', error);
  }
}

// ----------------------------------------------------
// DATABASE SERVICES (CRUD operations using Firestore)
// ----------------------------------------------------

// Academic Sessions
export async function dbGetSessions(): Promise<AcademicSession[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'sessions'), 'sessions');
  const list: AcademicSession[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as AcademicSession);
  });
  return list;
}

export async function dbSaveSession(sess: AcademicSession): Promise<void> {
  await safeSetDoc(doc(db, 'sessions', sess.id), sess, 'sessions');
}

export async function dbUpdateSessions(sessions: AcademicSession[]): Promise<void> {
  for (const s of sessions) {
    await safeSetDoc(doc(db, 'sessions', s.id), s, 'sessions');
  }
}

// Subjects
export async function dbGetSubjects(): Promise<Subject[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'subjects'), 'subjects');
  const list: Subject[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as Subject);
  });
  return list;
}

export async function dbSaveSubject(sub: Subject): Promise<void> {
  await safeSetDoc(doc(db, 'subjects', sub.id), sub, 'subjects');
}

export async function dbDeleteSubject(subId: string): Promise<void> {
  await safeDeleteDoc(doc(db, 'subjects', subId), 'subjects');
}

// Students
export async function dbGetStudentByRegNo(regNo: string): Promise<Student | null> {
  try {
    const q = query(collection(db, 'students'), where('regNo', '==', regNo), limit(1));
    const querySnapshot = await safeGetDocs(q, 'students');
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Student;
    }
    return null;
  } catch (error) {
    console.error('Error fetching student by registration number: ', error);
    return null;
  }
}

export async function dbGetStudents(): Promise<Student[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'students'), 'students');
  const list: Student[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as Student);
  });
  return list;
}

export async function dbSaveStudent(std: Student): Promise<void> {
  await safeSetDoc(doc(db, 'students', std.id), std, 'students');
}

export async function dbDeleteStudent(stdId: string): Promise<void> {
  await safeDeleteDoc(doc(db, 'students', stdId), 'students');
}

// Results
export async function dbGetResultsForStudent(studentId: string): Promise<StudentResult[]> {
  try {
    const q = query(collection(db, 'results'), where('studentId', '==', studentId));
    const querySnapshot = await safeGetDocs(q, 'results');
    const list: StudentResult[] = [];
    querySnapshot.forEach((doc: any) => {
      list.push(doc.data() as StudentResult);
    });
    return list;
  } catch (error) {
    console.error('Error fetching results for student: ', error);
    return [];
  }
}

export async function dbGetResultsByFilter(classId: string, sessionId: string, term: string): Promise<StudentResult[]> {
  try {
    const q = query(
      collection(db, 'results'),
      where('classId', '==', classId),
      where('sessionId', '==', sessionId),
      where('term', '==', term)
    );
    const querySnapshot = await safeGetDocs(q, 'results');
    const list: StudentResult[] = [];
    querySnapshot.forEach((doc: any) => {
      list.push(doc.data() as StudentResult);
    });
    return list;
  } catch (error) {
    console.error('Error fetching results by filter: ', error);
    return [];
  }
}

export async function dbGetResults(): Promise<StudentResult[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'results'), 'results');
  const list: StudentResult[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as StudentResult);
  });
  return list;
}

export async function dbSaveResult(res: StudentResult): Promise<void> {
  await safeSetDoc(doc(db, 'results', res.id), res, 'results');
}

export async function dbDeleteResult(resId: string): Promise<void> {
  await safeDeleteDoc(doc(db, 'results', resId), 'results');
}

// Grading Rules
export async function dbGetGradingRules(): Promise<GradingRule[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'gradingRules'), 'gradingRules');
  const list: GradingRule[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as GradingRule);
  });
  return list;
}

export async function dbSaveGradingRule(rule: GradingRule): Promise<void> {
  await safeSetDoc(doc(db, 'gradingRules', rule.grade), rule, 'gradingRules');
}

// Announcements
export async function dbGetAnnouncements(): Promise<Announcement[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'announcements'), 'announcements');
  const list: Announcement[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as Announcement);
  });
  return list;
}

export async function dbSaveAnnouncement(ann: Announcement): Promise<void> {
  await safeSetDoc(doc(db, 'announcements', ann.id), ann, 'announcements');
}

export async function dbDeleteAnnouncement(annId: string): Promise<void> {
  await safeDeleteDoc(doc(db, 'announcements', annId), 'announcements');
}

// Notifications
export async function dbGetNotifications(): Promise<CSSIdoNotification[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'notifications'), 'notifications');
  const list: CSSIdoNotification[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as CSSIdoNotification);
  });
  return list;
}

export async function dbSaveNotification(notif: CSSIdoNotification): Promise<void> {
  await safeSetDoc(doc(db, 'notifications', notif.id), notif, 'notifications');
}

// PIN Reset Requests
export async function dbGetPinResetRequests(): Promise<PinResetRequest[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'pinResetRequests'), 'pinResetRequests');
  const list: PinResetRequest[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as PinResetRequest);
  });
  return list;
}

export async function dbSavePinResetRequest(req: PinResetRequest): Promise<void> {
  await safeSetDoc(doc(db, 'pinResetRequests', req.id), req, 'pinResetRequests');
}

// SMS Logs
export async function dbGetSmsLogs(): Promise<SmsLog[]> {
  const querySnapshot = await safeGetDocs(collection(db, 'smsLogs'), 'smsLogs');
  const list: SmsLog[] = [];
  querySnapshot.forEach((doc: any) => {
    list.push(doc.data() as SmsLog);
  });
  return list;
}

export async function dbSaveSmsLog(logEntry: SmsLog): Promise<void> {
  await safeSetDoc(doc(db, 'smsLogs', logEntry.id), logEntry, 'smsLogs');
}
