import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../services/supabaseClient';

interface StudentDetailsModalProps {
  student?: any | null;
  studentId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailsModal({ student, studentId, isOpen, onClose }: StudentDetailsModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchStudentData = useCallback(async () => {
    const studentUUID = student?.id || studentId;
    if (!studentUUID) return;

    setLoading(true);
    setError(false);

    try {
      let studentInfo = student;
      if (!studentInfo || !studentInfo.student_name) {
        const { data: sData, error: sError } = await supabase
          .from('students')
          .select('*')
          .eq('id', studentUUID)
          .single();

        if (sError) throw sError;
        studentInfo = sData;
      }

      const { data: predictions, error: pError } = await supabase
        .from('predictions')
        .select('*')
        .eq('student_id', studentUUID)
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      setData({
        ...studentInfo,
        predictions: predictions || []
      });
    } catch (err) {
      console.error('Student details error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [student, studentId]);

  useEffect(() => {
    if (!isOpen) {
      setData(null);
      setError(false);
      return;
    }
    const studentUUID = student?.id || studentId;
    if (studentUUID) {
      fetchStudentData();
    }
  }, [isOpen, student, studentId, fetchStudentData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const calculateScore = (pred: any) => {
    const probs = [
      pred.excellent_probability || 0,
      pred.good_probability || 0,
      pred.average_probability || 0,
      pred.at_risk_probability || 0
    ];
    return Math.round(Math.max(...probs) * 100);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'Good':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
      case 'Average':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      case 'At Risk':
        return 'bg-red-500/10 text-red-400 border border-red-500/25';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/25';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk':
        return 'text-semantic-success';
      case 'Medium Risk':
        return 'text-semantic-warning';
      case 'High Risk':
        return 'text-semantic-danger';
      default:
        return 'text-text-muted';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-text-muted">
          <RefreshCw className="w-6 h-6 text-brand-blue animate-spin mb-3" />
          <p className="text-sm font-medium text-text-secondary">Loading student details from database...</p>
          <span className="text-xs text-text-muted mt-1">Retrieving academic indicators and predictions</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <AlertCircle className="w-10 h-10 text-semantic-danger mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">Unable to load student details</h3>
          <p className="text-xs text-text-muted max-w-sm mb-4">
            Could not retrieve records for this student. Please check database connectivity and try again.
          </p>
          <button
            onClick={fetchStudentData}
            className="btn-primary text-xs px-4 py-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      );
    }

    if (!data) return null;

    const predictions = data.predictions || [];
    const latestPrediction = predictions[0];
    const category = latestPrediction?.prediction;
    const riskLevel = category 
      ? (category === 'Excellent' || category === 'Good' ? 'Low Risk' : (category === 'Average' ? 'Medium Risk' : 'High Risk'))
      : 'N/A';
    const score = latestPrediction ? calculateScore(latestPrediction) : null;

    return (
      <div className="space-y-6">
        {/* Performance Summary Banner */}
        {latestPrediction ? (
          <div className="p-4 rounded-card bg-app-secondary border border-app-border">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Performance Summary
            </div>
            <div className="grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="text-xs text-text-muted block mb-1">Predicted Category</span>
                <span className={cn("badge-academic text-xs", getCategoryBadgeClass(category))}>
                  {category}
                </span>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1">Model Score</span>
                <span className="text-base font-bold text-white">{score}/100</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1">Risk Stratification</span>
                <span className={cn("text-xs font-semibold block mt-0.5", getRiskColor(riskLevel))}>
                  {riskLevel}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-card bg-app-secondary border border-app-border text-xs text-text-muted">
            No assessment records have been recorded for this student yet.
          </div>
        )}

        {/* Academic Inputs Grid */}
        {latestPrediction && (
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 pb-1 border-b border-app-border">
              Academic Inputs & Behavioural Indicators
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Attendance</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.attendance}%</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Internal Marks</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.internal_marks}/100</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Assignment Avg</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.assignment_average}/100</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Previous Sem</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.previous_semester_marks}/100</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Study Hours</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.study_hours} hrs/day</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Assignment Compl.</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.assignment_completion}%</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Class Participation</span>
                <span className="text-sm font-semibold text-white">{latestPrediction.class_participation}%</span>
              </div>
              <div className="p-3 rounded-card bg-app-secondary border border-app-border">
                <span className="text-[11px] text-text-muted block mb-0.5">Subject Backlogs</span>
                <span className={cn("text-sm font-semibold", Number(latestPrediction.failed_subjects) > 0 ? "text-semantic-danger" : "text-white")}>
                  {latestPrediction.failed_subjects}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Prediction History Table */}
        {predictions.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 pb-1 border-b border-app-border flex items-center justify-between">
              <span>Historical Prediction Assessments</span>
              <span className="font-mono text-[11px]">{predictions.length} recorded</span>
            </div>

            <div className="rounded-card border border-app-border overflow-hidden bg-app-secondary">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-text-muted bg-app-surface/60">
                    <th className="p-3 font-medium">Assessment Date</th>
                    <th className="p-3 font-medium">Prediction</th>
                    <th className="p-3 font-medium">Confidence Score</th>
                    <th className="p-3 font-medium text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {predictions.map((pred: any) => {
                    const date = new Date(pred.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    });
                    const itemScore = calculateScore(pred);
                    return (
                      <tr key={pred.id} className="hover:bg-app-hover transition-colors">
                        <td className="p-3 text-text-secondary font-mono">{date}</td>
                        <td className="p-3">
                          <span className={cn("badge-academic", getCategoryBadgeClass(pred.prediction))}>
                            {pred.prediction}
                          </span>
                        </td>
                        <td className="p-3 text-white font-medium">{itemScore}%</td>
                        <td className="p-3 text-right text-text-secondary">{pred.attendance}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={handleOutsideClick}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            ref={modalRef}
            className="academic-card-elevated bg-app-surface w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-app-border flex items-start justify-between bg-app-secondary">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
                    Student Profile
                  </span>
                  {data && (
                    <span className="text-[11px] px-2 py-0.5 rounded-badge bg-app-surface border border-app-border text-text-muted font-mono">
                      {data.student_id}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {data?.student_name || 'Loading student...'}
                </h2>
                {data && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {data.department} • {typeof data.year === 'number' || !data.year?.toString().toLowerCase().includes('year') ? `Year ${data.year}` : data.year} ({typeof data.semester === 'number' || !data.semester?.toString().toLowerCase().includes('semester') ? `Semester ${data.semester}` : data.semester})
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-app-hover border border-transparent hover:border-app-border transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {renderContent()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 border-t border-app-border bg-app-secondary flex items-center justify-between text-xs text-text-muted">
              <span>Departmental Academic Assessment Record</span>
              <button
                onClick={onClose}
                className="btn-secondary text-xs px-3 py-1"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
