import React, { useState, useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Key, 
  ChevronRight, 
  Layers, 
  Settings, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  FileSpreadsheet,
  GraduationCap,
  Save,
  Globe,
  Upload,
  UserCheck,
  TrendingUp,
  Sliders,
  Filter,
  LogOut,
  Send,
  History,
  Phone,
  Bell
} from 'lucide-react';
import { 
  Student, 
  StudentResult, 
  AcademicSession, 
  Term, 
  Subject, 
  GradingRule, 
  StudentClass,
  CSSIdoNotification,
  SubjectScore,
  PinResetRequest,
  SmsLog,
  Announcement
} from '../types';
import { getGradeForScore, STUDENT_AVATARS } from '../data/mockData';
import bannerClassroom from '../assets/images/modern_learning_space_1783850989057.jpg';

const getOrdinalSuffix = (num: number | string): string => {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (isNaN(n)) return String(num);
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) {
    return n + "st";
  }
  if (j === 2 && k !== 12) {
    return n + "nd";
  }
  if (j === 3 && k !== 13) {
    return n + "rd";
  }
  return n + "th";
};

interface AdminPortalProps {
  students: Student[];
  sessions: AcademicSession[];
  results: StudentResult[];
  subjects: Subject[];
  gradingRules: GradingRule[];
  notifications: CSSIdoNotification[];
  pinResetRequests: PinResetRequest[];
  announcements: Announcement[];
  onLogout: () => void;
  // State updaters passed from App.tsx
  onUpdateStudents: (updated: Student[]) => void;
  onUpdateSessions: (updated: AcademicSession[]) => void;
  onUpdateResults: (updated: StudentResult[]) => void;
  onUpdateSubjects: (updated: Subject[]) => void;
  onUpdateGradingRules: (updated: GradingRule[]) => void;
  onUpdatePinResetRequests: (updated: PinResetRequest[]) => void;
  onUpdateAnnouncements: (updated: Announcement[]) => void;
  onAddNotification: (title: string, msg: string, type: 'info' | 'success' | 'warning') => void;
}

export default function AdminPortal({
  students,
  sessions,
  results,
  subjects,
  gradingRules,
  notifications,
  pinResetRequests,
  announcements,
  onLogout,
  onUpdateStudents,
  onUpdateSessions,
  onUpdateResults,
  onUpdateSubjects,
  onUpdateGradingRules,
  onUpdatePinResetRequests,
  onUpdateAnnouncements,
  onAddNotification
}: AdminPortalProps) {
  // Navigation tabs inside Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'results' | 'subjects' | 'settings' | 'pinRequests' | 'announcements'>('dashboard');

  const pendingRequestsCount = useMemo(() => {
    return (pinResetRequests || []).filter(r => r.status === 'pending').length;
  }, [pinResetRequests]);

  // Sub-state helpers
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState<string>('All');
  const [studentDeptFilter, setStudentDeptFilter] = useState<string>('All');

  // Selective Lazy Rendering (SLR) state for scalable UI
  const [visibleStudentsCount, setVisibleStudentsCount] = useState(25);

  // Reset Selective Lazy Rendering view window when search or filters change to keep UI instant
  React.useEffect(() => {
    setVisibleStudentsCount(25);
  }, [studentSearch, studentClassFilter, studentDeptFilter]);

  // Current session & term being edited for marks/results
  const [selectedSessionId, setSelectedSessionId] = useState(sessions.find(s => s.isCurrent)?.id || sessions[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<Term>('First Term');
  const [selectedClassEntry, setSelectedClassEntry] = useState<StudentClass>('SS3 Science');

  // Modal / forms triggers
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedPromoPathway, setSelectedPromoPathway] = useState<'ss2_science' | 'ss2_arts' | 'ss1_transition'>('ss2_science');
  const [promoSelectedStudents, setPromoSelectedStudents] = useState<Record<string, boolean>>({});
  const [ss1TargetClasses, setSs1TargetClasses] = useState<Record<string, 'SS2 Science' | 'SS2 Arts' | 'remain'>>({});
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentReg, setNewStudentReg] = useState('');
  const [newStudentClass, setNewStudentClass] = useState<StudentClass>('SS1A');
  const [newStudentDept, setNewStudentDept] = useState<'Science' | 'Arts' | 'General'>('General');
  const [newStudentGender, setNewStudentGender] = useState<'Male' | 'Female'>('Male');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState(STUDENT_AVATARS.male);

  // Score Entry state for active student
  const [activeStudentForGrades, setActiveStudentForGrades] = useState<Student | null>(null);
  const [temporaryScores, setTemporaryScores] = useState<Record<string, { ca: number; exam: number }>>({});
  const [teacherRemark, setTeacherRemark] = useState('');
  const [principalRemark, setPrincipalRemark] = useState('');
  const [attendanceDays, setAttendanceDays] = useState(90);
  const [positionOverride, setPositionOverride] = useState('');

  // Subject Management forms state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubjectForEdit, setSelectedSubjectForEdit] = useState<Subject | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectClasses, setNewSubjectClasses] = useState<StudentClass[]>([]);

  // SMS Portal States
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsRecipientPhone, setSmsRecipientPhone] = useState('');
  const [smsStudentName, setSmsStudentName] = useState('');
  const [smsStudentReg, setSmsStudentReg] = useState('');
  const [smsPin, setSmsPin] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentLogs, setSmsSentLogs] = useState<SmsLog[]>([]);

  // Load SMS Logs on mount
  React.useEffect(() => {
    const loadSmsLogs = async () => {
      try {
        const { dbGetSmsLogs } = await import('../lib/firebase');
        const logs = await dbGetSmsLogs();
        if (logs && logs.length > 0) {
          setSmsSentLogs(logs);
        }
      } catch (e) {
        console.error('Error loading SMS logs: ', e);
      }
    };
    loadSmsLogs();
  }, []);

  // Session & Settings forms state
  const [newSessionName, setNewSessionName] = useState('');

  // Announcements tab form states
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'academic' | 'general' | 'holiday' | 'exam'>('general');

  // Dynamic custom alert/confirmation modal state
  const [modalState, setModalState] = useState<{
    type: 'confirm' | 'info';
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  // PIN recovery request actions state
  const [pinRequestsSearch, setPinRequestsSearch] = useState('');
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<PinResetRequest | null>(null);
  const [pinRequestsFilter, setPinRequestsFilter] = useState<'all' | 'pending' | 'resolved' | 'sms_logs'>('all');

  // ----------------------------------------------------
  // DYNAMIC RANKING CALCULATIONS
  // Calculates real-time position for students in a class-session-term subset
  // ----------------------------------------------------
  const calculatedPositions = useMemo(() => {
    // Group results by classId, department, sessionId, term
    const grouped: Record<string, { resultId: string; average: number }[]> = {};
    
    const studentMap = new Map<string, Student>();
    students.forEach(s => studentMap.set(s.id, s));

    results.forEach(res => {
      const student = studentMap.get(res.studentId);
      const dept = student?.department || (res.classId.includes('Science') ? 'Science' : 'Arts');
      const key = `${res.classId}-${dept}-${res.sessionId}-${res.term}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push({ resultId: res.id, average: res.averageScore || 0 });
    });

    // For each group, sort by average score descending and assign ranking indexes with tie-handling
    const positionMap: Record<string, number> = {};
    
    Object.keys(grouped).forEach(key => {
      const sorted = [...grouped[key]].sort((a, b) => b.average - a.average);
      sorted.forEach((item, index) => {
        if (index > 0 && item.average === sorted[index - 1].average) {
          positionMap[item.resultId] = positionMap[sorted[index - 1].resultId];
        } else {
          positionMap[item.resultId] = index + 1;
        }
      });
    });

    return positionMap;
  }, [results, students]);

  // ----------------------------------------------------
  // CLASS LEVEL METRICS & PERFORMANCE STATISTICS
  // Calculates real-time statistics for the selected class, session, and term
  // ----------------------------------------------------
  const classStats = useMemo(() => {
    const classStudents = students.filter(s => s.classId === selectedClassEntry);
    
    // Filter results matching Class, Academic Session, and Academic Term
    const classResults = results.filter(r => 
      r.classId === selectedClassEntry && 
      r.sessionId === selectedSessionId && 
      r.term === selectedTerm
    );

    const averages = classResults.map(r => r.averageScore || 0);
    const highestAverage = averages.length > 0 ? Math.max(...averages) : 0;
    const lowestAverage = averages.length > 0 ? Math.min(...averages) : 0;
    const classAverage = averages.length > 0 ? averages.reduce((sum, a) => sum + a, 0) / averages.length : 0;
    
    // A pass is defined as overall average score >= 40% (since F9 is 0-39)
    const passedCount = classResults.filter(r => (r.averageScore || 0) >= 40).length;
    const failedCount = classResults.length - passedCount;
    const passPercentage = classResults.length > 0 ? (passedCount / classResults.length) * 100 : 0;
    const failPercentage = classResults.length > 0 ? (failedCount / classResults.length) * 100 : 0;

    // Best-performing student
    const bestResult = classResults.length > 0 
      ? [...classResults].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))[0] 
      : null;
    const bestStudent = bestResult ? classStudents.find(s => s.id === bestResult.studentId) : null;

    // Top three students (podium)
    const sortedResults = [...classResults].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
    const topThree = sortedResults.slice(0, 3).map(r => ({
      student: classStudents.find(s => s.id === r.studentId),
      averageScore: r.averageScore || 0
    }));

    return {
      classStudents,
      classResults,
      classAverage,
      highestAverage,
      lowestAverage,
      passedCount,
      failedCount,
      passPercentage,
      failPercentage,
      bestStudent,
      bestResult,
      topThree
    };
  }, [students, results, selectedClassEntry, selectedSessionId, selectedTerm]);

  // ----------------------------------------------------
  // METRICS & STATISTICS (For dashboard)
  // ----------------------------------------------------
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalClasses = 6; // SS1-SS3 Science & Arts
    const totalSubjects = subjects.length;
    const publishedCount = results.filter(r => r.isPublished).length;
    const draftCount = results.filter(r => !r.isPublished).length;

    return {
      totalStudents,
      totalClasses,
      totalSubjects,
      publishedCount,
      draftCount
    };
  }, [students, subjects, results]);

  // ----------------------------------------------------
  // PIN GENERATOR HELPER
  // ----------------------------------------------------
  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // ----------------------------------------------------
  // FILTERED STUDENT LIST
  // ----------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.regNo.toLowerCase().includes(studentSearch.toLowerCase());
      
      const matchesClass = studentClassFilter === 'All' || student.classId === studentClassFilter;
      const matchesDept = studentDeptFilter === 'All' || student.department === studentDeptFilter;

      return matchesSearch && matchesClass && matchesDept;
    });
  }, [students, studentSearch, studentClassFilter, studentDeptFilter]);

  // ----------------------------------------------------
  // HANDLERS FOR STUDENT CRUD
  // ----------------------------------------------------
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentReg) {
      onAddNotification('Required Field Missing', 'Please fill in student name and registration number.', 'warning');
      return;
    }

    // Pattern Validation Check
    const regNoPattern = /^CSS\/IDO\/\d{4}\/\d+$/;
    if (!regNoPattern.test(newStudentReg.trim())) {
      onAddNotification(
        'Invalid Format',
        'Registration number must follow the capitalized pattern CSS/IDO/YYYY/NNN (e.g. CSS/IDO/2026/001). Lowercase letters are not allowed.',
        'warning'
      );
      return;
    }

    // Check duplicate Reg No
    if (students.some(s => s.regNo === newStudentReg.trim())) {
      onAddNotification('Registration Duplicated', 'Student with this Registration Number already exists.', 'warning');
      return;
    }

    const pin = generateRandomPin();
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name: newStudentName,
      regNo: newStudentReg.trim(),
      pin,
      classId: newStudentClass,
      department: newStudentDept,
      gender: newStudentGender,
      guardianName: newStudentGuardian,
      guardianPhone: newStudentPhone,
      passportUrl: newStudentAvatar
    };

    onUpdateStudents([...students, newStudent]);
    onAddNotification(
      'New Student Registered',
      `Registered ${newStudent.name} (${newStudent.regNo}) into ${newStudent.classId} with unique login PIN: ${newStudent.pin}`,
      'success'
    );

    // Reset Form
    setNewStudentName('');
    setNewStudentReg('');
    setNewStudentGuardian('');
    setNewStudentPhone('');
    setShowAddStudentModal(false);
  };

  const handleOpenPromotionModal = () => {
    const newPromoSelected: Record<string, boolean> = {};
    const newSs1Targets: Record<string, 'SS2 Science' | 'SS2 Arts' | 'remain'> = {};
    
    students.forEach(s => {
      if (s.classId === 'SS2 Science' || s.classId === 'SS2 Arts' || s.classId.startsWith('SS1')) {
        newPromoSelected[s.id] = true;
      }
      if (s.classId.startsWith('SS1')) {
        newSs1Targets[s.id] = 'SS2 Science';
      }
    });
    
    setPromoSelectedStudents(newPromoSelected);
    setSs1TargetClasses(newSs1Targets);
    setSelectedPromoPathway('ss2_science');
    setShowPromotionModal(true);
  };

  const handleExecutePromotion = () => {
    let updatedCount = 0;
    const updatedStudents = students.map(student => {
      if (selectedPromoPathway === 'ss2_science') {
        if (student.classId === 'SS2 Science' && promoSelectedStudents[student.id]) {
          updatedCount++;
          return {
            ...student,
            classId: 'SS3 Science' as StudentClass,
            department: 'Science' as 'Science' | 'Arts' | 'General'
          };
        }
      }
      if (selectedPromoPathway === 'ss2_arts') {
        if (student.classId === 'SS2 Arts' && promoSelectedStudents[student.id]) {
          updatedCount++;
          return {
            ...student,
            classId: 'SS3 Arts' as StudentClass,
            department: 'Arts' as 'Science' | 'Arts' | 'General'
          };
        }
      }
      if (selectedPromoPathway === 'ss1_transition') {
        if (student.classId.startsWith('SS1') && promoSelectedStudents[student.id]) {
          const target = ss1TargetClasses[student.id];
          if (target && target !== 'remain') {
            updatedCount++;
            return {
              ...student,
              classId: target as StudentClass,
              department: (target === 'SS2 Science' ? 'Science' : 'Arts') as 'Science' | 'Arts' | 'General'
            };
          }
        }
      }
      return student;
    });

    if (updatedCount === 0) {
      onAddNotification('No Students Selected', 'Please select at least one student to promote.', 'warning');
      return;
    }

    onUpdateStudents(updatedStudents);
    onAddNotification(
      'Promotion Completed',
      `Successfully processed transitions/promotions for ${updatedCount} students. Check the Registry to view updated classes.`,
      'success'
    );
    setShowPromotionModal(false);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) {
      onAddNotification('Required Field Missing', 'Please enter a title and content for the announcement.', 'warning');
      return;
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: newAnnCategory
    };

    onUpdateAnnouncements([...announcements, newAnnouncement]);
    onAddNotification(
      'Announcement Posted',
      `Announcement "${newAnnouncement.title}" has been successfully published to the student portal.`,
      'success'
    );

    // Reset Form
    setNewAnnTitle('');
    setNewAnnContent('');
    setNewAnnCategory('general');
  };

  const handleOpenEditStudent = (student: Student) => {
    setSelectedStudentForEdit(student);
    setNewStudentName(student.name);
    setNewStudentReg(student.regNo);
    setNewStudentClass(student.classId);
    setNewStudentDept(student.department);
    setNewStudentGender(student.gender);
    setNewStudentGuardian(student.guardianName || '');
    setNewStudentPhone(student.guardianPhone || '');
    setNewStudentAvatar(student.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male);
    setShowEditStudentModal(true);
  };

  const handleEditStudentSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEdit) return;

    if (!newStudentName || !newStudentReg) {
      onAddNotification('Required Field Missing', 'Please fill in student name and registration number.', 'warning');
      return;
    }

    // Pattern Validation Check
    const regNoPattern = /^CSS\/IDO\/\d{4}\/\d+$/;
    if (!regNoPattern.test(newStudentReg.trim())) {
      onAddNotification(
        'Invalid Format',
        'Registration number must follow the capitalized pattern CSS/IDO/YYYY/NNN (e.g. CSS/IDO/2026/001). Lowercase letters are not allowed.',
        'warning'
      );
      return;
    }

    // Check duplicate Reg No
    if (students.some(s => s.id !== selectedStudentForEdit.id && s.regNo === newStudentReg.trim())) {
      onAddNotification('Registration Duplicated', 'Another student with this Registration Number already exists.', 'warning');
      return;
    }

    const updated = students.map(s => {
      if (s.id === selectedStudentForEdit.id) {
        return {
          ...s,
          name: newStudentName,
          regNo: newStudentReg.trim(),
          classId: newStudentClass,
          department: newStudentDept,
          gender: newStudentGender,
          guardianName: newStudentGuardian,
          guardianPhone: newStudentPhone,
          passportUrl: newStudentAvatar
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    onAddNotification(
      'Student Updated',
      `Modified information records for student ${newStudentName}`,
      'info'
    );

    setShowEditStudentModal(false);
    setSelectedStudentForEdit(null);
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    setModalState({
      type: 'confirm',
      isOpen: true,
      title: 'Delete Student Account',
      message: `Are you absolutely sure you want to permanently delete student ${name}? This will remove them and all their report cards from the system directory. This action is irreversible.`,
      onConfirm: () => {
        onUpdateStudents(students.filter(s => s.id !== studentId));
        onUpdateResults(results.filter(r => r.studentId !== studentId));
        onAddNotification(
          'Student Account Deleted',
          `Permanently purged student ${name} and associated report cards.`,
          'warning'
        );
      }
    });
  };

  const handleResetPin = (studentId: string, name: string) => {
    const newPin = generateRandomPin();
    onUpdateStudents(students.map(s => {
      if (s.id === studentId) {
        return { ...s, pin: newPin };
      }
      return s;
    }));
    
    setModalState({
      type: 'info',
      isOpen: true,
      title: 'Security PIN Regenerated',
      message: `PIN successfully regenerated for ${name}.\n\nNew Login PIN: ${newPin}\n\nPlease copy this PIN and provide it to the student or their guardian.`
    });
    
    onAddNotification(
      'Security PIN Reset',
      `Regenerated terminal verification PIN for student ${name}. New PIN: ${newPin}`,
      'success'
    );
  };

  // ----------------------------------------------------
  // HANDLERS FOR SUBJECT CRUD
  // ----------------------------------------------------
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName || !newSubjectCode) return;

    if (selectedSubjectForEdit) {
      // Edit
      onUpdateSubjects(subjects.map(s => {
        if (s.id === selectedSubjectForEdit.id) {
          return {
            ...s,
            name: newSubjectName,
            code: newSubjectCode.toUpperCase(),
            classes: newSubjectClasses
          };
        }
        return s;
      }));
      onAddNotification('Subject Modified', `Updated settings for ${newSubjectName}`, 'info');
    } else {
      // Add
      const newSub: Subject = {
        id: `sub-${Date.now()}`,
        name: newSubjectName,
        code: newSubjectCode.toUpperCase(),
        classes: newSubjectClasses
      };
      onUpdateSubjects([...subjects, newSub]);
      onAddNotification('New Subject Added', `Created subject ${newSubjectName} (${newSub.code})`, 'success');
    }

    // Reset
    setShowSubjectModal(false);
    setSelectedSubjectForEdit(null);
    setNewSubjectName('');
    setNewSubjectCode('');
    setNewSubjectClasses([]);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setSelectedSubjectForEdit(sub);
    setNewSubjectName(sub.name);
    setNewSubjectCode(sub.code);
    setNewSubjectClasses(sub.classes);
    setShowSubjectModal(true);
  };

  const handleDeleteSubject = (subId: string, name: string) => {
    setModalState({
      type: 'confirm',
      isOpen: true,
      title: 'Delete Curricular Subject',
      message: `Are you sure you want to delete the subject ${name}? This will unassign it from all classes and remove it from the system.`,
      onConfirm: () => {
        onUpdateSubjects(subjects.filter(s => s.id !== subId));
        onAddNotification('Subject Deleted', `Removed subject ${name}`, 'warning');
      }
    });
  };

  // Toggle class selection in subject creation
  const handleToggleClassForSubject = (c: StudentClass) => {
    if (newSubjectClasses.includes(c)) {
      setNewSubjectClasses(newSubjectClasses.filter(cls => cls !== c));
    } else {
      setNewSubjectClasses([...newSubjectClasses, c]);
    }
  };

  // ----------------------------------------------------
  // GRADE & SCORE ENTRY HANDLERS
  // ----------------------------------------------------
  // Load existing score or prepare new score entries for a selected student
  const handleSelectStudentForGrades = (std: Student) => {
    setActiveStudentForGrades(std);
    
    // Find if result already exists
    const existing = results.find(
      r => r.studentId === std.id && r.sessionId === selectedSessionId && r.term === selectedTerm
    );

    // Filter subjects mapped to this student's class
    const classSubjects = subjects.filter(s => s.classes.includes(std.classId));
    
    const temp: Record<string, { ca: number; exam: number }> = {};
    classSubjects.forEach(sub => {
      const match = existing?.scores.find(s => s.subjectId === sub.id);
      temp[sub.id] = {
        ca: match ? match.caScore : 0,
        exam: match ? match.examScore : 0
      };
    });

    setTemporaryScores(temp);
    setTeacherRemark(existing ? existing.teacherRemark : 'Excellent performance. Keep it up.');
    setPrincipalRemark(existing ? existing.principalRemark : 'Very good. COMMENDABLE.');
    setAttendanceDays(existing?.attendance || 95);
    setPositionOverride(existing?.positionOverride || '');
  };

  // Handle in-line CA/Exam mark updates
  const handleScoreChange = (subjectId: string, field: 'ca' | 'exam', value: number) => {
    // Boundary check (CA Max 40, Exam Max 70 normally, or standard 30/70)
    const limit = field === 'ca' ? 40 : 70;
    const sanitized = Math.min(limit, Math.max(0, value || 0));

    setTemporaryScores(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: sanitized
      }
    }));
  };

  const handleSaveResult = (isPublishing: boolean) => {
    if (!activeStudentForGrades) return;

    // Compile Subject Scores array
    const compiledScores: SubjectScore[] = [];
    let totalScore = 0;

    Object.keys(temporaryScores).forEach(subId => {
      const item = temporaryScores[subId];
      const sum = item.ca + item.exam;
      const grading = getGradeForScore(sum, gradingRules);
      
      compiledScores.push({
        subjectId: subId,
        caScore: item.ca,
        examScore: item.exam,
        totalScore: sum,
        grade: grading.grade
      });

      totalScore += sum;
    });

    if (compiledScores.length === 0) {
      alert('This student has no mapped subjects. Assign subjects to their class first.');
      return;
    }

    const averageScore = totalScore / compiledScores.length;
    // Simple logic for overall grade
    const overallGrading = getGradeForScore(averageScore, gradingRules);

    // Look for existing result to update or create new
    const resultKey = results.findIndex(
      r => r.studentId === activeStudentForGrades.id && 
           r.sessionId === selectedSessionId && 
           r.term === selectedTerm
    );

    const updatedResult: StudentResult = {
      id: results[resultKey]?.id || `res-${Date.now()}`,
      studentId: activeStudentForGrades.id,
      sessionId: selectedSessionId,
      term: selectedTerm,
      classId: activeStudentForGrades.classId,
      scores: compiledScores,
      totalScore,
      averageScore,
      overallGrade: overallGrading.remark,
      classPosition: results[resultKey]?.classPosition || 1, // calculated dynamically in the map
      attendance: attendanceDays,
      teacherRemark,
      principalRemark,
      isPublished: isPublishing,
      publishedDate: isPublishing ? new Date().toISOString().split('T')[0] : undefined,
      positionOverride: positionOverride.trim() || undefined
    };

    let newResults = [...results];
    if (resultKey >= 0) {
      newResults[resultKey] = updatedResult;
    } else {
      newResults.push(updatedResult);
    }

    onUpdateResults(newResults);
    onAddNotification(
      isPublishing ? 'Assessment Published' : 'Assessment Draft Saved',
      `Result sheet for ${activeStudentForGrades.name} (${selectedTerm}) has been ${isPublishing ? 'Published' : 'Saved as Draft'}`,
      isPublishing ? 'success' : 'info'
    );

    setActiveStudentForGrades(null);
  };

  // Toggle Publish / Unpublish directly from Student List view
  const handleToggleResultPublication = (resultId: string, currentStatus: boolean) => {
    onUpdateResults(results.map(r => {
      if (r.id === resultId) {
        return {
          ...r,
          isPublished: !currentStatus,
          publishedDate: !currentStatus ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return r;
    }));

    onAddNotification(
      currentStatus ? 'Result Unpublished' : 'Result Published',
      `Changed publication state for report card record ${resultId}`,
      currentStatus ? 'warning' : 'success'
    );
  };

  // ----------------------------------------------------
  // SETTINGS & SESSIONS HANDLERS
  // ----------------------------------------------------
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    const newSess: AcademicSession = {
      id: `sess-${Date.now()}`,
      name: newSessionName.trim(),
      isCurrent: false
    };

    onUpdateSessions([...sessions, newSess]);
    onAddNotification('Academic Session Created', `Added ${newSess.name} to calendar setup`, 'success');
    setNewSessionName('');
  };

  const handleMakeSessionCurrent = (sessId: string) => {
    onUpdateSessions(sessions.map(s => ({
      ...s,
      isCurrent: s.id === sessId
    })));
    onAddNotification('Active Session Changed', 'Switched primary active session', 'info');
  };

  // PIN retrieval & reset requests handlers
  const handleResolvePinRequest = async (requestId: string, action: 'keep_pin' | 'regenerate') => {
    const req = (pinResetRequests || []).find(r => r.id === requestId);
    if (!req) return;

    // Find the student in the database
    const student = students.find(s => s.regNo.toUpperCase() === req.regNo.toUpperCase());
    
    let updatedPin = '';
    if (student) {
      if (action === 'regenerate') {
        // Generate a new 4-digit PIN
        const newPin = Math.floor(1000 + Math.random() * 9000).toString();
        updatedPin = newPin;
        // Save the updated student PIN
        const updatedStudent = { ...student, pin: newPin };
        onUpdateStudents(students.map(s => s.id === student.id ? updatedStudent : s));
      } else {
        updatedPin = student.pin;
      }
    }

    // Mark request as resolved
    const updatedRequests = pinResetRequests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'resolved' as const,
          resolvedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };
      }
      return r;
    });

    onUpdatePinResetRequests(updatedRequests);

    // Persist resolving the request in Firestore
    try {
      const resolvedReq = updatedRequests.find(r => r.id === requestId);
      if (resolvedReq) {
        const { dbSavePinResetRequest } = await import('../lib/firebase');
        await dbSavePinResetRequest(resolvedReq);
      }
    } catch (e) {
      console.error('Error saving resolved pin request: ', e);
    }

    // Trigger Admin alerts/notif
    onAddNotification(
      'PIN Request Resolved',
      `Assistance request for ${req.regNo} has been marked resolved.`,
      'success'
    );

    // Show a beautiful dialog showing the pin details with SMS dispatch
    if (student) {
      handleOpenSmsDialog(
        student.name,
        student.regNo,
        updatedPin,
        req.contactInfo || student.guardianPhone
      );
    } else {
      setModalState({
        type: 'info',
        isOpen: true,
        title: 'Request Marked Resolved',
        message: `The registration number ${req.regNo} did not map to any registered student, but the request was marked as resolved.`
      });
    }

    setSelectedRequestForDetail(null);
  };

  const handleOpenSmsDialog = (studentName: string, regNo: string, pin: string, guardianPhone?: string) => {
    setSmsStudentName(studentName);
    setSmsStudentReg(regNo);
    setSmsPin(pin);
    setSmsRecipientPhone(guardianPhone || '');
    setSmsBody(`Hello parent/guardian, here is the secure Access PIN for your child ${studentName} (${regNo}) to check their terminal reports online: PIN: ${pin}. From Community Secondary School Ido portal.`);
    setShowSmsModal(true);
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsRecipientPhone) {
      onAddNotification('Phone Number Required', 'Please specify a recipient phone number.', 'warning');
      return;
    }

    setIsSendingSms(true);
    
    // Simulate real SMS dispatch delay (1.2 seconds)
    setTimeout(async () => {
      const newLogEntry: SmsLog = {
        id: `sms-${Date.now()}`,
        phone: smsRecipientPhone,
        name: smsStudentName,
        regNo: smsStudentReg,
        pin: smsPin,
        body: smsBody,
        status: 'delivered', // simulated successful delivery report
        sentAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      };

      try {
        const { dbSaveSmsLog } = await import('../lib/firebase');
        await dbSaveSmsLog(newLogEntry);
        setSmsSentLogs(prev => [newLogEntry, ...prev]);
        onAddNotification(
          'SMS Sent Successfully',
          `PIN SMS successfully dispatched to parent/guardian of ${smsStudentName} at ${smsRecipientPhone}`,
          'success'
        );
      } catch (e) {
        console.error('Error saving SMS log to DB: ', e);
        // Fallback to local state if database fails
        setSmsSentLogs(prev => [newLogEntry, ...prev]);
        onAddNotification('SMS Sent (Local Only)', 'SMS dispatched but failed to archive in database history.', 'warning');
      } finally {
        setIsSendingSms(false);
        setShowSmsModal(false);
      }
    }, 1200);
  };

  const handleDeletePinRequest = async (requestId: string) => {
    const updatedRequests = (pinResetRequests || []).filter(r => r.id !== requestId);
    onUpdatePinResetRequests(updatedRequests);

    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await deleteDoc(doc(db, 'pinResetRequests', requestId));
    } catch (e) {
      console.error('Error deleting pin request from DB: ', e);
    }

    onAddNotification(
      'Request Deleted',
      'PIN recovery request has been permanently purged from system records.',
      'warning'
    );

    setSelectedRequestForDetail(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Admin Top Header Bar */}
      <header className="bg-[#5c061c] text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md border-b border-amber-500/20 shrink-0">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <SchoolBadge />
          <div>
            <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight text-white leading-[1.2]">Administrative Portal</h1>
            <p className="text-[13px] font-normal leading-[1.5] text-amber-300 font-mono tracking-wider uppercase font-semibold">Community Secondary School Ido</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right text-[13px] font-normal leading-[1.5]">
            <span className="text-red-200 font-mono block">Signed in as System</span>
            <span className="font-bold text-amber-300">ADMINISTRATOR</span>
          </div>
          <button 
            id="admin-logout-btn"
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#5c061c] text-[16px] font-semibold leading-[1.5] tracking-[0.02em] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Page Container */}
      <div className="flex-grow flex flex-col md:flex-row min-h-0">
        
        {/* Admin Left Navigation Sidebar */}
        <nav className="w-full md:w-64 bg-slate-950 text-slate-300 border-r border-slate-800 p-4 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto shrink-0 md:overflow-x-visible">
          
          <button
            id="admin-nav-dashboard"
            onClick={() => { setActiveTab('dashboard'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={18} />
            <span>Dashboard</span>
          </button>

          <button
            id="admin-nav-students"
            onClick={() => { setActiveTab('students'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'students' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={18} />
            <span>Students</span>
          </button>

          <button
            id="admin-nav-results"
            onClick={() => { setActiveTab('results'); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'results' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={18} />
            <span>Scores & Results</span>
          </button>

          <button
            id="admin-nav-subjects"
            onClick={() => { setActiveTab('subjects'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'subjects' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={18} />
            <span>Subjects</span>
          </button>

          <button
            id="admin-nav-settings"
            onClick={() => { setActiveTab('settings'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            id="admin-nav-pin-requests"
            onClick={() => { setActiveTab('pinRequests'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'pinRequests' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key size={18} />
            <span className="flex items-center justify-between w-full">
              <span>PIN Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="bg-amber-500 text-[#5c061c] text-[11px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </span>
          </button>

          <button
            id="admin-nav-announcements"
            onClick={() => { setActiveTab('announcements'); setActiveStudentForGrades(null); }}
            className={`w-auto md:w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium leading-[1.5] tracking-[0.01em] flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'announcements' 
                ? 'bg-[#5c061c] text-white shadow-md' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell size={18} />
            <span>Announcements</span>
          </button>

        </nav>

        {/* Admin Right Content Panel */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto min-h-0 bg-slate-50">
          
          {/* ========================================================== */}
          {/* TAB 1: DASHBOARD SUMMARY */}
          {/* ========================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-[24px] md:text-[28px] font-bold text-slate-800 tracking-[-0.02em] leading-[1.2]">System Statistics Overview</h2>
                  <p className="text-[16px] font-normal leading-[1.6] text-slate-500">Live summary of Community Secondary School Ido database status.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg py-1 px-3 text-[13px] font-normal leading-[1.5] text-slate-600 flex items-center gap-1.5 shadow-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Database Connected</span>
                </div>
              </div>

              {/* Bento Grid Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-slate-400 text-[13px] font-semibold tracking-wider uppercase font-mono">Total Students</span>
                  <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#5c061c] mt-2">{stats.totalStudents}</div>
                  <span className="text-[13px] font-normal leading-[1.5] text-slate-400 mt-1">Registered</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-slate-400 text-[13px] font-semibold tracking-wider uppercase font-mono">Total Classes</span>
                  <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#5c061c] mt-2">{stats.totalClasses}</div>
                  <span className="text-[13px] font-normal leading-[1.5] text-slate-400 mt-1">SS1 - SS3 Arms</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-slate-400 text-[13px] font-semibold tracking-wider uppercase font-mono">Total Subjects</span>
                  <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#5c061c] mt-2">{stats.totalSubjects}</div>
                  <span className="text-[13px] font-normal leading-[1.5] text-slate-400 mt-1">Curriculum</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-slate-400 text-[13px] font-semibold tracking-wider uppercase font-mono">Published Reports</span>
                  <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-emerald-600 mt-2">{stats.publishedCount}</div>
                  <span className="text-[13px] font-normal leading-[1.5] text-emerald-600 mt-1">Live Online</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
                  <span className="text-slate-400 text-[13px] font-semibold tracking-wider uppercase font-mono">Draft / Pending</span>
                  <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-amber-600 mt-2">{stats.draftCount}</div>
                  <span className="text-[13px] font-normal leading-[1.5] text-amber-600 mt-1">Under Review</span>
                </div>
              </div>

              {/* Quick Administrative Action Center */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 leading-[1.2] tracking-[-0.02em] flex items-center gap-1.5">
                    <Sliders className="text-[#5c061c]" size={16} />
                    <span>Quick Registrar Actions (Task Shortcuts)</span>
                  </h3>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-500">Direct shortcuts to execute key administrative operations without manual tab hunting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Action 1: Add Student */}
                  <button
                    onClick={() => {
                      setActiveTab('students');
                      setShowAddStudentModal(true);
                    }}
                    className="group p-4 bg-slate-50 hover:bg-[#5c061c]/5 hover:border-[#5c061c]/20 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex items-start gap-3"
                  >
                    <div className="p-2.5 bg-[#5c061c]/10 text-[#5c061c] group-hover:bg-[#5c061c] group-hover:text-white rounded-lg transition-all shrink-0">
                      <Users size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[16px] font-semibold leading-[1.5] text-slate-800 block">Register New Student</span>
                      <p className="text-[13px] font-normal leading-[1.5] text-slate-500 leading-normal">Add student name, assign class levels, and generate login credentials.</p>
                    </div>
                  </button>

                  {/* Action 2: Add Subject */}
                  <button
                    onClick={() => {
                      setActiveTab('subjects');
                      setSelectedSubjectForEdit(null);
                      setNewSubjectName('');
                      setNewSubjectCode('');
                      setNewSubjectClasses([]);
                      setShowSubjectModal(true);
                    }}
                    className="group p-4 bg-slate-50 hover:bg-[#5c061c]/5 hover:border-[#5c061c]/20 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex items-start gap-3"
                  >
                    <div className="p-2.5 bg-[#5c061c]/10 text-[#5c061c] group-hover:bg-[#5c061c] group-hover:text-white rounded-lg transition-all shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[16px] font-semibold leading-[1.5] text-slate-800 block">Create Curriculum Subject</span>
                      <p className="text-[13px] font-normal leading-[1.5] text-slate-500 leading-normal">Register school subjects, define codes, and map to study streams.</p>
                    </div>
                  </button>

                  {/* Action 3: Enter Scores & Results */}
                  <button
                    onClick={() => {
                      setActiveTab('results');
                    }}
                    className="group p-4 bg-slate-50 hover:bg-[#5c061c]/5 hover:border-[#5c061c]/20 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex items-start gap-3"
                  >
                    <div className="p-2.5 bg-[#5c061c]/10 text-[#5c061c] group-hover:bg-[#5c061c] group-hover:text-white rounded-lg transition-all shrink-0">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[16px] font-semibold leading-[1.5] text-slate-800 block">Enter Scores & Marks</span>
                      <p className="text-[13px] font-normal leading-[1.5] text-slate-500 leading-normal">Record CA continuous assessments, exams, and teacher appraisals.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom graphical representation or summary analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Chart Mockup */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="text-[#5c061c]" size={16} />
                      <span>Result Grade Distribution Analysis</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Current Session: 2025/2026</span>
                  </div>

                  {/* Horizontal Bar Chart representation */}
                  <div className="space-y-3 pt-2">
                    {[
                      { grade: 'A1 (75-100)', percentage: 38, count: 18, color: 'bg-emerald-500' },
                      { grade: 'B2 & B3 (65-74)', percentage: 32, count: 15, color: 'bg-[#5c061c]' },
                      { grade: 'C4, C5, C6 (50-64)', percentage: 22, count: 10, color: 'bg-amber-500' },
                      { grade: 'D7 & E8 (40-49)', percentage: 6, count: 3, color: 'bg-orange-500' },
                      { grade: 'F9 (0-39)', percentage: 2, count: 1, color: 'bg-rose-500' }
                    ].map(row => (
                      <div key={row.grade} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium text-slate-600">
                          <span>{row.grade}</span>
                          <span>{row.count} Students ({row.percentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications & System logs */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="text-amber-500" size={16} />
                      <span>Administrative Activity Logs</span>
                    </h3>
                    <span className="text-[9px] bg-[#5c061c]/10 text-[#5c061c] px-2 py-0.5 rounded-full font-mono font-bold uppercase">Live Logs</span>
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-2 max-h-[220px] pr-1">
                    {notifications.slice(-50).reverse().map(log => (
                      <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                        <div className="flex justify-between items-center font-mono">
                          <span className={`font-bold uppercase tracking-wider text-[9px] ${
                            log.type === 'success' ? 'text-emerald-600' : log.type === 'warning' ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            {log.title}
                          </span>
                          <span className="text-slate-400 text-[9px]">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-500 leading-snug">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: STUDENT DIRECTORY */}
          {/* ========================================================== */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Student Account Registry</h2>
                  <p className="text-xs text-slate-500">Register new admissions, edit bio data, and generate secret portal check-in PINs.</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    id="admin-promote-students-btn"
                    onClick={handleOpenPromotionModal}
                    className="flex-grow sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#5c061c] rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <TrendingUp size={16} />
                    <span>Promote & Transition</span>
                  </button>
                  <button
                    id="admin-add-student-btn"
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex-grow sm:flex-none px-4 py-2.5 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Register Student</span>
                  </button>
                </div>
              </div>

              {/* Filters list */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="flex-grow relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={16} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search students by name or registration number..." 
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#5c061c] focus:border-[#5c061c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 md:w-auto shrink-0">
                  <select 
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="All">All Classes</option>
                    <option value="SS1A">SS1A</option>
                    <option value="SS1B">SS1B</option>
                    <option value="SS2 Science">SS2 Science</option>
                    <option value="SS2 Arts">SS2 Arts</option>
                    <option value="SS3 Science">SS3 Science</option>
                    <option value="SS3 Arts">SS3 Arts</option>
                  </select>

                  <select 
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Students directory table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-3 px-4 font-bold">Student</th>
                        <th className="py-3 px-4 font-bold">Reg No</th>
                        <th className="py-3 px-4 font-bold">Class / Dept</th>
                        <th className="py-3 px-4 font-bold">Portal Access PIN</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.slice(0, visibleStudentsCount).map(student => (
                          <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                            
                            {/* Profile details */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={student.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                                  alt={student.name} 
                                  className="h-9 w-9 rounded-lg object-cover bg-slate-100"
                                />
                                <div>
                                  <div className="font-bold text-slate-800 text-xs sm:text-sm">{student.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{student.gender} // Guardian: {student.guardianName || 'N/A'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Registration details */}
                            <td className="py-3 px-4 font-mono font-bold text-[#5c061c] text-xs">
                              {student.regNo}
                            </td>

                            {/* Class and dept */}
                            <td className="py-3 px-4">
                              <span className="font-bold block text-slate-700">{student.classId}</span>
                              <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                student.department === 'Science' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {student.department}
                              </span>
                            </td>

                            {/* Access PIN */}
                            <td className="py-3 px-4 font-mono">
                              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-bold text-sm flex items-center gap-1.5 w-fit">
                                <Key size={12} className="text-amber-500" />
                                {student.pin}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  title="Send PIN via SMS"
                                  onClick={() => handleOpenSmsDialog(student.name, student.regNo, student.pin, student.guardianPhone)}
                                  className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg border border-transparent hover:border-emerald-100 transition-all cursor-pointer"
                                >
                                  <Send size={14} />
                                </button>
                                <button
                                  title="Reset PIN"
                                  onClick={() => handleResetPin(student.id, student.name)}
                                  className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg border border-transparent hover:border-amber-100 transition-all cursor-pointer"
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  title="Edit Info"
                                  onClick={() => handleOpenEditStudent(student)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  title="Delete Student"
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                            No students found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Selective Lazy Rendering (SLR) Controller */}
                {filteredStudents.length > 0 && (
                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5c061c]/10 text-[#5c061c] uppercase tracking-wider font-mono animate-pulse">
                        SLR Active
                      </span>
                      <span className="font-medium text-slate-500">
                        Showing <strong className="text-slate-800">{Math.min(visibleStudentsCount, filteredStudents.length)}</strong> of <strong className="text-slate-800">{filteredStudents.length}</strong> students in registry
                      </span>
                    </div>

                    {filteredStudents.length > visibleStudentsCount && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setVisibleStudentsCount(prev => prev + 50)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-[#5c061c] border border-slate-200 rounded-lg font-bold shadow-xs cursor-pointer transition-all active:scale-[0.98]"
                        >
                          Show Next 50 Students
                        </button>
                        <button
                          onClick={() => setVisibleStudentsCount(filteredStudents.length)}
                          className="px-4 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-lg font-bold shadow-xs cursor-pointer transition-all active:scale-[0.98]"
                        >
                          Load All ({filteredStudents.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: GRADES & MARKS ENTRY */}
          {/* ========================================================== */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              
              {!activeStudentForGrades ? (
                // VIEW 3A: STUDENT LIST FOR SELECTION
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Manual Marks Management</h2>
                    <p className="text-xs text-slate-500">Select Academic Session, Term, and Class to manage student continuous assessments and exam scores.</p>
                  </div>

                  {/* Period selection bars */}
                  <div className="bg-[#5c061c] text-white p-5 rounded-2xl shadow-sm border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-red-200 block mb-1">Academic Session</label>
                      <select
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold focus:outline-none text-white focus:bg-slate-900"
                      >
                        {sessions.map(s => (
                          <option key={s.id} value={s.id} className="text-slate-800">{s.name} {s.isCurrent ? '(Active)' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-red-200 block mb-1">Term</label>
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value as Term)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold focus:outline-none text-white focus:bg-slate-900"
                      >
                        <option value="First Term" className="text-slate-800">First Term</option>
                        <option value="Second Term" className="text-slate-800">Second Term</option>
                        <option value="Third Term" className="text-slate-800">Third Term</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-red-200 block mb-1">Target Class Arm</label>
                      <select
                        value={selectedClassEntry}
                        onChange={(e) => setSelectedClassEntry(e.target.value as StudentClass)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold focus:outline-none text-white focus:bg-slate-900"
                      >
                        <option value="SS1A" className="text-slate-800">SS1A</option>
                        <option value="SS1B" className="text-slate-800">SS1B</option>
                        <option value="SS2 Science" className="text-slate-800">SS2 Science</option>
                        <option value="SS2 Arts" className="text-slate-800">SS2 Arts</option>
                        <option value="SS3 Science" className="text-slate-800">SS3 Science</option>
                        <option value="SS3 Arts" className="text-slate-800">SS3 Arts</option>
                      </select>
                    </div>
                  </div>

                  {/* Class Level Performance Statistics */}
                  <div className="bg-[#fcf8f2] p-5 rounded-2xl border border-[#ebd7cb] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e6cebe] pb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#5c061c] uppercase tracking-wider font-mono">
                          Class Performance Dashboard & Leaderboard
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Selected Arm: {selectedClassEntry} • Term: {selectedTerm} • Session: {sessions.find(s => s.id === selectedSessionId)?.name || 'N/A'}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#5c061c]/5 text-[#5c061c] text-[10px] font-extrabold font-mono uppercase border border-[#5c061c]/10">
                        Live Analytics
                      </span>
                    </div>

                    {classStats.classResults.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Metrics Bento Grid */}
                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {/* Total Students */}
                          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                            <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">Class Roster</span>
                            <div className="mt-2">
                              <div className="text-xl sm:text-2xl font-black text-slate-800">{classStats.classStudents.length}</div>
                              <span className="text-[9px] text-slate-500 font-medium font-mono">
                                {classStats.classResults.length} with recorded grades
                              </span>
                            </div>
                          </div>

                          {/* Class Average */}
                          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                            <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">Class Average</span>
                            <div className="mt-2">
                              <div className="text-xl sm:text-2xl font-black text-[#5c061c]">{classStats.classAverage.toFixed(2)}%</div>
                              <span className="text-[9px] text-slate-500 font-medium font-mono">
                                Terminal Mean
                              </span>
                            </div>
                          </div>

                          {/* Highest / Lowest */}
                          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                            <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">Score Range</span>
                            <div className="mt-2 space-y-0.5">
                              <div className="text-xs font-bold text-slate-700 flex justify-between">
                                <span>Max:</span> <span className="text-emerald-600 font-extrabold">{classStats.highestAverage.toFixed(1)}%</span>
                              </div>
                              <div className="text-xs font-bold text-slate-700 flex justify-between">
                                <span>Min:</span> <span className="text-rose-600 font-extrabold">{classStats.lowestAverage.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Pass Metrics */}
                          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                            <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">Passed Students</span>
                            <div className="mt-2">
                              <div className="text-lg sm:text-xl font-black text-emerald-600">{classStats.passedCount} Students</div>
                              <span className="text-[9px] text-emerald-600/80 font-bold font-mono">
                                {classStats.passPercentage.toFixed(1)}% Pass Rate
                              </span>
                            </div>
                          </div>

                          {/* Fail Metrics */}
                          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                            <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">Failed Students</span>
                            <div className="mt-2">
                              <div className="text-lg sm:text-xl font-black text-rose-600">{classStats.failedCount} Students</div>
                              <span className="text-[9px] text-rose-600/80 font-bold font-mono">
                                {classStats.failPercentage.toFixed(1)}% Fail Rate
                              </span>
                            </div>
                          </div>

                          {/* Best Student Banner */}
                          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 shadow-xs flex flex-col justify-between">
                            <span className="text-amber-700 text-[10px] font-bold tracking-wider uppercase font-mono">Best Performing</span>
                            <div className="mt-2 min-w-0">
                              <div className="text-xs font-black text-slate-800 truncate" title={classStats.bestStudent?.name || 'N/A'}>
                                {classStats.bestStudent?.name || 'N/A'}
                              </div>
                              <span className="text-[9px] text-amber-700 font-extrabold font-mono">
                                {classStats.highestAverage.toFixed(1)}% Average
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top Three Podium Leaderboard */}
                        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-xs flex flex-col justify-between">
                          <div>
                            <h4 className="text-[10px] font-bold text-[#5c061c] uppercase tracking-wider font-mono mb-2.5 flex items-center gap-1.5">
                              <Award size={12} className="text-amber-500" />
                              <span>Top Three (Class Podium)</span>
                            </h4>
                            {classStats.topThree.length > 0 ? (
                              <div className="space-y-2">
                                {classStats.topThree.map((item, idx) => (
                                  <div 
                                    key={item.student?.id || idx} 
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] font-mono shrink-0 ${
                                        idx === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                        idx === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                                        'bg-orange-100 text-orange-700 border border-orange-200'
                                      }`}>
                                        {idx + 1}
                                      </span>
                                      <img 
                                        src={item.student?.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                                        alt="" 
                                        className="w-5.5 h-5.5 rounded-md object-cover shrink-0" 
                                      />
                                      <span className="text-xs font-bold text-slate-800 truncate">{item.student?.name || 'Unknown Student'}</span>
                                    </div>
                                    <span className="text-[10px] font-extrabold text-slate-600 font-mono shrink-0">
                                      {item.averageScore.toFixed(2)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 font-mono italic">No podium calculated yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-xl border border-slate-200/65 text-center text-slate-400 font-medium text-xs">
                        No recorded student scores have been submitted yet for {selectedClassEntry} ({selectedTerm}). Enter and save student results below to automatically generate class positions and performance analytics.
                      </div>
                    )}
                  </div>

                  {/* Student list matching class filters */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                        Students in {selectedClassEntry} ({students.filter(s => s.classId === selectedClassEntry).length} registered)
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50/30 text-slate-400 font-mono uppercase tracking-wider text-[9px] border-b border-slate-200">
                            <th className="py-3 px-4 font-bold">Student Info</th>
                            <th className="py-3 px-4 font-bold">Registration</th>
                            <th className="py-3 px-4 font-bold text-center">Score Sheet State</th>
                            <th className="py-3 px-4 font-bold text-center">Total Score // Average</th>
                            <th className="py-3 px-4 font-bold text-center">Dynamic Position</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.filter(s => s.classId === selectedClassEntry).length > 0 ? (
                            students.filter(s => s.classId === selectedClassEntry).map(std => {
                              // Find if result already exists
                              const res = results.find(
                                r => r.studentId === std.id && r.sessionId === selectedSessionId && r.term === selectedTerm
                              );
                              const position = res ? calculatedPositions[res.id] || '-' : '-';

                              return (
                                <tr key={std.id} className="hover:bg-slate-50/30 transition-colors">
                                  
                                  {/* Student Name */}
                                  <td className="py-3.5 px-4 font-bold text-slate-800">
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={std.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                                        alt={std.name} 
                                        className="h-7 w-7 rounded-md object-cover" 
                                      />
                                      <span>{std.name}</span>
                                    </div>
                                  </td>

                                  {/* Reg number */}
                                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{std.regNo}</td>

                                  {/* Status indicator */}
                                  <td className="py-3.5 px-4 text-center">
                                    {res ? (
                                      res.isPublished ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                                          <CheckCircle size={10} /> Published
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                                          <Clock size={10} /> Draft Saved
                                        </span>
                                      )
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-semibold">
                                        No Record Entries
                                      </span>
                                    )}
                                  </td>

                                  {/* Grades totals */}
                                  <td className="py-3.5 px-4 text-center">
                                    {res ? (
                                      <div>
                                        <span className="font-bold text-slate-800">{res.totalScore}</span>
                                        <span className="text-slate-400 text-[10px] font-mono ml-2">({res.averageScore.toFixed(1)}%)</span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>

                                  {/* Dynamic Ranking */}
                                  <td className="py-3.5 px-4 text-center font-extrabold text-amber-600 text-sm">
                                    {res ? (res.positionOverride || getOrdinalSuffix(position)) : '-'}
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {res && (
                                        <button
                                          onClick={() => handleToggleResultPublication(res.id, res.isPublished)}
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                            res.isPublished 
                                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                                              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                          }`}
                                        >
                                          {res.isPublished ? 'Unpublish' : 'Publish Result'}
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleOpenSmsDialog(std.name, std.regNo, std.pin, std.guardianPhone)}
                                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
                                        title="Send PIN via SMS"
                                      >
                                        <Send size={11} />
                                      </button>
                                      <button
                                        id={`admin-grade-${std.id}`}
                                        onClick={() => handleSelectStudentForGrades(std)}
                                        className="px-3 py-1 bg-[#5c061c] text-white font-bold rounded-lg hover:bg-[#720a25] transition-all cursor-pointer text-[10px] shrink-0"
                                      >
                                        {res ? 'Edit Marks' : 'Enter Scores'}
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                                No registered students in {selectedClassEntry} department. Register students in this class first.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                // VIEW 3B: DETAILED SCORE SHEET GRID ENTRY
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={activeStudentForGrades.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                        alt="" 
                        className="h-12 w-12 rounded-xl object-cover" 
                      />
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Entering Scores: {activeStudentForGrades.name}</h2>
                        <p className="text-xs text-slate-500 font-mono">
                          {activeStudentForGrades.regNo} // {activeStudentForGrades.classId} // {selectedTerm} ({sessions.find(s => s.id === selectedSessionId)?.name})
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveStudentForGrades(null)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Back to Directory
                    </button>
                  </div>

                  {/* Mark Sheet entry grid */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2">Academic Subject Marksheet (CA Max: 40 // Exam Max: 70)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Form scores inputs */}
                      <div className="space-y-4">
                        {subjects.filter(s => s.classes.includes(activeStudentForGrades.classId)).length > 0 ? (
                          subjects.filter(s => s.classes.includes(activeStudentForGrades.classId)).map(sub => {
                            const scores = temporaryScores[sub.id] || { ca: 0, exam: 0 };
                            const total = scores.ca + scores.exam;
                            const grading = getGradeForScore(total, gradingRules);

                            return (
                              <div key={sub.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                                <div className="flex-grow min-w-0">
                                  <span className="font-extrabold text-slate-800 truncate block text-xs">{sub.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">{sub.code}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs shrink-0">
                                  <div className="w-16">
                                    <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">CA Score</span>
                                    <input 
                                      type="number" 
                                      max={40}
                                      min={0}
                                      value={scores.ca || ''}
                                      placeholder="0"
                                      onChange={(e) => handleScoreChange(sub.id, 'ca', parseInt(e.target.value))}
                                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-700"
                                    />
                                  </div>

                                  <div className="w-16">
                                    <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Exam Score</span>
                                    <input 
                                      type="number" 
                                      max={70}
                                      min={0}
                                      value={scores.exam || ''}
                                      placeholder="0"
                                      onChange={(e) => handleScoreChange(sub.id, 'exam', parseInt(e.target.value))}
                                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-700"
                                    />
                                  </div>

                                  <div className="w-12 text-center">
                                    <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Total</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{total}</span>
                                  </div>

                                  <div className="w-10 text-center">
                                    <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Grade</span>
                                    <span className="font-extrabold text-[#5c061c] text-sm">{grading.grade}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center p-6 text-slate-400">
                            No subjects registered for {activeStudentForGrades.classId}. Assign subjects under the Subject tab first.
                          </div>
                        )}
                      </div>

                      {/* Remarks and General metrics column */}
                      <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold uppercase font-mono text-slate-400 mb-2 tracking-wide border-b border-slate-200 pb-1.5">Assessment Remarks & Attendance</h4>
                        
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Class Teacher Remarks</label>
                          <textarea 
                            rows={3}
                            value={teacherRemark}
                            onChange={(e) => setTeacherRemark(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#5c061c] focus:outline-none focus:border-[#5c061c] text-slate-800"
                            placeholder="Type tutor remarks..."
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Principal Appraisal / Comments</label>
                          <textarea 
                            rows={3}
                            value={principalRemark}
                            onChange={(e) => setPrincipalRemark(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#5c061c] focus:outline-none focus:border-[#5c061c] text-slate-800"
                            placeholder="Type administration remarks..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Attendance Days</label>
                            <input 
                              type="number"
                              value={attendanceDays}
                              onChange={(e) => setAttendanceDays(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                              placeholder="95"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Class Position (Override)</label>
                            <input 
                              type="text"
                              value={positionOverride}
                              onChange={(e) => setPositionOverride(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                              placeholder="e.g. First, Second, 1st, 2nd"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2.5">
                          <button
                            id="admin-save-draft-btn"
                            onClick={() => handleSaveResult(false)}
                            className="flex-grow px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save size={14} />
                            <span>Save as Draft</span>
                          </button>
                          
                          <button
                            id="admin-publish-result-btn"
                            onClick={() => handleSaveResult(true)}
                            className="flex-grow px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check size={14} />
                            <span>Publish to Student</span>
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: SUBJECT MANAGER */}
          {/* ========================================================== */}
          {activeTab === 'subjects' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Academic Curriculum & Subjects</h2>
                  <p className="text-xs text-slate-500">Configure scholastic subjects and map them to appropriate classes (SS1 - SS3 Arts & Science branches).</p>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedSubjectForEdit(null);
                    setNewSubjectName('');
                    setNewSubjectCode('');
                    setNewSubjectClasses([]);
                    setShowSubjectModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Create Subject</span>
                </button>
              </div>

              {/* Subject list representation */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-3 px-4 font-bold">Subject Name</th>
                        <th className="py-3 px-4 font-bold">Subject Code</th>
                        <th className="py-3 px-4 font-bold">Assigned School Classes</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subjects.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-3 px-4 font-extrabold text-slate-800 text-sm">
                            {sub.name}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-600">
                            {sub.code}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {sub.classes.map(c => (
                                <span key={c} className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 border border-slate-200/50">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditSubject(sub)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg hover:border-slate-200 transition-all cursor-pointer"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg hover:border-red-100 transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: PORTAL SETTINGS (SESSIONS & GRADING RULES) */}
          {/* ========================================================== */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Settings column: Academic Sessions */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Academic Session Setup */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#5c061c] flex items-center gap-1.5">
                    <Globe size={16} />
                    <span>Manage Academic Calendar Years</span>
                  </h3>
                  <p className="text-xs text-slate-500">Configure academic sessions and activate the active terminal session.</p>

                  <form onSubmit={handleAddSession} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. 2026/2027" 
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#5c061c]"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Add Year
                    </button>
                  </form>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50">
                    {sessions.map(s => (
                      <div key={s.id} className="p-3 flex items-center justify-between hover:bg-white transition-colors">
                        <div>
                          <span className="font-extrabold text-slate-800">{s.name}</span>
                          {s.isCurrent && (
                            <span className="ml-2 px-2 py-0.2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[8px] font-bold uppercase rounded-full">
                              Active
                            </span>
                          )}
                        </div>

                        {!s.isCurrent && (
                          <button
                            onClick={() => handleMakeSessionCurrent(s.id)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-[#5c061c] hover:text-white text-slate-600 font-semibold text-[10px] transition-all cursor-pointer"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Help Desk card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-amber-600">Admin Guidelines</h4>
                  <ul className="space-y-2 text-xs text-slate-500 list-disc list-inside leading-relaxed">
                    <li>Students cannot view results if they are stored in <strong>Draft State</strong>.</li>
                    <li>Always make sure subjects are appropriately assigned to class branches before entering CA marks.</li>
                    <li>The system computes positions out of all registered students dynamically inside that active group subset.</li>
                  </ul>
                </div>

              </div>

              {/* Right Settings column: Grading Rules */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-[#5c061c] flex items-center gap-1.5">
                    <Sliders className="text-[#5c061c]" size={16} />
                    <span>Configurable Grading Rules Scale</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setModalState({
                        type: 'confirm',
                        isOpen: true,
                        title: 'Restore Grading Rules',
                        message: 'Are you sure you want to restore default West African standard grading rules (A1 - F9)? Any custom bands will be reset.',
                        onConfirm: () => {
                          onUpdateGradingRules([
                            { grade: 'A1', minScore: 75, maxScore: 100, remark: 'Excellent' },
                            { grade: 'B2', minScore: 70, maxScore: 74, remark: 'Very Good' },
                            { grade: 'B3', minScore: 65, maxScore: 69, remark: 'Good' },
                            { grade: 'C4', minScore: 60, maxScore: 64, remark: 'Credit' },
                            { grade: 'C5', minScore: 55, maxScore: 59, remark: 'Credit' },
                            { grade: 'C6', minScore: 50, maxScore: 54, remark: 'Credit' },
                            { grade: 'D7', minScore: 45, maxScore: 49, remark: 'Pass' },
                            { grade: 'E8', minScore: 40, maxScore: 44, remark: 'Pass' },
                            { grade: 'F9', minScore: 0, maxScore: 39, remark: 'Fail' }
                          ]);
                          onAddNotification('Grading Default Restored', 'Reverted scoring metrics to WAEC standard configuration', 'info');
                        }
                      });
                    }}
                    className="text-[10px] text-amber-600 font-bold hover:underline cursor-pointer"
                  >
                    Restore Standard Rules
                  </button>
                </div>
                
                <p className="text-xs text-slate-500">Edit the numeric score bands below. A student\'s overall grade and remarks will instantly reflect changes in real time.</p>

                <div className="space-y-3 pt-2">
                  {gradingRules.map((rule, idx) => (
                    <div key={rule.grade} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                      <div className="w-12 text-center font-extrabold text-[#5c061c] text-sm">
                        {rule.grade}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Min Mark</span>
                          <input 
                            type="number" 
                            value={rule.minScore}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              onUpdateGradingRules(gradingRules.map((gr, rIdx) => rIdx === idx ? { ...gr, minScore: val } : gr));
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-700"
                          />
                        </div>

                        <div className="w-16">
                          <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Max Mark</span>
                          <input 
                            type="number" 
                            value={rule.maxScore}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              onUpdateGradingRules(gradingRules.map((gr, rIdx) => rIdx === idx ? { ...gr, maxScore: val } : gr));
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        <span className="text-[9px] text-slate-400 font-mono font-semibold block mb-0.5">Remark Description</span>
                        <input 
                          type="text" 
                          value={rule.remark}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateGradingRules(gradingRules.map((gr, rIdx) => rIdx === idx ? { ...gr, remark: val } : gr));
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 6: PIN RETRIEVAL & SUPPORT REQUESTS */}
          {/* ========================================================== */}
          {activeTab === 'pinRequests' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-[24px] md:text-[28px] font-bold text-slate-800 tracking-[-0.02em] leading-[1.2]">PIN Retrieval Help Desk</h2>
                  <p className="text-[14px] font-normal leading-[1.6] text-slate-500">Review and resolve forgotten PIN assistance requests submitted by students.</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Total Received</span>
                    <span className="text-[28px] font-extrabold text-slate-800">{(pinResetRequests || []).length}</span>
                  </div>
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                    <FileText size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Pending Resolution</span>
                    <span className="text-[28px] font-extrabold text-red-600">{(pinResetRequests || []).filter(r => r.status === 'pending').length}</span>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                    <Clock size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Resolved Tickets</span>
                    <span className="text-[28px] font-extrabold text-emerald-600">{(pinResetRequests || []).filter(r => r.status === 'resolved').length}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle size={20} />
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={14} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search by student name or reg number..."
                    value={pinRequestsSearch}
                    onChange={(e) => setPinRequestsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5c061c]"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                  <button
                    onClick={() => setPinRequestsFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      pinRequestsFilter === 'all' ? 'bg-[#5c061c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    All Tickets
                  </button>
                  <button
                    onClick={() => setPinRequestsFilter('pending')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      pinRequestsFilter === 'pending' ? 'bg-red-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setPinRequestsFilter('resolved')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      pinRequestsFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    onClick={() => setPinRequestsFilter('sms_logs')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                      pinRequestsFilter === 'sms_logs' ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <History size={12} />
                    <span>SMS Dispatch History</span>
                  </button>
                </div>
              </div>

              {/* List View */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  {pinRequestsFilter === 'sms_logs' ? (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono font-bold border-b border-slate-200">
                          <th className="p-4">Recipient Phone</th>
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Reg Number</th>
                          <th className="p-4">Access PIN</th>
                          <th className="p-4">SMS Message Content</th>
                          <th className="p-4">Dispatch Status</th>
                          <th className="p-4">Dispatched At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {smsSentLogs
                          .filter(log => 
                            log.name.toLowerCase().includes(pinRequestsSearch.toLowerCase()) ||
                            log.regNo.toLowerCase().includes(pinRequestsSearch.toLowerCase()) ||
                            log.phone.includes(pinRequestsSearch)
                          )
                          .map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-mono font-bold text-slate-800">{log.phone}</td>
                              <td className="p-4 font-bold text-slate-700">{log.name}</td>
                              <td className="p-4 font-mono font-bold text-[#5c061c]">{log.regNo}</td>
                              <td className="p-4 font-mono">
                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 font-bold border border-amber-200 rounded text-[10px]">
                                  {log.pin}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 max-w-xs truncate" title={log.body}>{log.body}</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                  {log.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-400 font-mono text-[10px]">{log.sentAt}</td>
                            </tr>
                          ))}
                        {smsSentLogs.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              No SMS messages have been dispatched yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono font-bold border-b border-slate-200">
                          <th className="p-4">Reg Number</th>
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Guardian Contact</th>
                          <th className="p-4">Message / Reason</th>
                          <th className="p-4">Submitted At</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(pinResetRequests || [])
                          .filter(r => {
                            const searchMatch = 
                              r.studentName.toLowerCase().includes(pinRequestsSearch.toLowerCase()) || 
                              r.regNo.toLowerCase().includes(pinRequestsSearch.toLowerCase());
                            
                            if (pinRequestsFilter === 'pending') return r.status === 'pending' && searchMatch;
                            if (pinRequestsFilter === 'resolved') return r.status === 'resolved' && searchMatch;
                            return searchMatch;
                          })
                          .sort((a, b) => b.id.localeCompare(a.id))
                          .map(req => {
                            const studentInDB = students.find(s => s.regNo.toUpperCase() === req.regNo.toUpperCase());

                            return (
                              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-mono font-extrabold text-slate-800">{req.regNo}</td>
                                <td className="p-4 font-semibold text-slate-700">
                                  <div className="flex flex-col">
                                    <span>{req.studentName}</span>
                                    {studentInDB ? (
                                      <span className="text-[10px] text-emerald-600 font-medium">Verified student in class {studentInDB.classId}</span>
                                    ) : (
                                      <span className="text-[10px] text-red-500 font-medium">Unregistered / Typo in Reg Number</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-slate-500">{req.contactInfo}</td>
                                <td className="p-4 text-slate-500 max-w-xs truncate" title={req.message}>{req.message}</td>
                                <td className="p-4 text-slate-400 font-mono text-[10px]">{req.createdAt}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    req.status === 'pending' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  }`}>
                                    {req.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {req.status === 'pending' ? (
                                      <>
                                        <button
                                          onClick={() => handleResolvePinRequest(req.id, 'keep_pin')}
                                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-[10px] cursor-pointer transition-colors"
                                          title="Retrieve current student PIN and mark request resolved"
                                        >
                                          Show PIN
                                        </button>
                                        <button
                                          onClick={() => handleResolvePinRequest(req.id, 'regenerate')}
                                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] cursor-pointer transition-colors"
                                          title="Generate a brand new random PIN and resolve"
                                        >
                                          Reset & Resolve
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-mono italic text-[10px]">Resolved {req.resolvedAt?.split(' ')[0]}</span>
                                    )}
                                    <button
                                      onClick={() => handleDeletePinRequest(req.id)}
                                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 cursor-pointer"
                                      title="Purge Ticket"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {(pinResetRequests || []).length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              No PIN retrieval help requests currently in queue.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
                <div>
                  <h2 className="text-[24px] md:text-[28px] font-bold text-slate-800 tracking-[-0.02em] leading-[1.2]">Portal Announcements</h2>
                  <p className="text-[16px] font-normal leading-[1.6] text-slate-500">Post notifications and announcements shown directly on the student landing portal page.</p>
                </div>
              </div>

              {/* Banner Image added after the heading, matching modern_learning_space */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm bg-white p-2">
                <img 
                  src={bannerClassroom} 
                  alt="Ido Classroom Modern Learning Space" 
                  className="w-full h-44 sm:h-56 md:h-64 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Post New Announcement Form */}
                <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3 font-mono uppercase tracking-wider">
                    <Plus size={16} className="text-[#5c061c]" />
                    <span>Create Announcement</span>
                  </h3>
                  <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider font-mono">Announcement Title</label>
                      <input 
                        type="text"
                        placeholder="e.g., Important: Term 3 Fee Payment"
                        value={newAnnTitle}
                        onChange={(e) => setNewAnnTitle(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-800"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider font-mono">Content / Message</label>
                      <textarea 
                        rows={5}
                        placeholder="Type the message body here..."
                        value={newAnnContent}
                        onChange={(e) => setNewAnnContent(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-800 leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider font-mono">Badge/Category</label>
                      <select 
                        value={newAnnCategory}
                        onChange={(e) => setNewAnnCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-800"
                      >
                        <option value="general">General</option>
                        <option value="academic">Academic</option>
                        <option value="holiday">Holiday</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase font-mono tracking-wider"
                    >
                      <Send size={14} />
                      <span>Publish Announcement</span>
                    </button>
                  </form>
                </div>

                {/* Announcement History / List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 bg-slate-50/70 border-b border-slate-200/60 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Current Live Announcements ({announcements.length})</h3>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-y-auto max-h-[480px]">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-4 sm:p-5 hover:bg-slate-50/40 transition-colors flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 uppercase font-mono">{ann.category}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-semibold">{ann.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">{ann.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{ann.content}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this announcement from the public portal?')) {
                              onUpdateAnnouncements(announcements.filter(a => a.id !== ann.id));
                              onAddNotification('Announcement Removed', `"${ann.title}" has been deleted from the public board.`, 'info');
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Announcement"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="p-12 text-center text-slate-400 space-y-2">
                        <Bell className="mx-auto text-slate-300" size={32} />
                        <p className="text-xs font-bold">No live portal announcements.</p>
                        <p className="text-[11px] text-slate-400 font-medium">Create one using the form on the left to push news to the landing page.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================== */}
      {/* MODAL 1: ADD NEW STUDENT REGISTER */}
      {/* ========================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 relative animate-fadeIn">
            <div className="p-1 bg-[#5c061c]"></div>
            
            <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Users className="text-[#5c061c]" />
                <span>Register New Admission</span>
              </h3>
              <button 
                onClick={() => setShowAddStudentModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-5 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Student Name (Last, First Middle)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Adebayo Emmanuel Chinedu"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#5c061c]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Registration No.</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CSS/IDO/2026/015"
                    value={newStudentReg}
                    onChange={(e) => setNewStudentReg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#5c061c] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Student Gender</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => {
                      const gen = e.target.value as 'Male' | 'Female';
                      setNewStudentGender(gen);
                      // Automatically set blank profile avatar matching gender
                      setNewStudentAvatar(gen === 'Male' ? STUDENT_AVATARS.male : STUDENT_AVATARS.female);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Class Assigned</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => {
                      const val = e.target.value as StudentClass;
                      setNewStudentClass(val);
                      if (val.startsWith('SS1')) {
                        setNewStudentDept('General');
                      } else if (val.endsWith('Science')) {
                        setNewStudentDept('Science');
                      } else if (val.endsWith('Arts')) {
                        setNewStudentDept('Arts');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="SS1A">SS1A</option>
                    <option value="SS1B">SS1B</option>
                    <option value="SS2 Science">SS2 Science</option>
                    <option value="SS2 Arts">SS2 Arts</option>
                    <option value="SS3 Science">SS3 Science</option>
                    <option value="SS3 Arts">SS3 Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                  <select
                    value={newStudentDept}
                    onChange={(e) => setNewStudentDept(e.target.value as 'Science' | 'Arts' | 'General')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Guardian / Parent Name</label>
                  <input 
                    type="text" 
                    placeholder="Chief James Adebayo"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Guardian Phone No.</label>
                  <input 
                    type="text" 
                    placeholder="+234 803 000 0000"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Avatar Selector Portrait */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-500 mb-2">Portrait Passport Photograph</label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-[#5c061c] bg-slate-50 flex items-center justify-center shrink-0">
                    <img src={newStudentAvatar} alt="Profile preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 block font-mono uppercase">Assigned Automatically</span>
                    <p className="text-[10px] text-slate-400 font-medium">A pristine, blank profile avatar is matched to student's gender.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Confirm Register
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: EDIT STUDENT INFO */}
      {/* ========================================================== */}
      {showEditStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 relative animate-fadeIn">
            <div className="p-1 bg-[#5c061c]"></div>
            
            <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Edit className="text-[#5c061c]" />
                <span>Modify Student Records</span>
              </h3>
              <button 
                onClick={() => { setShowEditStudentModal(false); setSelectedStudentForEdit(null); }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditStudentSave} className="p-5 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Student Name</label>
                  <input 
                    type="text" 
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Registration No.</label>
                  <input 
                    type="text" 
                    value={newStudentReg}
                    onChange={(e) => setNewStudentReg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => {
                      const gen = e.target.value as 'Male' | 'Female';
                      setNewStudentGender(gen);
                      // Automatically set matching blank profile avatar based on gender
                      setNewStudentAvatar(gen === 'Male' ? STUDENT_AVATARS.male : STUDENT_AVATARS.female);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Class Assigned</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => {
                      const val = e.target.value as StudentClass;
                      setNewStudentClass(val);
                      if (val.startsWith('SS1')) {
                        setNewStudentDept('General');
                      } else if (val.endsWith('Science')) {
                        setNewStudentDept('Science');
                      } else if (val.endsWith('Arts')) {
                        setNewStudentDept('Arts');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="SS1A">SS1A</option>
                    <option value="SS1B">SS1B</option>
                    <option value="SS2 Science">SS2 Science</option>
                    <option value="SS2 Arts">SS2 Arts</option>
                    <option value="SS3 Science">SS3 Science</option>
                    <option value="SS3 Arts">SS3 Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                  <select
                    value={newStudentDept}
                    onChange={(e) => setNewStudentDept(e.target.value as 'Science' | 'Arts' | 'General')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Guardian Name</label>
                  <input 
                    type="text" 
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Guardian Phone No.</label>
                  <input 
                    type="text" 
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Passport edit photo */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-500 mb-2">Portrait Passport Photo</label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-[#5c061c] bg-slate-50 flex items-center justify-center shrink-0">
                    <img src={newStudentAvatar} alt="Profile preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 block font-mono uppercase">Assigned Automatically</span>
                    <p className="text-[10px] text-slate-400 font-medium">A pristine, blank profile avatar is matched to student's gender.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => { setShowEditStudentModal(false); setSelectedStudentForEdit(null); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2B: CLASS TRANSITION & PROMOTION CENTER */}
      {/* ========================================================== */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative animate-fadeIn">
            <div className="p-1 bg-amber-500"></div>
            
            <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-amber-500" />
                <span>Class Transition & Promotion Center</span>
              </h3>
              <button 
                onClick={() => setShowPromotionModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">
                Execute school-wide transition cycles. Promote senior secondary classes or stream incoming students into specialized academic paths.
              </p>
              
              {/* Pathway select tabs */}
              <div className="flex gap-2 mt-4 bg-slate-200/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedPromoPathway('ss2_science')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPromoPathway === 'ss2_science' 
                      ? 'bg-[#5c061c] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-white/40'
                  }`}
                >
                  SS2 Science ➔ SS3 Science
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPromoPathway('ss2_arts')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPromoPathway === 'ss2_arts' 
                      ? 'bg-[#5c061c] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-white/40'
                  }`}
                >
                  SS2 Arts ➔ SS3 Arts
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPromoPathway('ss1_transition')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPromoPathway === 'ss1_transition' 
                      ? 'bg-[#5c061c] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-white/40'
                  }`}
                >
                  SS1 ➔ SS2 Streaming
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 max-h-[380px] overflow-y-auto space-y-4">
              {/* 1. SS2 Science promotion stream list */}
              {selectedPromoPathway === 'ss2_science' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-medium">
                    Select eligible SS2 Science students to promote to SS3 Science. Their department remains Science.
                  </div>
                  
                  {students.filter(s => s.classId === 'SS2 Science').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No students currently registered in SS2 Science.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      {students.filter(s => s.classId === 'SS2 Science').map(s => (
                        <div key={s.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                          <label className="flex items-center gap-3 cursor-pointer select-none font-semibold text-slate-700 flex-grow">
                            <input 
                              type="checkbox"
                              checked={!!promoSelectedStudents[s.id]}
                              onChange={(e) => setPromoSelectedStudents(prev => ({ ...prev, [s.id]: e.target.checked }))}
                              className="rounded text-[#5c061c] focus:ring-[#5c061c] h-4 w-4 cursor-pointer"
                            />
                            <span>{s.name} <span className="text-[10px] text-slate-400 font-mono">({s.regNo})</span></span>
                          </label>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold text-[10px] uppercase">SS2 Science</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. SS2 Arts promotion stream list */}
              {selectedPromoPathway === 'ss2_arts' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-medium">
                    Select eligible SS2 Arts students to promote to SS3 Arts. Their department remains Arts.
                  </div>
                  
                  {students.filter(s => s.classId === 'SS2 Arts').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No students currently registered in SS2 Arts.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      {students.filter(s => s.classId === 'SS2 Arts').map(s => (
                        <div key={s.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                          <label className="flex items-center gap-3 cursor-pointer select-none font-semibold text-slate-700 flex-grow">
                            <input 
                              type="checkbox"
                              checked={!!promoSelectedStudents[s.id]}
                              onChange={(e) => setPromoSelectedStudents(prev => ({ ...prev, [s.id]: e.target.checked }))}
                              className="rounded text-[#5c061c] focus:ring-[#5c061c] h-4 w-4 cursor-pointer"
                            />
                            <span>{s.name} <span className="text-[10px] text-slate-400 font-mono">({s.regNo})</span></span>
                          </label>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold text-[10px] uppercase">SS2 Arts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. SS1 to SS2 Stream specializing list */}
              {selectedPromoPathway === 'ss1_transition' && (
                <div className="space-y-3">
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 text-xs font-medium">
                    SS1 students choose between Science and Arts when entering SS2. Select the target SS2 class stream for each SS1 student below.
                  </div>
                  
                  {students.filter(s => s.classId.startsWith('SS1')).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No students currently registered in SS1A or SS1B.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100">
                      {students.filter(s => s.classId.startsWith('SS1')).map(s => (
                        <div key={s.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <input 
                              type="checkbox"
                              checked={!!promoSelectedStudents[s.id]}
                              onChange={(e) => setPromoSelectedStudents(prev => ({ ...prev, [s.id]: e.target.checked }))}
                              className="rounded text-[#5c061c] focus:ring-[#5c061c] h-4 w-4 mt-0.5 cursor-pointer"
                            />
                            <div>
                              <span className="font-bold text-slate-700 block">{s.name}</span>
                              <div className="flex gap-1.5 items-center mt-1">
                                <span className="text-[10px] text-slate-400 font-mono">({s.regNo})</span>
                                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded text-[9px] font-bold font-mono">Current: {s.classId}</span>
                              </div>
                            </div>
                          </div>
                          
                          {promoSelectedStudents[s.id] && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Target:</span>
                              <select
                                value={ss1TargetClasses[s.id] || 'SS2 Science'}
                                onChange={(e) => setSs1TargetClasses(prev => ({ ...prev, [s.id]: e.target.value as any }))}
                                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                              >
                                <option value="SS2 Science">SS2 Science (Science Dept)</option>
                                <option value="SS2 Arts">SS2 Arts (Arts Dept)</option>
                                <option value="remain">Do Not Promote (Remain in SS1)</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowPromotionModal(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleExecutePromotion}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-[#5c061c] rounded-xl font-bold shadow-md cursor-pointer text-xs flex items-center gap-1.5"
              >
                <TrendingUp size={14} />
                <span>Execute Student Transition</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: SUBJECT MANAGEMENT (ADD / EDIT) */}
      {/* ========================================================== */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative animate-fadeIn">
            <div className="p-1 bg-[#5c061c]"></div>
            
            <div className="p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-[#5c061c]" size={18} />
                <span>{selectedSubjectForEdit ? 'Edit Curricular Subject' : 'Create Curricular Subject'}</span>
              </h3>
              <button 
                onClick={() => { setShowSubjectModal(false); setSelectedSubjectForEdit(null); }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-5 space-y-4 text-xs">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Further Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. FMTH"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  required
                />
              </div>

              {/* Class list checkbox mappings */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Assign to School Classes</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {([
                    'SS1A',
                    'SS1B',
                    'SS2 Science',
                    'SS2 Arts',
                    'SS3 Science',
                    'SS3 Arts'
                  ] as StudentClass[]).map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={newSubjectClasses.includes(c)}
                        onChange={() => handleToggleClassForSubject(c)}
                        className="rounded text-[#5c061c] focus:ring-[#5c061c] h-3.5 w-3.5"
                      />
                      <span className="font-semibold text-slate-600">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowSubjectModal(false); setSelectedSubjectForEdit(null); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {selectedSubjectForEdit ? 'Save Settings' : 'Create Subject'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: SMS PIN DISPATCH CLIENT */}
      {/* ========================================================== */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 relative animate-fadeIn flex flex-col">
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#5c061c] to-amber-500 shrink-0"></div>
            
            <div className="p-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Send className="text-[#5c061c]" size={18} />
                <span>Guardian SMS PIN Dispatcher</span>
              </h3>
              <button 
                onClick={() => setShowSmsModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
                disabled={isSendingSms}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* Student Metadata Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>STUDENT ID CARD RE-ISSUE</span>
                  <span className="font-bold text-[#5c061c]">{smsStudentReg}</span>
                </div>
                <div className="text-slate-800 font-bold text-sm">{smsStudentName}</div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Access PIN:</span>
                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-mono font-extrabold text-xs rounded-md flex items-center gap-1">
                    <Key size={10} />
                    {smsPin}
                  </span>
                </div>
              </div>

              {/* SANDBOX / SIMULATOR ALERT */}
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Sandbox Gateway Active</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
                  This system is in a secure web sandboxed environment. PIN SMS dispatches are fully simulated, validated, and logged in the <strong>SMS Dispatch History</strong> tab of the admin panel. No physical mobile messages are transmitted to real carrier devices in this preview.
                </p>
              </div>

              {/* Recipient Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Guardian Mobile Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone size={14} />
                  </span>
                  <input 
                    type="tel" 
                    placeholder="e.g. +234 803 123 4567"
                    value={smsRecipientPhone}
                    onChange={(e) => setSmsRecipientPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-900"
                    required
                    disabled={isSendingSms}
                  />
                </div>
                {!smsRecipientPhone && (
                  <p className="text-[10px] text-rose-500 font-semibold">⚠️ Guardian phone number not saved in registry. Please enter manually.</p>
                )}
                {smsRecipientPhone && (
                  <p className="text-[10px] text-slate-400">Ready to dispatch via standard school SMS gateway route.</p>
                )}
              </div>

              {/* Text Message Content */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Custom SMS Message Content</label>
                <textarea 
                  rows={4}
                  value={smsBody}
                  onChange={(e) => setSmsBody(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-800 leading-relaxed"
                  required
                  disabled={isSendingSms}
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Characters: {smsBody.length}</span>
                  <span>Est. Billing: {Math.ceil(smsBody.length / 160)} SMS units</span>
                </div>
              </div>

              {/* simulated Gateway status */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className={`h-2 w-2 rounded-full ${isSendingSms ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  {isSendingSms ? 'Dispatching Message...' : 'SMS Gateway Active (98% signal)'}
                </span>
                <span className="font-mono">Route ID: ISS-NGR-4493</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer transition-colors"
                  disabled={isSendingSms}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSendingSms ? 'bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  disabled={isSendingSms}
                >
                  {isSendingSms ? (
                    <>
                      <Clock size={14} className="animate-spin" />
                      <span>Sending PIN...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Dispatch PIN SMS</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* GLOBAL MODAL: CUSTOM ALERT / CONFIRM DIALOG */}
      {/* ========================================================== */}
      {modalState?.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative animate-fadeIn">
            <div className="p-1 bg-[#5c061c]"></div>
            
            <div className="p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <AlertCircle className="text-[#5c061c]" size={18} />
                <span>{modalState.title}</span>
              </h3>
              <button 
                onClick={() => setModalState(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-slate-600 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-semibold">
                {modalState.message}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                {modalState.type === 'confirm' ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => setModalState(null)}
                      className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (modalState.onConfirm) modalState.onConfirm();
                        setModalState(null);
                      }}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md cursor-pointer text-xs"
                    >
                      Confirm Action
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setModalState(null)}
                    className="px-5 py-2 bg-[#5c061c] hover:bg-[#720a25] text-white rounded-xl font-bold shadow-md cursor-pointer text-xs"
                  >
                    Close Dialog
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Internal School Badge Icon SVG
const SchoolBadge = () => (
  <svg className="h-8 w-8 text-amber-400 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#f59e0b" strokeWidth="4"/>
    <path d="M50 20 L25 40 L50 60 L75 40 Z" fill="#5c061c"/>
    <path d="M35 48 L35 70 C35 75 50 82 50 82 C50 82 65 75 65 70 L65 48" fill="none" stroke="#5c061c" strokeWidth="4"/>
    <circle cx="50" cy="40" r="6" fill="#f59e0b"/>
  </svg>
);
