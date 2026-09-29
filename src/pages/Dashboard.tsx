import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { mockStudents } from '../data/mockData';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const stats = useMemo(() => {
    const total = mockStudents.length;
    const avgScore = mockStudents.reduce((acc, curr) => acc + curr.prediction.score, 0) / total;
    const excellent = mockStudents.filter(s => s.prediction.category === 'Excellent').length;
    const atRisk = mockStudents.filter(s => s.prediction.category === 'At Risk').length;

    const distribution = [
      { name: 'Excellent', value: excellent },
      { name: 'Good', value: mockStudents.filter(s => s.prediction.category === 'Good').length },
      { name: 'Average', value: mockStudents.filter(s => s.prediction.category === 'Average').length },
      { name: 'At Risk', value: atRisk },
    ];

    const studyHoursData = mockStudents.map(s => ({
      name: s.name.split(' ')[0],
      hours: s.studyHours,
      score: s.prediction.score
    })).sort((a, b) => b.score - a.score).slice(0, 7);

    const attendanceData = mockStudents.map(s => ({
      attendance: s.attendance,
      score: s.prediction.score,
      name: s.name
    }));

    return { total, avgScore, excellent, atRisk, distribution, studyHoursData, attendanceData };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Overview of student performance predictions and trends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Predictions', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Average Score', value: stats.avgScore.toFixed(1), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { title: 'Excellent Students', value: stats.excellent, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'At-Risk Students', value: stats.atRisk, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Performance Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Study Hours vs Performance (Top)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.studyHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="score" name="Performance Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hours" name="Study Hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-white mb-6">Attendance Correlation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" dataKey="attendance" name="Attendance %" stroke="#a1a1aa" domain={[0, 100]} unit="%" />
                <YAxis type="number" dataKey="score" name="Score" stroke="#a1a1aa" domain={[0, 100]} />
                <ZAxis type="category" dataKey="name" name="Student" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Scatter name="Students" data={stats.attendanceData} fill="#0ea5e9" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
