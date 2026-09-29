import { motion } from 'framer-motion';
import { BookOpen, Target, Lightbulb, Rocket } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About the Project</h1>
        <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
          This project uses student academic and behavioural indicators to estimate future academic performance using machine learning techniques. Built for Engineering Day demonstration.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Problem Statement</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Students with declining academic performance may not always be identified early. Traditional tracking methods are often reactive rather than proactive, leading to missed opportunities for timely intervention and support.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Proposed Solution</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            An AI-based prediction system that analyzes multiple academic indicators (attendance, previous marks, study hours, etc.) to provide an estimated performance category along with actionable, personalized recommendations.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Key Features & Future Scope</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Current Features</h3>
            <ul className="space-y-3">
              {['Student performance prediction', 'AI-based analysis simulation', 'Risk identification', 'Performance visualization', 'Personalized recommendations', 'Academic analytics dashboard'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Future Scope</h3>
            <ul className="space-y-3">
              {['Real ML model integration via API', 'Faculty & Admin dashboard', 'Historical student tracking', 'Early warning system & Parent notification', 'Integration with college ERP', 'Explainable AI visualizations'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
