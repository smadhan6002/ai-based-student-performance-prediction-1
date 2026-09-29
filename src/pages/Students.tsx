import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import { getPredictionHistory } from '../services/predictionStorage';
import { cn } from '../utils/cn';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const students = getPredictionHistory();
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Average': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'At Risk': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'text-emerald-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Directory</h1>
          <p className="text-gray-400">View and manage student predictions and records.</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students, IDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 glass-input h-11"
            />
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm font-semibold text-gray-400">
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Score</th>
                <th className="p-4">Prediction</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredStudents.map((student, i) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 font-mono text-gray-400">{student.id}</td>
                  <td className="p-4 font-medium text-white">{student.name}</td>
                  <td className="p-4 text-gray-400 truncate max-w-[200px]" title={student.department}>{student.department}</td>
                  <td className="p-4 text-white font-bold">{student.prediction.score}/100</td>
                  <td className="p-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", getCategoryColor(student.prediction.category))}>
                      {student.prediction.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    <span className={getRiskColor(student.prediction.riskLevel)}>
                      {student.prediction.riskLevel}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg hover:bg-white/10" title="View Details">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
          <span>Showing {filteredStudents.length} results</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
