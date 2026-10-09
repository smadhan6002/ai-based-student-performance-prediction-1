import { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { StudentDetailsModal } from '../components/StudentDetailsModal';
import { supabase } from '../services/supabaseClient';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_id, student_name, department, year, semester, predictions(*)')
        .order('created_at', { foreignTable: 'predictions', ascending: false });

      if (error) {
        console.error('Error fetching students from Supabase:', error);
      } else if (data) {
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  
  const filteredStudents = students.filter(student => 
    (student.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
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
    switch(risk) {
      case 'Low Risk': return 'text-semantic-success';
      case 'Medium Risk': return 'text-semantic-warning';
      case 'High Risk': return 'text-semantic-danger';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Directory Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-xs text-text-muted mt-0.5">Enrolled student profiles and latest academic performance predictions.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by name, roll no, department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="academic-input w-full pl-9 pr-3 py-2 h-9 text-xs"
            />
          </div>
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="btn-secondary h-9 px-3 text-xs"
            title="Reload student directory"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="academic-card bg-app-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-semibold text-text-muted uppercase tracking-wider bg-app-secondary/50">
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Prediction</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-blue" />
                      <span>Loading student directory records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => {
                const latestPrediction = student.predictions?.[0];
                
                // Calculate risk level
                const cat = latestPrediction?.prediction;
                const riskLevel = cat 
                  ? (cat === 'Excellent' || cat === 'Good' ? 'Low Risk' : (cat === 'Average' ? 'Medium Risk' : 'High Risk'))
                  : 'N/A';
                
                // Calculate max probability score
                let score = 0;
                if (latestPrediction) {
                  const probs = [
                    latestPrediction.excellent_probability || 0,
                    latestPrediction.good_probability || 0,
                    latestPrediction.average_probability || 0,
                    latestPrediction.at_risk_probability || 0
                  ];
                  score = Math.round(Math.max(...probs) * 100);
                }

                return (
                  <tr 
                    key={student.id}
                    className="hover:bg-app-hover transition-colors group"
                  >
                    <td className="p-3.5 font-mono text-text-secondary font-medium">
                      {student.student_id}
                    </td>
                    <td className="p-3.5 font-medium text-white">
                      {student.student_name}
                    </td>
                    <td className="p-3.5 text-text-secondary truncate max-w-[220px]" title={student.department}>
                      {student.department}
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {latestPrediction ? `${score}/100` : '—'}
                    </td>
                    <td className="p-3.5">
                      {latestPrediction ? (
                        <span className={cn("badge-academic", getCategoryBadgeClass(latestPrediction.prediction))}>
                          {latestPrediction.prediction}
                        </span>
                      ) : (
                        <span className="text-text-muted text-xs">Not Evaluated</span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className={getRiskColor(riskLevel)}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => handleViewStudent(student)}
                        className="p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-app-secondary border border-transparent hover:border-app-border transition-colors" 
                        title="View Student Details"
                        aria-label={`View details for ${student.student_name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    No student records found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Summary */}
        <div className="p-3.5 border-t border-app-border flex items-center justify-between text-xs text-text-muted bg-app-surface">
          <span>Showing {filteredStudents.length} of {students.length} student records</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-semantic-success" />
            <span>Supabase Verified</span>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal 
        student={selectedStudent}
        studentId={selectedStudent?.id} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
