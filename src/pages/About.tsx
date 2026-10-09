import { 
  BookOpen, 
  Cpu, 
  Layers, 
  GraduationCap, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';

export function About() {
  const featureList = [
    { name: 'Attendance', type: 'Continuous', range: '0 – 100%', description: 'Percentage of classes attended during the semester. Major predictor of academic consistency.' },
    { name: 'Internal Marks', type: 'Continuous', range: '0 – 100', description: 'Average score obtained across continuous assessment tests (CAT-1, CAT-2).' },
    { name: 'Assignment Average', type: 'Continuous', range: '0 – 100', description: 'Mean grade obtained across practical assignments, tutorials, and laboratory records.' },
    { name: 'Previous Sem Marks', type: 'Continuous', range: '0 – 100', description: 'Cumulative grade point average (CGPA) / marks obtained in prior academic semesters.' },
    { name: 'Daily Study Hours', type: 'Continuous', range: '0 – 16 hrs', description: 'Self-reported self-study and revision hours outside of structured lecture sessions.' },
    { name: 'Assignment Completion', type: 'Continuous', range: '0 – 100%', description: 'Percentage of assigned coursework submitted on or before declared deadlines.' },
    { name: 'Class Participation', type: 'Continuous', range: '0 – 100%', description: 'Faculty assessment of classroom engagement, seminar participation, and discussions.' },
    { name: 'Subject Backlogs', type: 'Discrete', range: '0 – 15', description: 'Count of uncleared/pending courses from previous examination attempts.' },
  ];

  const techStack = [
    { title: 'Frontend Interface', tech: 'React 19 & TypeScript', detail: 'Single Page Application utilizing Tailwind CSS and Recharts with academic-grade design tokens.' },
    { title: 'Inference Backend', tech: 'Python 3.12 & FastAPI', detail: 'High-performance asynchronous REST API serving trained Scikit-Learn pipelines.' },
    { title: 'Machine Learning Model', tech: 'Random Forest Classifier', detail: 'Ensemble multi-tree decision framework producing calibrated class probability distributions.' },
    { title: 'Relational Cloud DB', tech: 'Supabase PostgreSQL', detail: 'Relational storage with UUID foreign-key constraints and Row-Level Security policies.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title & Overview */}
      <section className="border-b border-app-border pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Engineering Project Specification</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">About the Project</h1>
        <p className="text-xs text-text-muted mt-1 max-w-2xl leading-relaxed">
          AI-Based Student Performance Prediction System developed for departmental academic analysis and early intervention demonstration on College Engineering Day.
        </p>
      </section>

      {/* Abstract / Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="academic-card p-6 bg-app-surface space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-semantic-warning mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <h2 className="text-sm font-semibold text-white">The Challenge of Delayed Intervention</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Conventional university tracking mechanisms evaluate students post-facto—primarily after end-semester examinations when failing grades have already materialized. Academic advisors often lack predictive tools to systematically detect students heading toward academic distress before final assessments occur.
          </p>
        </div>

        <div className="academic-card p-6 bg-app-surface space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-semantic-success mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Proposed Solution</span>
          </div>
          <h2 className="text-sm font-semibold text-white">Supervised Multi-Indicator Evaluation</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            An automated intelligence pipeline that aggregates continuous academic and behavioural parameters to predict one of four performance tiers: Excellent, Good, Average, or At Risk. Faculty coordinators receive calibrated probability ratings and personalized remediation guidance for each student.
          </p>
        </div>
      </div>

      {/* Feature Engineering Table */}
      <section className="academic-card bg-app-surface overflow-hidden">
        <div className="p-5 border-b border-app-border">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
            <Layers className="w-4 h-4" />
            <span>Model Input Vector</span>
          </div>
          <h2 className="text-base font-semibold text-white">8 Evaluated Academic Indicators</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Statistical features utilized by the Random Forest classifier to model academic performance.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-app-border bg-app-secondary/60 text-text-muted uppercase tracking-wider font-semibold">
                <th className="p-3.5">Indicator Name</th>
                <th className="p-3.5">Data Type</th>
                <th className="p-3.5">Operating Range</th>
                <th className="p-3.5">Analytical Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {featureList.map((item) => (
                <tr key={item.name} className="hover:bg-app-hover transition-colors">
                  <td className="p-3.5 font-medium text-white">{item.name}</td>
                  <td className="p-3.5 font-mono text-text-secondary">{item.type}</td>
                  <td className="p-3.5 font-mono text-text-secondary">{item.range}</td>
                  <td className="p-3.5 text-text-muted leading-relaxed">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Architecture & Stack */}
      <section className="academic-card p-6 bg-app-surface space-y-4">
        <div className="border-b border-app-border pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
            <Cpu className="w-4 h-4" />
            <span>Engineering Architecture</span>
          </div>
          <h2 className="text-base font-semibold text-white">System Technologies & Infrastructure</h2>
          <p className="text-xs text-text-muted mt-0.5">
            End-to-end decoupled microservice architecture spanning client UI, REST gateway, and cloud persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techStack.map((tech) => (
            <div key={tech.title} className="p-4 rounded-card bg-app-secondary border border-app-border space-y-1">
              <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block">
                {tech.title}
              </span>
              <h3 className="text-sm font-semibold text-white">{tech.tech}</h3>
              <p className="text-xs text-text-secondary leading-relaxed pt-0.5">{tech.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Tiers and Remediation Framework */}
      <section className="academic-card p-6 bg-app-surface space-y-4">
        <div className="border-b border-app-border pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Classification Strategy</span>
          </div>
          <h2 className="text-base font-semibold text-white">Outcome Stratification & Remediation Matrix</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-card bg-app-secondary border border-app-border space-y-1">
            <span className="badge-academic bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Excellent
            </span>
            <div className="font-semibold text-white mt-1">Score: 80 – 100%</div>
            <p className="text-text-muted leading-normal">
              Candidate for advanced technical electives, peer tutoring roles, and research projects.
            </p>
          </div>

          <div className="p-3.5 rounded-card bg-app-secondary border border-app-border space-y-1">
            <span className="badge-academic bg-blue-500/10 text-blue-400 border border-blue-500/25">
              Good
            </span>
            <div className="font-semibold text-white mt-1">Score: 60 – 79%</div>
            <p className="text-text-muted leading-normal">
              Consistent performance. Faculty advise maintenance of study habits and timely assignment submissions.
            </p>
          </div>

          <div className="p-3.5 rounded-card bg-app-secondary border border-app-border space-y-1">
            <span className="badge-academic bg-amber-500/10 text-amber-400 border border-amber-500/25">
              Average
            </span>
            <div className="font-semibold text-white mt-1">Score: 40 – 59%</div>
            <p className="text-text-muted leading-normal">
              Medium risk. Target areas identified in internal assessments and low attendance requiring remedial sessions.
            </p>
          </div>

          <div className="p-3.5 rounded-card bg-app-secondary border border-app-border space-y-1">
            <span className="badge-academic bg-red-500/10 text-red-400 border border-red-500/25">
              At Risk
            </span>
            <div className="font-semibold text-white mt-1">Score: &lt; 40%</div>
            <p className="text-text-muted leading-normal">
              High risk. Priority counseling required. Mentor assigned to track attendance and clear pending subject backlogs.
            </p>
          </div>
        </div>
      </section>

      {/* Demonstration Metadata Footer */}
      <footer className="text-xs text-text-muted text-center pt-4 border-t border-app-border">
        AI-Based Student Performance Prediction • Department of Artificial Intelligence & Data Science • Engineering Day Project
      </footer>
    </div>
  );
}
