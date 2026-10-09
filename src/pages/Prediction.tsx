import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Users
} from 'lucide-react';

import { predictStudentPerformance, predictWithMLModel } from '../services/predictionService';
import { savePrediction } from '../services/predictionStorage';
import type { StudentInput, PredictionResult, Department, Year, Semester } from '../types';
import { cn } from '../utils/cn';

const INITIAL_STATE: StudentInput = {
  name: '',
  id: '',
  department: 'Artificial Intelligence & Data Science',
  year: '1st Year',
  semester: 'Semester 1',
  attendance: 0,
  internalMarks: 0,
  assignmentAverage: 0,
  previousMarks: 0,
  studyHours: 0,
  assignmentCompletion: 0,
  participation: 0,
  failedSubjects: 0
};

const SAMPLE_STUDENT_DATA: StudentInput = {
  name: 'Madhan S',
  id: '412724243023',
  department: 'Artificial Intelligence & Data Science',
  year: '3rd Year',
  semester: 'Semester 5',
  attendance: 88,
  internalMarks: 82,
  assignmentAverage: 91,
  previousMarks: 79,
  studyHours: 4.5,
  assignmentCompletion: 95,
  participation: 85,
  failedSubjects: 0
};

const DEPARTMENTS: Department[] = [
  'Artificial Intelligence & Data Science',
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering'
];

const YEARS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS: Semester[] = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
];

export function Prediction() {
  const [formData, setFormData] = useState<StudentInput>(INITIAL_STATE);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionStep, setPredictionStep] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [predictionMode, setPredictionMode] = useState<'demo' | 'ml'>('ml');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const loadSampleData = () => {
    setFormData(SAMPLE_STUDENT_DATA);
  };

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPredicting(true);
    setPredictionStep(1);

    setTimeout(() => setPredictionStep(2), 350);
    setTimeout(() => setPredictionStep(3), 700);
    setTimeout(() => setPredictionStep(4), 1050);

    try {
      let res: PredictionResult;
      if (predictionMode === 'ml') {
        res = await predictWithMLModel(formData);
      } else {
        res = await predictStudentPerformance(formData);
      }
      savePrediction(res);
      setResult(res);
    } catch (err: unknown) {
      console.error(err);
      if (predictionMode === 'ml') {
        const apiUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errMsg.toLowerCase().includes('cors') || errMsg.toLowerCase().includes('fetch') || errMsg.toLowerCase().includes('network') || errMsg.toLowerCase().includes('failed')) {
          setError(`Unable to connect to the ML prediction server at ${apiUrl}. Please verify the FastAPI service is active, or toggle to the Offline Demo Engine.`);
        } else {
          setError(`ML prediction failed: ${errMsg}`);
        }
      } else {
        setError('An unexpected error occurred during prediction evaluation. Please retry.');
      }
    } finally {
      setIsPredicting(false);
      setPredictionStep(0);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellent': return '#22C55E';
      case 'Good': return '#3B82F6';
      case 'Average': return '#F59E0B';
      case 'At Risk': return '#EF4444';
      default: return '#737C88';
    }
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

  // --- RESULT VIEW (Section 14) ---
  if (result) {
    const rawProbs = result.probabilities || {};
    const normalizedProbs: Record<string, number> = {
      'Excellent': rawProbs['Excellent'] ?? 0,
      'Good': rawProbs['Good'] ?? 0,
      'Average': rawProbs['Average'] ?? 0,
      'At Risk': rawProbs['At Risk'] ?? rawProbs['At_Risk'] ?? 0,
    };

    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-app-border pb-4">
          <button
            onClick={() => setResult(null)}
            className="btn-secondary text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Assessment Form</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Assessment Mode:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-badge bg-app-surface border border-app-border text-brand-blue">
              {result.confidenceType === 'Model Probability' ? 'Random Forest (FastAPI)' : 'Simulation Engine'}
            </span>
          </div>
        </div>

        {/* Primary Outcome Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Prediction Classification */}
          <div className="academic-card p-6 bg-app-surface text-left">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Performance Prediction
            </span>
            <div className="text-2xl font-bold text-white mb-2">
              {result.category}
            </div>
            <span className={cn("badge-academic", getCategoryBadgeClass(result.category))}>
              {result.category} Performance Tier
            </span>
          </div>

          {/* Card 2: Probability Score */}
          <div className="academic-card p-6 bg-app-surface text-left">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Model Confidence Score
            </span>
            <div className="text-2xl font-bold text-white mb-2">
              {result.score}<span className="text-sm font-normal text-text-muted"> / 100</span>
            </div>
            <span className="text-xs text-text-secondary">
              Confidence calibrated from class distribution
            </span>
          </div>

          {/* Card 3: Risk Stratification */}
          <div className="academic-card p-6 bg-app-surface text-left">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Risk Stratification
            </span>
            <div className={cn("text-2xl font-bold mb-2", 
              result.riskLevel === 'Low Risk' && 'text-semantic-success',
              result.riskLevel === 'Medium Risk' && 'text-semantic-warning',
              result.riskLevel === 'High Risk' && 'text-semantic-danger',
            )}>
              {result.riskLevel}
            </div>
            <span className="text-xs text-text-secondary">
              {result.riskLevel === 'High Risk' ? 'Requires priority faculty intervention' : 'Routine academic progress monitoring'}
            </span>
          </div>
        </div>

        {/* Probability Distribution (Section 14) */}
        <div className="academic-card p-6 bg-app-surface">
          <div className="border-b border-app-border pb-3 mb-4">
            <h2 className="text-sm font-semibold text-white">Class Probability Distribution</h2>
            <p className="text-xs text-text-muted mt-0.5">Statistical confidence distribution produced by Random Forest classifier</p>
          </div>

          <div className="space-y-3.5">
            {Object.entries(normalizedProbs).map(([catName, prob]) => {
              const pct = Math.round(Number(prob) * 100);
              const color = getCategoryColor(catName);
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary font-medium">{catName}</span>
                    <span className="font-mono font-semibold text-white">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-app-secondary border border-app-border overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Factor Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Factors */}
          <div className="academic-card p-6 bg-app-surface">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-app-border">
              <CheckCircle2 className="w-4 h-4 text-semantic-success" />
              <h3 className="text-sm font-semibold text-white">Positive Indicators</h3>
            </div>
            <ul className="space-y-2 text-xs">
              {result.positiveFactors && result.positiveFactors.length > 0 ? (
                result.positiveFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-semantic-success mt-0.5 font-bold">✓</span>
                    <span>{factor}</span>
                  </li>
                ))
              ) : (
                <li className="text-text-muted">No primary positive factors registered.</li>
              )}
            </ul>
          </div>

          {/* Attention Areas */}
          <div className="academic-card p-6 bg-app-surface">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-app-border">
              <AlertTriangle className="w-4 h-4 text-semantic-danger" />
              <h3 className="text-sm font-semibold text-white">Attention Areas</h3>
            </div>
            <ul className="space-y-2 text-xs">
              {result.negativeFactors && result.negativeFactors.length > 0 ? (
                result.negativeFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-semantic-danger mt-0.5 font-bold">!</span>
                    <span>{factor}</span>
                  </li>
                ))
              ) : (
                <li className="text-text-muted">No urgent areas of concern detected.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Academic Remediation Recommendations */}
        <div className="academic-card p-6 bg-app-surface">
          <div className="border-b border-app-border pb-3 mb-4">
            <h3 className="text-sm font-semibold text-white">Faculty & Advisory Recommendations</h3>
            <p className="text-xs text-text-muted mt-0.5">Actionable academic interventions tailored to this student profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.recommendations && result.recommendations.map((rec, i) => (
              <div key={i} className="p-3.5 rounded-card bg-app-secondary border border-app-border text-xs text-text-secondary leading-relaxed">
                <span className="font-semibold text-white block mb-1">Advisory Note #{i + 1}</span>
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setResult(null)}
            className="btn-primary"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Assess Another Student</span>
          </button>

          <Link
            to="/students"
            className="btn-secondary"
          >
            <Users className="w-3.5 h-3.5 text-text-muted" />
            <span>View Student Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  // --- FORM VIEW (Section 13) ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Student Academic Assessment</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Submit verified performance and behavioural indicators to compute predicted performance.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mode Switch */}
          <div className="flex bg-app-secondary p-0.5 rounded-btn border border-app-border text-xs">
            <button
              type="button"
              onClick={() => setPredictionMode('demo')}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-colors",
                predictionMode === 'demo' ? "bg-app-surface text-white" : "text-text-muted hover:text-white"
              )}
            >
              Demo Engine
            </button>
            <button
              type="button"
              onClick={() => setPredictionMode('ml')}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-colors",
                predictionMode === 'ml' ? "bg-brand-blue text-white" : "text-text-muted hover:text-white"
              )}
            >
              Random Forest ML
            </button>
          </div>

          {/* Quick Actions */}
          <button
            type="button"
            onClick={loadSampleData}
            className="btn-secondary text-xs h-8 px-2.5"
            title="Populate with verified sample student data"
          >
            <Play className="w-3 h-3 text-brand-blue fill-brand-blue" />
            <span>Fill Sample</span>
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary text-xs h-8 px-2.5"
            title="Reset assessment form"
          >
            <RefreshCw className="w-3 h-3 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {error && (
        <div className="p-4 rounded-card bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-semantic-danger shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold block mb-0.5">Assessment Error</span>
            {error}
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-text-muted hover:text-white"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student Information */}
        <div className="academic-card p-6 bg-app-surface space-y-4">
          <div className="border-b border-app-border pb-3">
            <h2 className="text-sm font-semibold text-white">1. Student Identification</h2>
            <p className="text-xs text-text-muted mt-0.5">Academic profile and enrollment parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="student_name" className="block text-xs font-medium text-text-secondary mb-1">
                Student Full Name *
              </label>
              <input
                id="student_name"
                name="name"
                type="text"
                required
                placeholder="e.g. Karthick"
                value={formData.name}
                onChange={handleInputChange}
                className="academic-input w-full px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label htmlFor="student_id" className="block text-xs font-medium text-text-secondary mb-1">
                Student Roll / Registration ID *
              </label>
              <input
                id="student_id"
                name="id"
                type="text"
                required
                placeholder="e.g. 412724243018"
                value={formData.id}
                onChange={handleInputChange}
                className="academic-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-xs font-medium text-text-secondary mb-1">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="academic-input w-full px-3 py-2 text-xs bg-app-secondary"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-xs font-medium text-text-secondary mb-1">
                Year of Study *
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="academic-input w-full px-3 py-2 text-xs bg-app-secondary"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="block text-xs font-medium text-text-secondary mb-1">
                Current Semester *
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="academic-input w-full px-3 py-2 text-xs bg-app-secondary"
              >
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Performance Indicators */}
        <div className="academic-card p-6 bg-app-surface space-y-4">
          <div className="border-b border-app-border pb-3">
            <h2 className="text-sm font-semibold text-white">2. Academic Performance Metrics</h2>
            <p className="text-xs text-text-muted mt-0.5">Formal examination, continuous internal assessment, and historical scores.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="attendance" className="block text-xs font-medium text-text-secondary mb-1">
                Attendance Percentage *
              </label>
              <div className="relative">
                <input
                  id="attendance"
                  name="attendance"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.attendance}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-8 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">%</span>
              </div>
            </div>

            <div>
              <label htmlFor="internalMarks" className="block text-xs font-medium text-text-secondary mb-1">
                Internal Assessment Marks *
              </label>
              <div className="relative">
                <input
                  id="internalMarks"
                  name="internalMarks"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.internalMarks}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-10 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">/ 100</span>
              </div>
            </div>

            <div>
              <label htmlFor="assignmentAverage" className="block text-xs font-medium text-text-secondary mb-1">
                Assignment Average *
              </label>
              <div className="relative">
                <input
                  id="assignmentAverage"
                  name="assignmentAverage"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.assignmentAverage}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-10 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">/ 100</span>
              </div>
            </div>

            <div>
              <label htmlFor="previousMarks" className="block text-xs font-medium text-text-secondary mb-1">
                Previous Semester Score *
              </label>
              <div className="relative">
                <input
                  id="previousMarks"
                  name="previousMarks"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.previousMarks}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-10 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Learning Behaviour & Engagement */}
        <div className="academic-card p-6 bg-app-surface space-y-4">
          <div className="border-b border-app-border pb-3">
            <h2 className="text-sm font-semibold text-white">3. Learning Behaviour & Habit Indicators</h2>
            <p className="text-xs text-text-muted mt-0.5">Self-directed study hours and active classroom engagement metrics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="studyHours" className="block text-xs font-medium text-text-secondary mb-1">
                Daily Study Hours *
              </label>
              <div className="relative">
                <input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  step="0.5"
                  required
                  min={0}
                  max={16}
                  value={formData.studyHours}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-16 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">hrs/day</span>
              </div>
            </div>

            <div>
              <label htmlFor="assignmentCompletion" className="block text-xs font-medium text-text-secondary mb-1">
                Assignment Completion Rate *
              </label>
              <div className="relative">
                <input
                  id="assignmentCompletion"
                  name="assignmentCompletion"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.assignmentCompletion}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-8 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">%</span>
              </div>
            </div>

            <div>
              <label htmlFor="participation" className="block text-xs font-medium text-text-secondary mb-1">
                Classroom Participation *
              </label>
              <div className="relative">
                <input
                  id="participation"
                  name="participation"
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={formData.participation}
                  onChange={handleInputChange}
                  className="academic-input w-full pl-3 pr-8 py-2 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Academic Standing / Risk Factors */}
        <div className="academic-card p-6 bg-app-surface space-y-4">
          <div className="border-b border-app-border pb-3">
            <h2 className="text-sm font-semibold text-white">4. Academic Standing & Arrears</h2>
            <p className="text-xs text-text-muted mt-0.5">Subject backlogs or pending course requirements.</p>
          </div>

          <div className="max-w-xs">
            <label htmlFor="failedSubjects" className="block text-xs font-medium text-text-secondary mb-1">
              Failed Subjects / Pending Backlogs *
            </label>
            <div className="relative">
              <input
                id="failedSubjects"
                name="failedSubjects"
                type="number"
                required
                min={0}
                max={15}
                value={formData.failedSubjects}
                onChange={handleInputChange}
                className="academic-input w-full pl-3 pr-16 py-2 text-xs"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">subjects</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1">Enter 0 if all previous subjects are cleared.</p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-text-muted">
            All parameters will be evaluated and logged to the central database.
          </div>
          <button
            type="submit"
            disabled={isPredicting}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            <span>Generate Performance Assessment</span>
          </button>
        </div>
      </form>

      {/* Professional Processing Modal (Section 15) */}
      <AnimatePresence>
        {isPredicting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <div className="academic-card-elevated p-8 bg-app-surface border border-app-border max-w-sm w-full text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/30 mx-auto flex items-center justify-center text-brand-blue">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {predictionMode === 'ml' ? 'Running Random Forest Model' : 'Evaluating Academic Indicators'}
                </h3>
                <p className="text-xs text-text-muted mt-1 h-5">
                  {predictionStep === 1 && "Validating student academic metrics..."}
                  {predictionStep === 2 && "Processing multi-factor feature vector..."}
                  {predictionStep === 3 && "Calculating class probability distributions..."}
                  {predictionStep >= 4 && "Finalizing prediction and updating records..."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-app-secondary rounded-full overflow-hidden border border-app-border">
                <motion.div 
                  className="h-full bg-brand-blue rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, (predictionStep / 4) * 100)}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
