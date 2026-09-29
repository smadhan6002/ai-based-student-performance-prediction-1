import { Link } from 'react-router-dom';
import { Brain, LineChart, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-full py-12">
      <motion.div 
        className="w-full max-w-4xl text-center space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">ENGINEERING DAY DEMONSTRATION</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          AI-Based Student <br className="hidden md:block" />
          <span className="text-gradient">Performance Prediction</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Predict academic performance using intelligent data-driven analysis. Identify at-risk students early and provide actionable recommendations.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/predict" 
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:-translate-y-1 w-full sm:w-auto justify-center"
          >
            Start Prediction
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
          >
            View Dashboard
            <LineChart className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-16">
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="p-3 bg-primary-500/10 rounded-full text-primary-400 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">95%</h3>
            <p className="text-sm text-gray-400">Prediction Confidence*</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-2">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">8+</h3>
            <p className="text-sm text-gray-400">Performance Factors</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Real-Time</h3>
            <p className="text-sm text-gray-400">AI Analysis</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 mb-2">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Proactive</h3>
            <p className="text-sm text-gray-400">Risk Identification</p>
          </div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-xs text-gray-500 mt-8">
          * Demonstration metric for Engineering Day project. Real-world accuracy depends on trained model integration.
        </motion.p>
      </motion.div>
    </div>
  );
}
