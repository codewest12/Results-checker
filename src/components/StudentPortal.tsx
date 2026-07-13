import React, { useState, useRef, useMemo } from 'react';
import { 
  User, 
  Book, 
  Calendar, 
  Layers, 
  LogOut, 
  Printer, 
  Award, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  FileCheck,
  Download,
  School,
  FileSpreadsheet,
  AlertCircle,
  History,
  BookOpen
} from 'lucide-react';
import { Student, StudentResult, AcademicSession, Term, Subject, GradingRule } from '../types';
import { SchoolEmblem } from './LandingPage';
import { STUDENT_AVATARS } from '../data/mockData';

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
};

interface StudentPortalProps {
  student: Student;
  sessions: AcademicSession[];
  results: StudentResult[];
  subjects: Subject[];
  gradingRules: GradingRule[];
  onLogout: () => void;
}

export default function StudentPortal({
  student,
  sessions,
  results,
  subjects,
  gradingRules,
  onLogout
}: StudentPortalProps) {
  // Filters
  const [selectedSessionId, setSelectedSessionId] = useState(sessions.find(s => s.isCurrent)?.id || sessions[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<Term>('First Term');
  const [isPrinting, setIsPrinting] = useState(false);

  // Active Session details
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  // Retrieve student's result for the selected session and term
  const activeResult = useMemo(() => {
    return results.find(
      r => r.studentId === student.id && r.sessionId === selectedSessionId && r.term === selectedTerm
    );
  }, [results, student.id, selectedSessionId, selectedTerm]);

  // Retrieve all published results for this student across all sessions and terms
  const publishedResults = useMemo(() => {
    return results.filter(r => r.studentId === student.id && r.isPublished);
  }, [results, student.id]);

  // Find all students in the same class, session, and term to know how many total are ranked
  const totalStudentsInClass = useMemo(() => {
    const classResults = results.filter(
      r => r.classId === student.classId && 
           r.sessionId === selectedSessionId && 
           r.term === selectedTerm
    );
    return classResults.length > 0 ? classResults.length : 24;
  }, [results, student.classId, selectedSessionId, selectedTerm]);

  // Trigger print dialog
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  // Export results to CSV spreadsheet
  const handleExportCSV = () => {
    if (!activeResult) return;

    // Prepare rows
    const headers = ['Subject Code', 'Subject Name', 'Continuous Assessment (CA)', 'Exam Score', 'Total Score', 'Grade', 'Remark'];
    const rows = activeResult.scores.map(score => {
      const rule = gradingRules.find(r => score.totalScore >= r.minScore && score.totalScore <= r.maxScore);
      return [
        getSubjectCode(score.subjectId),
        getSubjectName(score.subjectId),
        score.caScore,
        score.examScore,
        score.totalScore,
        score.grade,
        rule?.remark || 'Pass'
      ];
    });

    // Add metadata summary lines to bottom
    const summaryData = [
      [],
      ['Metric', 'Value'],
      ['Student Name', student.name],
      ['Reg No', student.regNo],
      ['Academic Session', activeSession?.name || ''],
      ['Term', activeResult.term],
      ['Class Arm', activeResult.classId],
      ['Total Marks', activeResult.totalScore],
      ['Class Average', `${activeResult.averageScore.toFixed(2)}%`],
      ['Overall Grade', activeResult.overallGrade],
      ['Class Position', activeResult.positionOverride || `${activeResult.classPosition}`],
      ['Teacher Appraisal', activeResult.teacherRemark || ''],
      ['Principal Remark', activeResult.principalRemark || '']
    ];

    const allContent = [headers, ...rows, ...summaryData];

    // Build CSV string
    const csvContent = "data:text/csv;charset=utf-8," 
      + allContent.map(e => e.map(val => {
          // Escape quotes
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    // Clean filename
    const filename = `${student.name.replace(/\s+/g, '_')}_ReportCard_${selectedTerm.replace(/\s+/g, '')}_${activeSession?.name.replace(/\s+/g, '')}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  // Helper to get Subject Name
  const getSubjectName = (subId: string) => {
    return subjects.find(s => s.id === subId)?.name || subId;
  };

  // Helper to get Subject Code
  const getSubjectCode = (subId: string) => {
    return subjects.find(s => s.id === subId)?.code || 'SUB';
  };

  // Determine overall status
  const getStatusColor = (avg: number) => {
    if (avg >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (avg >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 md:py-8 font-sans" id="student-portal-root">
      
      {/* Printable Area Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #student-portal-root {
            padding: 0 !important;
            background: white !important;
          }
          #non-printable-elements {
            display: none !important;
          }
          #printable-report-card {
            display: block !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP BAR / NAVIGATION (Non-printable) */}
        <div id="non-printable-elements" className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <SchoolEmblem className="h-10 w-10" />
            <div>
              <h2 className="text-[24px] md:text-[28px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em]">Student Academic Dashboard</h2>
              <p className="text-[13px] font-normal leading-[1.5] text-slate-500 font-mono">Community Secondary School Ido</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono block">Logged in as</span>
              <span className="text-[16px] font-semibold leading-[1.5] text-slate-800">{student.name}</span>
            </div>
            <button 
              id="student-logout-btn"
              onClick={onLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[16px] font-semibold leading-[1.5] tracking-[0.02em] transition-all flex items-center gap-1.5 border border-rose-100 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out Portal</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: PROFILE & TERM SELECTOR (Non-printable) */}
          <div id="non-printable-elements" className="lg:col-span-4 space-y-6">
            
            {/* Student Profile Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden relative">
              <div className="h-16 bg-[#5c061c]"></div>
              
              <div className="p-6 pt-0 text-center relative">
                {/* Passport photo */}
                <div className="relative -mt-10 mb-4 inline-block">
                  <img 
                    src={student.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                    alt={student.name}
                    className="h-20 w-20 rounded-xl object-cover border-4 border-white shadow-md mx-auto"
                  />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Account"></span>
                </div>

                <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 leading-[1.2] tracking-[-0.02em]">{student.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-red-55 border border-red-100 text-amber-700 text-[13px] font-normal leading-[1.5] font-mono">
                  {student.regNo}
                </span>

                <div className="grid grid-cols-2 gap-3 mt-6 text-left border-t border-slate-100 pt-4 text-[13px] font-normal leading-[1.5]">
                  <div>
                    <span className="text-slate-400 font-mono text-[13px] block">Class Arm</span>
                    <span className="text-[14px] font-semibold leading-[1.5] text-slate-800">{student.classId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[13px] block">Department</span>
                    <span className="text-[14px] font-semibold leading-[1.5] text-slate-800">{student.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[13px] block">Gender</span>
                    <span className="text-[14px] font-semibold leading-[1.5] text-slate-800">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[13px] block">Portal Access</span>
                    <span className="text-[14px] font-semibold leading-[1.5] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Enabled
                    </span>
                  </div>
                </div>

                {student.guardianName && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-left text-[13px] font-normal leading-[1.5] text-slate-600">
                    <span className="text-slate-400 font-mono text-[13px] block mb-1">Guardian Information</span>
                    <div className="text-[14px] font-semibold leading-[1.5] text-slate-800">{student.guardianName}</div>
                    {student.guardianPhone && <div className="text-slate-500 mt-0.5">{student.guardianPhone}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Portal Session / Term Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 space-y-4">
              <h4 className="text-[13px] font-semibold tracking-[0.01em] text-slate-400 uppercase font-mono mb-2">Select Result Period</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[14px] font-medium leading-[1.5] text-slate-500 block mb-1">Academic Year</label>
                  <select 
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[16px] font-normal leading-[1.5] focus:ring-1 focus:ring-[#5c061c] focus:outline-none text-slate-700"
                  >
                    {sessions.map(s => (
                      <option key={s.id} value={s.id}>{s.name} {s.isCurrent ? '(Current Year)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] font-medium leading-[1.5] text-slate-500 block mb-1">Academic Term</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['First Term', 'Second Term', 'Third Term'] as Term[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTerm(t)}
                        className={`px-3 py-2.5 rounded-lg text-left text-[14px] font-medium leading-[1.5] border transition-all flex items-center justify-between ${
                          selectedTerm === t 
                            ? 'bg-[#5c061c]/5 text-[#5c061c] border-[#5c061c]/30' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t}</span>
                        {selectedTerm === t && <span className="h-1.5 w-1.5 rounded-full bg-[#5c061c]"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grading System Guide Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
              <h4 className="text-[13px] font-semibold tracking-[0.01em] text-slate-400 uppercase font-mono mb-3">CSS Ido Grading System</h4>
              <div className="grid grid-cols-3 gap-2">
                {gradingRules.map(rule => (
                  <div key={rule.grade} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <div className="text-[15px] font-semibold leading-[1.5] text-[#5c061c]">{rule.grade}</div>
                    <div className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">{rule.minScore}-{rule.maxScore}</div>
                    <div className="text-[13px] font-normal leading-[1.5] text-slate-500 truncate">{rule.remark}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT VIEW AREA: THE RESULT SHEET */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Action Card: Only visible when result is found & published */}
            {activeResult && activeResult.isPublished && (
              <div id="non-printable-elements" className="bg-gradient-to-r from-[#5c061c] to-[#4a0414] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#5c061c]/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold leading-[1.5]">Your Official Report Card is Ready</h3>
                    <p className="text-[13px] font-normal leading-[1.5] text-slate-300">Published on {activeResult.publishedDate || 'Academic Release Date'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                  <button 
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold leading-[1.5] tracking-[0.02em] rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export Data (CSV)</span>
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#5c061c] text-[14px] font-semibold leading-[1.5] tracking-[0.02em] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={16} />
                    <span>Print Report Card</span>
                  </button>
                </div>
              </div>
            )}

            {/* MAIN PORTAL RESULT DISPLAY AND PRINTABLE CONTAINER */}
            <div 
              id="printable-report-card" 
              className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden"
            >
              
              {activeResult ? (
                activeResult.isPublished ? (
                  // RESULT FOUND AND PUBLISHED
                  <div>
                    
                    {/* Header: School Logo and Address */}
                    <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center relative">
                      {/* Left Badge/Emblem in header */}
                      <div className="absolute top-6 left-6 hidden sm:block">
                        <SchoolEmblem className="h-16 w-16" />
                      </div>
                      
                      <div className="space-y-1">
                        <h2 className="text-[28px] md:text-[36px] font-bold text-[#5c061c] leading-[1.2] tracking-[-0.02em] uppercase">
                          Community Secondary School Ido
                        </h2>
                        <p className="text-[13px] font-normal leading-[1.5] text-slate-500 tracking-wider uppercase">
                          Motto: Knowledge & Character
                        </p>
                        <p className="text-[13px] font-normal leading-[1.5] text-slate-400">
                          School Road, Ido Administrative Area, Rivers State, Nigeria
                        </p>
                        <div className="inline-block mt-2 px-4 py-1.5 bg-[#5c061c]/10 text-[#5c061c] rounded-full text-[13px] font-semibold leading-[1.5] tracking-[0.02em]">
                          OFFICIAL TERMINAL STUDENT REPORT CARD
                        </div>
                      </div>
                    </div>

                    {/* Metadata: Student details & Portrait */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 border-b border-slate-100">
                      
                      {/* Text info (10 columns) */}
                      <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-[13px] font-normal leading-[1.5]">
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase block tracking-wider">Student Name</span>
                          <span className="text-[16px] font-semibold leading-[1.5] text-slate-800">{student.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase tracking-wider block">Registration Number</span>
                          <span className="font-mono text-[16px] font-semibold leading-[1.5] text-slate-800">{student.regNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase tracking-wider block">Academic Session</span>
                          <span className="text-[16px] font-semibold leading-[1.5] text-slate-800">{activeSession?.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase tracking-wider block">Term</span>
                          <span className="text-[16px] font-semibold leading-[1.5] text-[#5c061c]">{activeResult.term}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase tracking-wider block">Class Arm</span>
                          <span className="text-[16px] font-semibold leading-[1.5] text-slate-800">{activeResult.classId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[13px] uppercase tracking-wider block">Department</span>
                          <span className="text-[16px] font-semibold leading-[1.5] text-slate-800">{student.department}</span>
                        </div>
                      </div>

                      {/* Photo info (3 columns) */}
                      <div className="md:col-span-3 flex justify-start md:justify-end items-center">
                        <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-sm inline-block">
                          <img 
                            src={student.gender === 'Female' ? STUDENT_AVATARS.female : STUDENT_AVATARS.male} 
                            alt={student.name} 
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Report Table */}
                    <div className="p-6 sm:p-8">
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-[13px] md:text-[14px] font-normal leading-[1.5]">
                          <thead>
                            <tr className="bg-slate-50 text-[13px] md:text-[15px] font-semibold leading-[1.5] text-slate-500 uppercase border-b border-slate-200">
                              <th className="py-3 px-4 font-bold">Subject</th>
                              <th className="py-3 px-2 font-bold text-center">CA (30/40)</th>
                              <th className="py-3 px-2 font-bold text-center">Exam (60/70)</th>
                              <th className="py-3 px-2 font-bold text-center">Total (100)</th>
                              <th className="py-3 px-2 font-bold text-center">Grade</th>
                              <th className="py-3 px-4 font-bold text-center">Remark</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {activeResult.scores.map((score, index) => {
                              const rule = gradingRules.find(r => score.totalScore >= r.minScore && score.totalScore <= r.maxScore);
                              const isFailure = score.totalScore < 45;
                              return (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-4 font-semibold text-slate-800 text-[13px] md:text-[14px]">
                                    {getSubjectName(score.subjectId)}
                                    <span className="text-[13px] font-normal leading-[1.5] text-slate-400 block sm:inline sm:ml-2">({getSubjectCode(score.subjectId)})</span>
                                  </td>
                                  <td className="py-3.5 px-2 text-center text-slate-600 text-[13px] md:text-[14px] font-medium">{score.caScore}</td>
                                  <td className="py-3.5 px-2 text-center text-slate-600 text-[13px] md:text-[14px] font-medium">{score.examScore}</td>
                                  <td className="py-3.5 px-2 text-center font-bold text-slate-800 text-[13px] md:text-[14px]">{score.totalScore}</td>
                                  <td className={`py-3.5 px-2 text-center font-bold text-[13px] md:text-[14px] ${isFailure ? 'text-rose-600' : 'text-[#5c061c]'}`}>{score.grade}</td>
                                  <td className={`py-3.5 px-4 text-center font-semibold text-[13px] md:text-[14px] ${isFailure ? 'text-rose-500' : 'text-slate-600'}`}>{rule?.remark || 'Pass'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Summary statistics and Remarks */}
                    <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
                      
                      {/* Quick metric cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                          <span className="text-slate-400 text-[13px] font-semibold tracking-wider block uppercase font-mono">Total Marks</span>
                          <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#5c061c] mt-1">{activeResult.totalScore}</div>
                          <span className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Out of {activeResult.scores.length * 100}</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                          <span className="text-slate-400 text-[13px] font-semibold tracking-wider block uppercase font-mono">Class Average</span>
                          <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#5c061c] mt-1">{activeResult.averageScore.toFixed(2)}%</div>
                          <span className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Terminal Mean</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                          <span className="text-slate-400 text-[13px] font-semibold tracking-wider block uppercase font-mono">Overall Grade</span>
                          <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-emerald-600 mt-1">{activeResult.overallGrade}</div>
                          <span className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Performance Class</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                          <span className="text-slate-400 text-[13px] font-semibold tracking-wider block uppercase font-mono">Class Position</span>
                          <div className="text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-amber-600 mt-1">
                            {activeResult.positionOverride || getOrdinalSuffix(activeResult.classPosition)}
                          </div>
                          <span className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">Out of {totalStudentsInClass} Students</span>
                        </div>
                      </div>

                      {/* Remarks and stamps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        
                        <div className="p-4 bg-white rounded-xl border border-slate-200/65 space-y-2">
                          <div className="text-[14px] font-medium leading-[1.5] text-[#5c061c] uppercase border-b border-slate-100 pb-1.5 font-mono">
                            Class Teacher's Appraisal
                          </div>
                          <p className="text-[16px] font-normal leading-[1.6] text-slate-600 italic">
                            &ldquo;{activeResult.teacherRemark || 'No appraisal recorded yet.'}&rdquo;
                          </p>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200/65 space-y-2">
                          <div className="text-[14px] font-medium leading-[1.5] text-amber-600 uppercase border-b border-slate-100 pb-1.5 font-mono">
                            Principal's Final Remark
                          </div>
                          <p className="text-[16px] font-normal leading-[1.6] text-slate-600 italic">
                            &ldquo;{activeResult.principalRemark || 'No final remark recorded.'}&rdquo;
                          </p>
                        </div>

                      </div>

                      {/* Placeholders for stamps and signatures */}
                      <div className="grid grid-cols-3 gap-4 pt-8 text-center text-[13px] text-slate-400 border-t border-slate-100 font-sans">
                        
                        <div className="space-y-12">
                          <div className="h-10 flex items-end justify-center">
                            {/* Visual line/signature mockup */}
                            <span className="font-serif italic text-[#5c061c] text-[16px] leading-[1.5]">Mrs. A. Balogun</span>
                          </div>
                          <div className="border-t border-slate-300 pt-1 uppercase tracking-wider text-[13px] font-normal leading-[1.5] font-mono">
                            Class Teacher Signature
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          {/* School Stamp visual placeholder */}
                          <div className="h-16 w-16 rounded-full border-2 border-dashed border-[#5c061c]/30 flex items-center justify-center text-[#5c061c]/20 text-[13px] font-mono font-semibold rotate-12 uppercase select-none">
                            CSS Ido Stamp
                          </div>
                          <div className="pt-1 uppercase tracking-wider text-[13px] font-mono mt-1 font-semibold">
                            Official School Stamp
                          </div>
                        </div>

                        <div className="space-y-12">
                          <div className="h-10 flex items-end justify-center">
                            {/* Visual line/signature mockup */}
                            <span className="font-serif italic text-blue-800 text-[16px] leading-[1.5]">Dr. E. O. Ido</span>
                          </div>
                          <div className="border-t border-slate-300 pt-1 uppercase tracking-wider text-[13px] font-normal leading-[1.5] font-mono">
                            Principal Signature
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Printed legal metadata info */}
                    <div className="p-4 bg-slate-900 text-slate-400 text-[13px] text-center border-t border-slate-800 font-mono">
                      <span>Verification Hash: CSSIDO-S2T2-{student.id.toUpperCase()}-{activeResult.totalScore} // Generated: {new Date().toLocaleDateString()} UTC</span>
                    </div>

                  </div>
                ) : (
                  // RESULT FOUND BUT NOT PUBLISHED
                  <div className="p-8 text-center space-y-4">
                    <div className="p-4 bg-amber-50 text-amber-700 rounded-full inline-block">
                      <Clock size={40} />
                    </div>
                    <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 leading-[1.2] tracking-[-0.02em]">Results Pending Publication</h3>
                    <p className="text-[16px] font-normal leading-[1.6] text-slate-500 max-w-md mx-auto">
                      Your terminal assessment records for <strong className="text-[#5c061c]">{selectedTerm}</strong> of the <strong className="text-slate-700">{activeSession?.name}</strong> academic session are currently undergoing administrative verification.
                    </p>
                    <p className="text-[13px] font-normal leading-[1.5] text-slate-400 max-w-sm mx-auto">
                      Please check back once the results are officially marked as <strong>Published</strong> by the school authorities.
                    </p>
                  </div>
                )
              ) : (
                // NO RESULT FOUND FOR THIS TERM/SESSION
                <div className="p-12 text-center space-y-4">
                  <div className="p-4 bg-slate-100 text-slate-400 rounded-full inline-block">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 leading-[1.2] tracking-[-0.02em]">No Assessment Records Found</h3>
                  <p className="text-[16px] font-normal leading-[1.6] text-slate-500 max-w-md mx-auto">
                    There are no recorded academic scores for <strong className="text-[#5c061c]">{selectedTerm}</strong> of the <strong className="text-slate-700">{activeSession?.name}</strong> session on this account.
                  </p>
                  <p className="text-[13px] font-normal leading-[1.5] text-slate-400 max-w-sm mx-auto">
                    If you believe this is an error, please reach out directly to your class tutor or the administrative block for profile verification.
                  </p>
                </div>
              )}

            </div>

            {/* PREVIOUS RESULTS SECTION (Non-printable) */}
            <div id="non-printable-elements" className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-[#5c061c]/5 text-[#5c061c] rounded-xl">
                  <History size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug">Academic History & Previous Results</h3>
                  <p className="text-xs text-slate-500">Pristine, chronological record of all published terminal assessments on your profile</p>
                </div>
              </div>

              {publishedResults.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-normal">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200 text-[11px] tracking-wider">
                        <th className="py-3 px-4 font-bold">Academic Session</th>
                        <th className="py-3 px-3 font-bold">Term</th>
                        <th className="py-3 px-3 font-bold">Class Arm</th>
                        <th className="py-3 px-2 font-bold text-center">Total Marks</th>
                        <th className="py-3 px-2 font-bold text-center">Average</th>
                        <th className="py-3 px-2 font-bold text-center">Grade</th>
                        <th className="py-3 px-2 font-bold text-center">Position</th>
                        <th className="py-3 px-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {publishedResults.map((r, index) => {
                        const sessionName = sessions.find(s => s.id === r.sessionId)?.name || r.sessionId;
                        const isCurrentActive = selectedSessionId === r.sessionId && selectedTerm === r.term;
                        return (
                          <tr key={index} className={`hover:bg-slate-50/50 transition-colors ${isCurrentActive ? 'bg-[#5c061c]/5' : ''}`}>
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {sessionName}
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-slate-600">
                              {r.term}
                            </td>
                            <td className="py-3.5 px-3 font-medium text-slate-500 font-mono">
                              {r.classId}
                            </td>
                            <td className="py-3.5 px-2 text-center font-bold text-slate-700">
                              {r.totalScore}
                            </td>
                            <td className="py-3.5 px-2 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                r.averageScore >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                r.averageScore >= 55 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {r.averageScore.toFixed(2)}%
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-center font-extrabold text-[#5c061c]">
                              {r.overallGrade}
                            </td>
                            <td className="py-3.5 px-2 text-center font-bold text-amber-600">
                              {r.positionOverride || getOrdinalSuffix(r.classPosition)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isCurrentActive ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg uppercase tracking-wider">
                                  <CheckCircle2 size={10} /> Selected
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedSessionId(r.sessionId);
                                    setSelectedTerm(r.term as Term);
                                    const element = document.getElementById('printable-report-card');
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#5c061c] hover:text-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-xs hover:border-[#5c061c] transition-all cursor-pointer"
                                >
                                  <BookOpen size={12} />
                                  <span>View Report</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200/80 space-y-2">
                  <div className="p-3 bg-white text-slate-400 rounded-xl inline-block shadow-xs border border-slate-100">
                    <History size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No Historical Records Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">This student does not have any previously published terminal report cards archived in this portal.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
