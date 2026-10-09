import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Layers, 
  Database, 
  CheckCircle2 
} from 'lucide-react';


export function Home() {
  return (
    <div className="space-y-10 pb-12">
      {/* Platform Hero Banner */}
      <section className="academic-card p-6 md:p-10 relative overflow-hidden bg-app-surface border border-app-border">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-app-secondary border border-app-border text-xs font-medium text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            <span>COLLEGE ENGINEERING DAY DEMONSTRATION</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            AI-Based Student Performance Prediction System
          </h1>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            An academic analytics platform utilizing supervised machine learning to assess multi-factor student indicators, identify academic risk tiers early in the semester, and provide actionable interventions for faculty coordinators.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/predict"
              className="btn-primary"
            >
              <span>Run Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/students"
              className="btn-secondary"
            >
              <Users className="w-4 h-4 text-text-muted" />
              <span>Student Directory</span>
            </Link>

            <Link
              to="/dashboard"
              className="btn-secondary"
            >
              <BarChart3 className="w-4 h-4 text-text-muted" />
              <span>Cohort Analytics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Engineering Specifications / Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Evaluation Inputs</span>
            <div className="p-2 rounded-btn bg-app-secondary text-brand-blue border border-app-border">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">8 Indicators</div>
          <p className="text-xs text-text-muted mt-1 leading-normal">
            Attendance, internals, assignments, prior marks, study hours, completion, participation, backlogs.
          </p>
        </div>

        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Inference Model</span>
            <div className="p-2 rounded-btn bg-app-secondary text-semantic-success border border-app-border">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">Random Forest</div>
          <p className="text-xs text-text-muted mt-1 leading-normal">
            Ensemble classification pipeline with calibrated probability distribution across performance tiers.
          </p>
        </div>

        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Cloud Database</span>
            <div className="p-2 rounded-btn bg-app-secondary text-brand-blue border border-app-border">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">Supabase PostgreSQL</div>
          <p className="text-xs text-text-muted mt-1 leading-normal">
            Live relational storage with UUID foreign-key student tracking and Row-Level Security policies.
          </p>
        </div>

        <div className="academic-card p-5 bg-app-surface">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Stratification</span>
            <div className="p-2 rounded-btn bg-app-secondary text-semantic-warning border border-app-border">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">4 Risk Tiers</div>
          <p className="text-xs text-text-muted mt-1 leading-normal">
            Excellent, Good, Average, and At-Risk classifications with targeted academic remediation guidance.
          </p>
        </div>
      </section>

      {/* Platform Workflow Matrix */}
      <section className="academic-card p-6 md:p-8 bg-app-surface">
        <div className="border-b border-app-border pb-4 mb-6">
          <h2 className="text-lg font-semibold text-white">Academic Assessment Workflow</h2>
          <p className="text-xs text-text-muted mt-1">
            Systematic four-stage procedure designed for departmental faculty and academic counseling coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-md bg-app-secondary border border-app-border flex items-center justify-center text-xs font-bold text-brand-blue">
              01
            </div>
            <h3 className="text-sm font-semibold text-white">Data Collection</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Faculty enters verifiable academic metrics: attendance records, internal exam marks, and study habits.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-md bg-app-secondary border border-app-border flex items-center justify-center text-xs font-bold text-brand-blue">
              02
            </div>
            <h3 className="text-sm font-semibold text-white">Machine Learning Evaluation</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              The FastAPI service formats the 8 academic features and submits them to the trained Scikit-Learn pipeline.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-md bg-app-secondary border border-app-border flex items-center justify-center text-xs font-bold text-brand-blue">
              03
            </div>
            <h3 className="text-sm font-semibold text-white">Risk Stratification</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Model computes multi-class prediction probabilities and classifies the student into appropriate risk categories.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-md bg-app-secondary border border-app-border flex items-center justify-center text-xs font-bold text-brand-blue">
              04
            </div>
            <h3 className="text-sm font-semibold text-white">Advisory Remediation</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Automated diagnostic factor analysis delivers tailored recommendations to guide faculty interventions.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Shortcut Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/predict"
          className="academic-card p-5 bg-app-surface hover:bg-app-hover border border-app-border transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Evaluation Module</span>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-blue transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-white">Predict Student Performance</h3>
          <p className="text-xs text-text-secondary mt-1">
            Input student indicators and compute real-time performance predictions with model probability scores.
          </p>
        </Link>

        <Link
          to="/students"
          className="academic-card p-5 bg-app-surface hover:bg-app-hover border border-app-border transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Records System</span>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-blue transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-white">Student Directory & Records</h3>
          <p className="text-xs text-text-secondary mt-1">
            Search student profiles, view comprehensive academic indicator logs, and review historical prediction records.
          </p>
        </Link>

        <Link
          to="/dashboard"
          className="academic-card p-5 bg-app-surface hover:bg-app-hover border border-app-border transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Analytics Suite</span>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-blue transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-white">Cohort Performance Dashboard</h3>
          <p className="text-xs text-text-secondary mt-1">
            Inspect cohort distribution, study hour correlations, attendance trends, and departmental performance metrics.
          </p>
        </Link>
      </section>
    </div>
  );
}
