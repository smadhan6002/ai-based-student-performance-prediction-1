import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  BarChart2, 
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from 'recharts';
import { supabase } from '../services/supabaseClient';
import { cn } from '../utils/cn';


export function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*, predictions(*)')
        .order('created_at', { foreignTable: 'predictions', ascending: false });

      if (error) {
        console.error('Error loading dashboard data:', error);
      } else if (data) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Error in dashboard fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    let totalPredictionsCount = 0;
    let excellentCount = 0;
    let goodCount = 0;
    let averageCount = 0;
    let atRiskCount = 0;

    let lowRiskCount = 0;
    let mediumRiskCount = 0;
    let highRiskCount = 0;

    let scoreSum = 0;
    let attendanceSum = 0;
    let internalMarksSum = 0;
    let assignmentAvgSum = 0;
    let previousMarksSum = 0;
    let studyHoursSum = 0;
    let studentsWithPredictions = 0;

    students.forEach((student) => {
      const preds = student.predictions || [];
      totalPredictionsCount += preds.length;

      const latest = preds[0];
      if (latest) {
        studentsWithPredictions++;
        const cat = latest.prediction;
        if (cat === 'Excellent') excellentCount++;
        else if (cat === 'Good') goodCount++;
        else if (cat === 'Average') averageCount++;
        else if (cat === 'At Risk') atRiskCount++;

        // Risk Level
        if (cat === 'Excellent' || cat === 'Good') lowRiskCount++;
        else if (cat === 'Average') mediumRiskCount++;
        else highRiskCount++;

        // Max probability score
        const probs = [
          latest.excellent_probability || 0,
          latest.good_probability || 0,
          latest.average_probability || 0,
          latest.at_risk_probability || 0
        ];
        scoreSum += Math.round(Math.max(...probs) * 100);

        // Academic indicator sums
        attendanceSum += Number(latest.attendance) || 0;
        internalMarksSum += Number(latest.internal_marks) || 0;
        assignmentAvgSum += Number(latest.assignment_average) || 0;
        previousMarksSum += Number(latest.previous_semester_marks) || 0;
        studyHoursSum += Number(latest.study_hours) || 0;
      }
    });

    const divisor = studentsWithPredictions > 0 ? studentsWithPredictions : 1;
    const avgScore = Math.round(scoreSum / divisor);
    const avgAttendance = Math.round(attendanceSum / divisor);
    const avgInternalMarks = Math.round(internalMarksSum / divisor);
    const avgAssignment = Math.round(assignmentAvgSum / divisor);
    const avgPrevMarks = Math.round(previousMarksSum / divisor);
    const avgStudyHours = Number((studyHoursSum / divisor).toFixed(1));

    const categoryDistribution = [
      { name: 'Excellent', count: excellentCount, color: '#22C55E' },
      { name: 'Good', count: goodCount, color: '#3B82F6' },
      { name: 'Average', count: averageCount, color: '#F59E0B' },
      { name: 'At Risk', count: atRiskCount, color: '#EF4444' },
    ];

    const academicIndicatorAverages = [
      { metric: 'Attendance', average: avgAttendance, unit: '%' },
      { metric: 'Internal Marks', average: avgInternalMarks, unit: '/100' },
      { metric: 'Assignments', average: avgAssignment, unit: '/100' },
      { metric: 'Prev. Marks', average: avgPrevMarks, unit: '/100' },
    ];

    const riskDistribution = [
      { name: 'Low Risk', count: lowRiskCount, color: '#22C55E' },
      { name: 'Medium Risk', count: mediumRiskCount, color: '#F59E0B' },
      { name: 'High Risk', count: highRiskCount, color: '#EF4444' },
    ];

    return {
      totalStudents,
      totalPredictionsCount,
      excellentCount,
      atRiskCount,
      avgScore,
      avgStudyHours,
      categoryDistribution,
      academicIndicatorAverages,
      riskDistribution,
      studentsWithPredictions,
    };
  }, [students]);

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

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Academic Analytics Dashboard</h1>
          <p className="text-xs text-text-muted mt-0.5">Cohort performance summary and risk distribution analysis.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top KPI Cards (Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '—' : stats.totalStudents}</div>
          <div className="text-[12px] text-text-muted mt-1">Enrolled across departments</div>
        </div>

        {/* Predictions Generated */}
        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <span>Predictions Generated</span>
            <BarChart2 className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '—' : stats.totalPredictionsCount}</div>
          <div className="text-[12px] text-text-muted mt-1">Evaluations saved in Supabase</div>
        </div>

        {/* Excellent Students */}
        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <span>Excellent Cohort</span>
            <Award className="w-4 h-4 text-semantic-success" />
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '—' : stats.excellentCount}</div>
          <div className="text-[12px] text-semantic-success mt-1">High-performing evaluations</div>
        </div>

        {/* Students At Risk */}
        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <span>Students At Risk</span>
            <AlertTriangle className="w-4 h-4 text-semantic-danger" />
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '—' : stats.atRiskCount}</div>
          <div className="text-[12px] text-semantic-danger mt-1">Requires coordinator intervention</div>
        </div>
      </div>

      {/* Main Analytical Charts (Section 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Prediction Category Distribution */}
        <div className="academic-card p-6 bg-app-surface">
          <div className="border-b border-app-border pb-3 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Prediction Distribution</h2>
              <p className="text-xs text-text-muted mt-0.5">Students classified by academic performance category</p>
            </div>
            <span className="text-xs text-text-muted font-mono">{stats.studentsWithPredictions} records</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryDistribution} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3038" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#737C88" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#2A3038' }} 
                />
                <YAxis 
                  stroke="#737C88" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#2A3038' }} 
                  allowDecimals={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#191D23', 
                    borderColor: '#2A3038', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#F4F6F8'
                  }}
                  itemStyle={{ color: '#F4F6F8' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Student Count" 
                  radius={[4, 4, 0, 0]}
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Academic Indicator Averages */}
        <div className="academic-card p-6 bg-app-surface">
          <div className="border-b border-app-border pb-3 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Cohort Performance Overview</h2>
              <p className="text-xs text-text-muted mt-0.5">Mean values across core academic indicators</p>
            </div>
            <span className="text-xs text-text-muted font-mono">Mean Score: {stats.avgScore}/100</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.academicIndicatorAverages} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3038" vertical={false} />
                <XAxis 
                  dataKey="metric" 
                  stroke="#737C88" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#2A3038' }} 
                />
                <YAxis 
                  stroke="#737C88" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#2A3038' }} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#191D23', 
                    borderColor: '#2A3038', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#F4F6F8' 
                  }}
                  formatter={(val: any) => [`${val}% / pts`, 'Cohort Average']}
                />
                <Bar 
                  dataKey="average" 
                  name="Cohort Average" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Stratification Breakdown */}
      <div className="academic-card p-6 bg-app-surface">
        <div className="border-b border-app-border pb-3 mb-4">
          <h2 className="text-sm font-semibold text-white">Cohort Risk Stratification</h2>
          <p className="text-xs text-text-muted mt-0.5">Tier distribution for targeted academic counseling and faculty advisement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.riskDistribution.map((item) => (
            <div key={item.name} className="p-4 rounded-card bg-app-secondary border border-app-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">{item.name}</span>
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{item.count}</div>
              <p className="text-[12px] text-text-secondary mt-1">
                {stats.studentsWithPredictions > 0 
                  ? `${Math.round((item.count / stats.studentsWithPredictions) * 100)}% of assessed cohort`
                  : '0% of cohort'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="academic-card bg-app-surface overflow-hidden">
        <div className="p-5 border-b border-app-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Student Assessments</h2>
            <p className="text-xs text-text-muted mt-0.5">Latest performance prediction records from Supabase</p>
          </div>
          <span className="text-xs text-text-muted font-mono">{students.length} Total Enrolled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-semibold text-text-muted uppercase tracking-wider bg-app-secondary/50">
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Prediction</th>
                <th className="p-3.5">Risk Tier</th>
                <th className="p-3.5 text-right">Assessment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    Loading analytics data...
                  </td>
                </tr>
              ) : students.slice(0, 5).map((student) => {
                const latest = student.predictions?.[0];
                const cat = latest?.prediction;
                const riskLevel = cat 
                  ? (cat === 'Excellent' || cat === 'Good' ? 'Low Risk' : (cat === 'Average' ? 'Medium Risk' : 'High Risk'))
                  : 'N/A';

                const probs = latest ? [
                  latest.excellent_probability || 0,
                  latest.good_probability || 0,
                  latest.average_probability || 0,
                  latest.at_risk_probability || 0
                ] : [0];
                const score = latest ? Math.round(Math.max(...probs) * 100) : null;
                const date = latest?.created_at
                  ? new Date(latest.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';

                return (
                  <tr key={student.id} className="hover:bg-app-hover transition-colors">
                    <td className="p-3.5 font-mono text-text-secondary">{student.student_id}</td>
                    <td className="p-3.5 font-medium text-white">{student.student_name}</td>
                    <td className="p-3.5 text-text-secondary truncate max-w-[200px]" title={student.department}>{student.department}</td>
                    <td className="p-3.5 font-semibold text-white">{score !== null ? `${score}/100` : '—'}</td>
                    <td className="p-3.5">
                      {latest ? (
                        <span className={cn("badge-academic", getCategoryBadgeClass(latest.prediction))}>
                          {latest.prediction}
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className={cn(
                        riskLevel === 'Low Risk' && 'text-semantic-success',
                        riskLevel === 'Medium Risk' && 'text-semantic-warning',
                        riskLevel === 'High Risk' && 'text-semantic-danger',
                        riskLevel === 'N/A' && 'text-text-muted'
                      )}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-text-muted font-mono">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
