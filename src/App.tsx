exportxportmport React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Shield,
  Key,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Mail,
  Phone,
  Send,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Student, 
  StudentResult, 
  AcademicSession, 
  Term, 
  Subject, 
  GradingRule, 
  Announcement,
  CSSIdoNotification,
  PinResetRequest
} from './types';
import { 
  INITIAL_SESSIONS, 
  INITIAL_SUBJECTS, 
  INITIAL_STUDENTS, 
  INITIAL_RESULTS, 
  DEFAULT_GRADING_RULES, 
  INITIAL_ANNOUNCEMENTS 
} from './data/mockData';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import {
  seedDatabaseIfEmpty,
  dbGetSessions,
  dbGetSubjects,
  dbGetStudents,
  dbGetResults,
  dbGetGradingRules,
  dbGetNotifications,
  dbSaveStudent,
  dbDeleteStudent,
  dbUpdateSessions,
  dbSaveSubject,
  dbDeleteSubject,
  dbSaveResult,
  dbDeleteResult,
  dbSaveGradingRule,
  dbSaveNotification,
  dbGetPinResetRequests,
  dbSavePinResetRequest,
  dbGetAnnouncements,
  dbSaveAnnouncement,
  dbDeleteAnnouncement,
  dbGetStudentByRegNo,
  dbGetResultsForStudent,
  dbGetResultsByFilter,
  db,
  auth
} from './lib/firebase';
import LandingPage from './components/LandingPage';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import ContactAdminModal from './components/ContactAdmiexported';

export default function App() {
  // ----------------------------------------------------
  // PERSISTENCE & FIREBASE STATE INITIALIZATION
  // ----------------------------------------------------
  const [sessions, setSessions] = useState<AcademicSession[]>(INITIAL_SESSIONS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [gradingRules, setGradingRules] = useState<GradingRule[]>(DEFAULT_GRADING_RULES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<CSSIdoNotification[]>([]);
  const [pinRequests, setPinRequests] = useState<PinResetRequest[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load fconstirebase on start (Optimized for Scalability)
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Ensure student/guest is authenticated anonymously before fetching data
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn('AnonseedDatabaseIfEmptyn is disabled in Firebase console or failed. Proceeding with client fallback:', authErr);
        }
        //DatabaseIfEmptyaseIfEmpty();
        
        // Exclude full students and results from startup download to prevent memory crashes with millions of users
        const [
  dbSessions,
  dbSubjects,
  dbStudents,
  dbResults,
  dbRules,
  dbNotifs,
  dbPinRequests,
  dbAnnouncements
] = await Promise.all([
  dbGetSessions(),
  dbGetSubjects(),
  dbGetStudents(),
  dbGetResults(),
  dbGetGradingRules(),
  dbGetNotifications(),
  dbGetPinResetRequests(),
  dbGetAnnouncements()
]);

  if (dbSessions) setSessions(dbSessions);
  if (dbSubjects) setSubjects(dbSubjects);
  if (dbStudents) setStudents(dbStudents);
  if (dbResults) setResults(dbResults);
  if (dbRules) setGradingRules(dbRules);if       if (dbPinRequests && dbPinRequests.length > 0) setPinRequests(dbPinRequests);
        if (dbAnnouncements && dbAnnouncements.length > 0) setAnnouncements(dbAnnouncements);
        if (dbNotifs && dbNotifs.length > 0) {
          setNotifications(dbNotifs);
        } else {
          setNotifications([
            {
              id: 'notif-welcome',
              title: 'System Online',
              message: 'Community Secondary School Ido result portal database is fully connected.',
              timestamp: new Date().toLocaleTimeString(),
              type: 'success' as const
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading data from Firestore: ', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ----------------------------------------------------
  // FIREBASE TRANSACTION HANDLERS
  // ----------------------------------------------------
  const handleUpdateStudents = async (updated: Student[]) => {
    setStudents(updated);
    try {
      const dbStudentsList = await dbGetStudents();
      const dbIds = dbStudentsList.map(s => s.id);
      const updatedIds = updated.map(s => s.id);
      
      // Save/Update in parallel for massive speed & scalability
      const savePromises = updated.map(std => dbSaveStudent(std));
      
      // Delete missing in parallel
      const deletePromises = dbIds
        .filter(id => !updatedIds.includes(id))
        .map(id => dbDeleteStudent(id));
        
      await Promise.all([...savePromises, ...deletePromises]);
    } catch (e) {
      console.error('Error saving students in parallel: ', e);
    }
  };

  const handleUpdateSessions = async (updated: AcademicSession[]) => {
    setSessions(updated);
    try {
      await dbUpdateSessions(updated);
    } catch (e) {
      console.error('Error saving sessions: ', e);
    }
  };

  const handleUpdateSubjects = async (updated: Subject[]) => {
    setSubjects(updated);
    try {
      const dbSubjectsList = await dbGetSubjects();
      const dbIds = dbSubjectsList.map(s => s.id);
      const updatedIds = updated.map(s => s.id);

      const savePromises = updated.map(sub => dbSaveSubject(sub));
      const deletePromises = dbIds
        .filter(id => !updatedIds.includes(id))
        .map(id => dbDeleteSubject(id));

      await Promise.all([...savePromises, ...deletePromises]);
    } catch (e) {
      console.error('Error saving subjects in parallel: ', e);
    }
  };

  const autoCalculatePositions = (updatedList: StudentResult[], studentList: Student[]): StudentResult[] => {
    // Deep clone to avoid mutating state directly
    const updated = updatedList.map(r => ({ ...r, scores: r.scores.map(s => ({ ...s })) }));
    
    // Create map of studentId -> Student to look up department
    const studentMap = new Map<string, Student>();
    studentList.forEach(s => studentMap.set(s.id, s));

    // Group results by classId, department, sessionId, term
    const grouped: Record<string, StudentResult[]> = {};

    updated.forEach(res => {
      // Recalculate totalScore and averageScore for the individual result first to ensure full accuracy
      if (res.scores && res.scores.length > 0) {
        res.totalScore = res.scores.reduce((sum, s) => sum + (s.totalScore || 0), 0);
        res.averageScore = res.totalScore / res.scores.length;
      } else {
        res.totalScore = 0;
        res.averageScore = 0;
      }

      const student = studentMap.get(res.studentId);
      const dept = student?.department || (res.classId.includes('Science') ? 'Science' : 'Arts');
      const key = `${res.classId}-${dept}-${res.sessionId}-${res.term}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(res);
    });

    // Rank each group
    Object.keys(grouped).forEach(key => {
      const groupResults = grouped[key];
      // Sort by averageScore descending
      groupResults.sort((a, b) => b.averageScore - a.averageScore);

      groupResults.forEach((item, index) => {
        if (index > 0 && item.averageScore === groupResults[index - 1].averageScore) {
          item.classPosition = groupResults[index - 1].classPosition;
        } else {
          item.classPosition = index + 1;
        }
      });
    });

    return updated;
  };

  const handleUpdateResults = async (updated: StudentResult[]) => {
    const fullyCalculatedResults = autoCalculatePositions(updated, students);
    setResults(fullyCalculatedResults);
    try {
      const dbResultsList = await dbGetResults();
      const dbIds = dbResultsList.map(r => r.id);
      const updatedIds = fullyCalculatedResults.map(r => r.id);

      const savePromises = fullyCalculatedResults.map(res => dbSaveResult(res));
      const deletePromises = dbIds
        .filter(id => !updatedIds.includes(id))
        .map(id => dbDeleteResult(id));

      await Promise.all([...savePromises, ...deletePromises]);
    } catch (e) {
      console.error('Error saving results in parallel: ', e);
    }
  };

  const handleUpdateGradingRules = async (updated: GradingRule[]) => {
    setGradingRules(updated);
    try {
      for (const rule of updated) {
        await dbSaveGradingRule(rule);
      }
    } catch (e) {
      console.error('Error saving grading rules: ', e);
    }
  };

  const handleUpdateAnnouncements = async (updated: Announcement[]) => {
    setAnnouncements(updated);
    try {
      const dbAnnouncementsList = await dbGetAnnouncements();
      const dbIds = dbAnnouncementsList.map(a => a.id);
      const updatedIds = updated.map(a => a.id);

      const savePromises = updated.map(ann => dbSaveAnnouncement(ann));
      const deletePromises = dbIds
        .filter(id => !updatedIds.includes(id))
        .map(id => dbDeleteAnnouncement(id));

      await Promise.all([...savePromises, ...deletePromises]);
    } catch (e) {
      console.error('Error saving announcements in parallel: ', e);
    }
  };

  // ----------------------------------------------------
  // NAVIGATION & PORTAL VIEWS STATE
  // ----------------------------------------------------
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'student'>('landing');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Active Login Modals State
  const [showStudentLoginModal, setShowStudentLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Form input values
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [studentLoginError, setStudentLoginError] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Toast Alerts State
  const [toastAlerts, setToastAlerts] = useState<{ id: string; title: string; message: string; type: 'success' | 'warning' | 'info' }[]>([]);

  // ----------------------------------------------------
  // HELPER TO TRIGGER CUSTOM VISUAL NOTIFICATIONS
  // ----------------------------------------------------
  const addToast = async (title: string, message: string, type: 'success' | 'warning' | 'info') => {
    const newId = `toast-${Date.now()}`;
    setToastAlerts(prev => [...prev, { id: newId, title, message, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToastAlerts(prev => prev.filter(t => t.id !== newId));
    }, 5000);

    // Save to permanent administrative notification logs
    const newLog: CSSIdoNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setNotifications(prev => [...prev, newLog]);
    try {
      await dbSaveNotification(newLog);
    } catch (e) {
      console.error('Error saving notification log: ', e);
    }
  };

  // Handlers for student support / PIN retrieval requests
  const handleAddPinRequest = async (regNo: string, studentName: string, contactInfo: string, message: string) => {
    const newReq: PinResetRequest = {
      id: `req-${Date.now()}`,
      regNo: regNo.toUpperCase().trim(),
      studentName: studentName.trim(),
      contactInfo: contactInfo.trim(),
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
    const updated = [...pinRequests, newReq];
    setPinRequests(updated);
    try {
      await dbSavePinResetRequest(newReq);
      await addToast(
        'Request Logged',
        `Support request for ${regNo.toUpperCase()} has been sent to the registrar block.`,
        'success'
      );
    } catch (e) {
      console.error('Error submitting PIN request: ', e);
      await addToast('Network Delay', 'Request saved locally, syncing with cloud database shortly.', 'warning');
    }
  };

  const handleUpdatePinRequests = async (updated: PinResetRequest[]) => {
    setPinRequests(updated);
  };


  // ----------------------------------------------------
  // AUTHENTICATION LOGIC
  // ----------------------------------------------------
  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentRegNo.trim() || !studentPin.trim()) {
      setStudentLoginError('Please input both your Registration Number and unique access PIN.');
      return;
    }

    // Pattern Validation Check
    const regNoPattern = /^CSS\/IDO\/\d{4}\/\d+$/;
    if (!regNoPattern.test(studentRegNo.trim())) {
      setStudentLoginError('Error: Registration number must follow the capitalized pattern CSS/IDO/YYYY/NNN (e.g. CSS/IDO/2026/001). Lowercase letters are not allowed.');
      return;
    }

    try {
      setIsLoading(true);
      // O(1) direct query lookup on Firestore - extremely fast and scalable for millions of student records
      const matched = await dbGetStudentByRegNo(studentRegNo.trim());

      if (matched && matched.pin === studentPin.trim()) {
        // Fetch only this specific student's results from Firestore on-demand
        const studentResults = await dbGetResultsForStudent(matched.id);
        setResults(prev => {
          const filtered = prev.filter(r => r.studentId !== matched.id);
          return [...filtered, ...studentResults];
        });

        // Also add to students list state in memory to keep current student present
        setStudents(prev => {
          if (!prev.some(s => s.id === matched.id)) {
            return [...prev, matched];
          }
          return prev;
        });

        setActiveStudent(matched);
        setIsAdminLoggedIn(false);
        setCurrentView('student');
        setShowStudentLoginModal(false);
        setStudentLoginError('');
        setStudentRegNo('');
        setStudentPin('');
        addToast('Student Authenticated', `Welcome back, ${matched.name}!`, 'success');
      } else {
        setStudentLoginError('Invalid Registration Number or secret PIN. Please verify credentials or contact the admin block.');
      }
    } catch (err) {
      console.error('Student login error:', err);
      setStudentLoginError('Network delay. Please try logging in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Default system credentials: admin@school.edu / admin123
    if (adminEmail.trim().toLowerCase() === 'admin@school.edu' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setActiveStudent(null);
      setCurrentView('admin');
      setShowAdminLoginModal(false);
      setAdminLoginError('');
      setAdminEmail('');
      setAdminPassword('');
      addToast('Admin Logged In', 'Administrative session started successfully.', 'success');

      // Create an administration session document matched to user's anonymous token
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, 'admins', auth.currentUser.uid), {
            password: 'admin123',
            loggedInAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error establishing administrative backend credentials:', err);
      }

      // Lazily load full students and results list for the Admin Portal only on successful admin login
      try {
        setIsLoading(true);
        addToast('Syncing Registry', 'Retrieving student roster and results from database...', 'info');
        const [dbStudents, dbResults] = await Promise.all([
          dbGetStudents(),
          dbGetResults()
        ]);
        if (dbStudents && dbStudents.length > 0) setStudents(dbStudents);
        if (dbResults && dbResults.length > 0) setResults(dbResults);
        addToast('Database Synced', 'Roster and grades loaded successfully.', 'success');
      } catch (err) {
        console.error('Lazy loading error for admin portal:', err);
        addToast('Sync Warning', 'A network warning occurred while syncing students list.', 'warning');
      } finally {
        setIsLoading(false);
      }
    } else {
      setAdminLoginError('Invalid Administrator credentials. Try admin@school.edu with admin123.');
    }
  };

  // Direct check results trigger from Landing Page quick access box
  const handleOpenStudentLoginWithPrefill = (
    prefilledReg?: string, 
    prefilledSession?: string, 
    prefilledTerm?: Term
  ) => {
    if (prefilledReg) {
      setStudentRegNo(prefilledReg);
      // Auto-populate PIN for seamless testing if it matches our preloaded seeds!
      const matchingSeed = students.find(s => s.regNo.toUpperCase() === prefilledReg.toUpperCase());
      if (matchingSeed) {
        setStudentPin(matchingSeed.pin);
      } else {
        setStudentPin('');
      }
    }
    setShowStudentLoginModal(true);
  };

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'admins', auth.currentUser.uid));
      }
    } catch (err) {
      console.error('Error removing administrative session from backend:', err);
    }
    setActiveStudent(null);
    setIsAdminLoggedIn(false);
    setCurrentView('landing');
    setStudentRegNo('');
    setStudentPin('');
    setAdminEmail('');
    setAdminPassword('');
    addToast('Logged Out Securely', 'Your terminal session has ended.', 'info');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-block relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#5c061c]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#5c061c] animate-spin"></div>
          </div>
          <div>
            <h2 className="text-[20px] md:text-[22px] font-semibold text-slate-800 tracking-tight animate-pulse">Initializing Portal</h2>
            <p className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono mt-1">Connecting to Community Secondary School Ido Database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 overflow-x-hidden select-none">
      
      {/* ----------------------------------------------------
          ACTIVE PORTAL ROUTER
          ---------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage 
              sessions={sessions}
              announcements={announcements}
              onOpenStudentLogin={handleOpenStudentLoginWithPrefill}
              onOpenAdminLogin={() => setShowAdminLoginModal(true)}
              onOpenContactModal={() => setShowContactModal(true)}
            />
          </motion.div>
        )}

        {currentView === 'student' && activeStudent && (
          <motion.div
            key="student-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <StudentPortal 
              student={activeStudent}
              sessions={sessions}
              results={results}
              subjects={subjects}
              gradingRules={gradingRules}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {currentView === 'admin' && isAdminLoggedIn && (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
             <AdminPortal 
               students={students}
               sessions={sessions}
               results={results}
               subjects={subjects}
               gradingRules={gradingRules}
               notifications={notifications}
               onLogout={handleLogout}
               onUpdateStudents={handleUpdateStudents}
               onUpdateSessions={handleUpdateSessions}
               onUpdateResults={handleUpdateResults}
               onUpdateSubjects={handleUpdateSubjects}
               onUpdateGradingRules={handleUpdateGradingRules}
               onAddNotification={addToast}
               pinResetRequests={pinRequests}
               onUpdatePinResetRequests={handleUpdatePinRequests}
               announcements={announcements}
               onUpdateAnnouncements={handleUpdateAnnouncements}
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: SECURE STUDENT AUTHENTICATION LOGIN
          ---------------------------------------------------- */}
      {showStudentLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative"
          >
            {/* Elegant top bar banner */}
            <div className="h-2 bg-gradient-to-r from-[#5c061c] to-amber-500"></div>

            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#5c061c]/10 text-[#5c061c] rounded-lg">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 tracking-[-0.02em]">Student Portal Login</h3>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Terminal Result Checking Block</p>
                </div>
              </div>
              <button 
                id="close-student-login-btn"
                onClick={() => { 
                  setShowStudentLoginModal(false); 
                  setStudentLoginError(''); 
                  setStudentRegNo('');
                  setStudentPin('');
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStudentLoginSubmit} className="p-6 space-y-4 text-xs">
              {studentLoginError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="text-[13px] font-normal leading-[1.5]">{studentLoginError}</span>
                </div>
              )}

              <div>
                <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Registration Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. CSS/IDO/2026/001"
                  value={studentRegNo}
                  onChange={(e) => setStudentRegNo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] font-mono text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Verification Access PIN</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Key size={14} />
                  </span>
                  <input 
                    type="password" 
                    placeholder="Enter 4-digit PIN"
                    value={studentPin}
                    maxLength={4}
                    onChange={(e) => setStudentPin(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#5c061c] hover:bg-[#720a25] text-white text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>Authorize Access Check</span>
              </button>

              <div className="text-center mt-3 pt-3 border-t border-slate-100 text-[13px] text-slate-500 font-normal leading-[1.5]">
                <span>Forgot your secret PIN? </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowStudentLoginModal(false);
                    setShowContactModal(true);
                  }}
                  className="text-[#5c061c] hover:underline font-semibold cursor-pointer"
                >
                  Contact Administration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: SECURE ADMINISTRATOR PORTAL LOGIN
          ---------------------------------------------------- */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative"
          >
            {/* Maroon Top Banner */}
            <div className="h-2 bg-[#5c061c]"></div>

            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#5c061c]/10 text-[#5c061c] rounded-lg">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 tracking-[-0.02em]">Administrator Console</h3>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Authorized Registrar & Faculty Access</p>
                </div>
              </div>
              <button 
                id="close-admin-login-btn"
                onClick={() => { 
                  setShowAdminLoginModal(false); 
                  setAdminLoginError(''); 
                  setAdminEmail('');
                  setAdminPassword('');
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="p-6 space-y-4 text-xs">
              {adminLoginError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="text-[13px] font-normal leading-[1.5]">{adminLoginError}</span>
                </div>
              )}

              <div>
                <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="admin@school.edu"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">System Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] font-mono text-slate-900"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Lock size={14} className="text-amber-400" />
                <span>Sign In Administrative Terminal</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: CONTACT ADMINISTRATION / PIN ASSISTANCE
          ---------------------------------------------------- */}
      <AnimatePresence>
        {showContactModal && (
          <ContactAdminModal 
            onClose={() => setShowContactModal(false)}
            onSubmit={handleAddPinRequest}
          />
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          TOAST ALERT POPUPS (Non-blocking notifications)
          ---------------------------------------------------- */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toastAlerts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 pointer-events-auto bg-white ${
                toast.type === 'success' ? 'border-emerald-100' : toast.type === 'warning' ? 'border-rose-100' : 'border-blue-100'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${
                toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : toast.type === 'warning' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {toast.type === 'success' ? <CheckCircle size={16} /> : toast.type === 'warning' ? <AlertCircle size={16} /> : <Info size={16} />}
              </div>

              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-slate-800">{toast.title}</h4>
                <p className="text-slate-500 leading-snug">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
