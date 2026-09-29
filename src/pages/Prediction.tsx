import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, BrainCircuit, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { predictPerformance } from '../services/predictionService';
import type { StudentInput, PredictionResult, Department, Year, Semester } from '../types';
import { cn } from '../utils/cn';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

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

const DEMO_DATA: StudentInput = {
  name: 'Madhan S',
  id: 'ST2023001',
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
const SEMESTERS: Semester[] = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

export function Prediction() {
  const [formData, setFormData] = useState<StudentInput>(INITIAL_STATE);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionStep, setPredictionStep] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === 'number' || type === 'range') {
      parsedValue = Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const loadDemo = () => {
    setFormData(DEMO_DATA);
  };

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setPredictionStep(1); // "Analyzing student data..."
    
    setTimeout(() => setPredictionStep(2), 800); // "Evaluating academic indicators..."
    setTimeout(() => setPredictionStep(3), 1600); // "Generating prediction..."

    try {
      const res = await predictPerformance(formData);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPredicting(false);
      setPredictionStep(0);
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Excellent': return '#10b981'; // emerald
      case 'Good': return '#3b82f6'; // blue
      case 'Average': return '#f59e0b'; // yellow
      case 'At Risk': return '#ef4444'; // red
      default: return '#71717a';
    }
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12 max-w-5xl mx-auto">
        <button onClick={() => setResult(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Form
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-8 flex flex-col items-center justify-center text-center md:col-span-1">
            <h2 className="text-xl font-bold text-white mb-6">Performance Score</h2>
            <div className="relative w-48 h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: result.score, fill: getCategoryColor(result.category) },
                      { value: 100 - result.score, fill: '#27272a' }
                    ]}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={90}
                    startAngle={225} endAngle={-45}
                    dataKey="value" stroke="none"
                    cornerRadius={10}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{result.score}</span>
                <span className="text-sm text-gray-400">/ 100</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold" style={{ color: getCategoryColor(result.category) }}>{result.category}</h3>
            <div className="flex gap-4 mt-4 w-full text-left">
              <div className="flex-1 bg-surfaceLight/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400">Confidence</p>
                <p className="font-bold text-white">{(result.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="flex-1 bg-surfaceLight/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400">Risk Level</p>
                <p className={cn("font-bold", result.riskLevel === 'Low' ? 'text-emerald-400' : result.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400')}>
                  {result.riskLevel}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-8 md:col-span-2 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              AI Recommendations
            </h2>
            <div className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-surfaceLight/30 rounded-xl border border-white/5">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-primary-400" /></div>
                  <p className="text-gray-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Why this prediction?</h2>
          <div className="space-y-6">
            {result.factors.map((factor, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-gray-300">{factor.name}</span>
                  <span className="text-sm text-gray-400">{factor.value} / {factor.max}</span>
                </div>
                <div className="h-2 w-full bg-surfaceLight rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(factor.value / factor.max) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                    className={cn(
                      "h-full rounded-full",
                      factor.impact === 'positive' ? 'bg-emerald-500' : factor.impact === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                    )}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Predict Performance</h1>
          <p className="text-gray-400">Enter academic data to generate an AI-based prediction.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetForm} className="px-4 py-2 rounded-lg glass hover:bg-white/10 text-gray-300 font-medium transition-all flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button onClick={loadDemo} className="px-5 py-2 rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 font-semibold transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Play className="w-4 h-4 fill-primary-400" /> Launch Demo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPredicting && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center">
              <BrainCircuit className="w-16 h-16 text-primary-400 mb-6 animate-pulse-slow" />
              <h3 className="text-xl font-bold text-white mb-2">AI Processing</h3>
              <p className="text-gray-400 h-6">
                {predictionStep === 1 && "Analyzing student data..."}
                {predictionStep === 2 && "Evaluating academic indicators..."}
                {predictionStep === 3 && "Generating prediction..."}
              </p>
              <div className="w-full h-1 bg-surfaceLight mt-6 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(predictionStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Student Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 glass-input h-11" placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Student ID</label>
              <input required type="text" name="id" value={formData.id} onChange={handleInputChange} className="w-full px-4 py-2 glass-input h-11" placeholder="e.g. ST2023001" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Department</label>
              <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-2 glass-input h-11 bg-surfaceLight">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Year</label>
              <select name="year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-2 glass-input h-11 bg-surfaceLight">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Semester</label>
              <select name="semester" value={formData.semester} onChange={handleInputChange} className="w-full px-4 py-2 glass-input h-11 bg-surfaceLight">
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Academic & Behavioral Indicators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {/* Range Inputs */}
            {[
              { name: 'attendance', label: 'Attendance', min: 0, max: 100, unit: '%', desc: 'Current semester attendance' },
              { name: 'internalMarks', label: 'Internal Assessment Marks', min: 0, max: 100, unit: '', desc: 'Average of internals' },
              { name: 'assignmentAverage', label: 'Assignment Average', min: 0, max: 100, unit: '', desc: 'Average assignment scores' },
              { name: 'previousMarks', label: 'Previous Semester Marks', min: 0, max: 100, unit: '', desc: 'Overall percentage' },
              { name: 'studyHours', label: 'Study Hours Per Day', min: 0, max: 12, unit: 'hrs', desc: 'Self-study hours outside class', step: 0.5 },
              { name: 'assignmentCompletion', label: 'Assignment Completion', min: 0, max: 100, unit: '%', desc: 'Percentage submitted on time' },
              { name: 'participation', label: 'Class Participation', min: 0, max: 100, unit: '%', desc: 'Active involvement in discussions' },
              { name: 'failedSubjects', label: 'Previous Failed Subjects', min: 0, max: 10, unit: '', desc: 'Number of arrears' }
            ].map((field) => (
              <div key={field.name} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-medium text-gray-200">{field.label}</label>
                    <p className="text-xs text-gray-500">{field.desc}</p>
                  </div>
                  <span className="font-bold text-primary-400 text-lg w-16 text-right">
                    {(formData as any)[field.name]}{field.unit}
                  </span>
                </div>
                <input
                  type="range"
                  name={field.name}
                  min={field.min}
                  max={field.max}
                  step={field.step || 1}
                  value={(formData as any)[field.name]}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="flex items-center gap-2 px-10 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:-translate-y-1"
          >
            <BrainCircuit className="w-6 h-6" />
            Predict Performance
          </button>
        </div>
      </form>
    </div>
  );
}
