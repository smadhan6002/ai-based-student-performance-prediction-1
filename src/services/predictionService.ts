import type { StudentInput, PredictionResult, PerformanceCategory, RiskLevel, FactorBreakdown } from '../types';

/**
 * Demo Prediction Engine
 * Note: This simulates a machine learning model based on a weighted mathematical formula.
 * In production, this would make an API call to a real ML backend (e.g., Python FastAPI).
 */
const demoPrediction = (data: StudentInput): PredictionResult => {
  // Weights
  const weights = {
    attendance: 0.20,
    internalMarks: 0.20,
    assignmentAverage: 0.15,
    previousMarks: 0.15,
    studyHours: 0.10,
    assignmentCompletion: 0.10,
    participation: 0.10,
  };

  const studyHoursNormalized = Math.min((data.studyHours / 12) * 100, 100);

  const breakdown: FactorBreakdown[] = [
    { name: 'Attendance', value: data.attendance, weight: 20, contribution: data.attendance * weights.attendance, max: 100 },
    { name: 'Internal Marks', value: data.internalMarks, weight: 20, contribution: data.internalMarks * weights.internalMarks, max: 100 },
    { name: 'Assignment Average', value: data.assignmentAverage, weight: 15, contribution: data.assignmentAverage * weights.assignmentAverage, max: 100 },
    { name: 'Previous Marks', value: data.previousMarks, weight: 15, contribution: data.previousMarks * weights.previousMarks, max: 100 },
    { name: 'Study Hours', value: data.studyHours, weight: 10, contribution: studyHoursNormalized * weights.studyHours, max: 12 },
    { name: 'Assignment Completion', value: data.assignmentCompletion, weight: 10, contribution: data.assignmentCompletion * weights.assignmentCompletion, max: 100 },
    { name: 'Participation', value: data.participation, weight: 10, contribution: data.participation * weights.participation, max: 100 },
  ];

  let baseScore = breakdown.reduce((acc, curr) => acc + curr.contribution, 0);

  // Failed subjects penalty
  let penalty = 0;
  if (data.failedSubjects === 1) penalty = 5;
  else if (data.failedSubjects === 2) penalty = 10;
  else if (data.failedSubjects === 3) penalty = 15;
  else if (data.failedSubjects >= 4) penalty = 20;

  let finalScore = Math.round(baseScore - penalty);
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine Category & Risk
  let category: PerformanceCategory = 'At Risk';
  let riskLevel: RiskLevel = 'High Risk';

  if (finalScore >= 80) {
    category = 'Excellent';
    riskLevel = 'Low Risk';
  } else if (finalScore >= 60) {
    category = 'Good';
    riskLevel = 'Low Risk';
  } else if (finalScore >= 40) {
    category = 'Average';
    riskLevel = 'Medium Risk';
  } else {
    category = 'At Risk';
    riskLevel = 'High Risk';
  }

  // Adjust risk based on critical factors
  if (data.attendance < 60) {
    riskLevel = riskLevel === 'Low Risk' ? 'Medium Risk' : 'High Risk';
  }
  if (data.failedSubjects >= 3) {
    riskLevel = riskLevel === 'Low Risk' ? 'Medium Risk' : 'High Risk';
  }
  if (data.attendance < 50 || data.failedSubjects >= 4) {
    riskLevel = 'High Risk';
  }

  // Demo Confidence Indicator
  let confidence = 70;
  if (data.attendance !== undefined) confidence += 5;
  if (data.internalMarks !== undefined) confidence += 5;
  if (data.previousMarks !== undefined) confidence += 5;
  if (data.assignmentAverage !== undefined) confidence += 5;
  if (data.studyHours !== undefined) confidence += 5;
  if (data.participation !== undefined) confidence += 5;
  confidence = Math.min(95, confidence);

  // Positive and Negative Factors
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  const recommendations: string[] = [];

  if (data.attendance >= 85) {
    positiveFactors.push("Strong attendance is supporting the student's performance.");
  } else if (data.attendance < 75) {
    negativeFactors.push("Attendance is below the recommended level.");
    recommendations.push("Improve attendance and aim to maintain at least 75–85% participation.");
  }

  if (data.internalMarks >= 80) {
    positiveFactors.push("Strong internal assessment performance.");
  } else if (data.internalMarks < 60) {
    negativeFactors.push("Internal assessment marks require improvement.");
    recommendations.push("Focus on internal assessments and clarify difficult topics with faculty.");
  }

  if (data.assignmentCompletion >= 85) {
    positiveFactors.push("Consistent assignment completion.");
  } else if (data.assignmentCompletion < 70) {
    negativeFactors.push("Low assignment completion may affect academic performance.");
    recommendations.push("Complete pending assignments consistently.");
  }

  if (data.studyHours >= 4) {
    positiveFactors.push("Consistent study time is supporting performance.");
  } else if (data.studyHours < 2) {
    negativeFactors.push("Study time appears limited.");
    recommendations.push("Gradually increase focused study time.");
  }

  if (data.participation >= 75) {
    positiveFactors.push("Good classroom engagement.");
  } else if (data.participation < 60) {
    negativeFactors.push("Low classroom participation.");
    recommendations.push("Participate more actively in classroom discussions and activities.");
  }

  if (data.failedSubjects > 0) {
    negativeFactors.push("Previous failed subjects indicate an academic risk factor.");
    recommendations.push("Prioritize clearing pending subjects and strengthen foundational concepts.");
  }

  if (negativeFactors.length === 0) {
    recommendations.push("Maintain your current academic routine and continue consistent performance.");
  }

  return {
    score: finalScore,
    category,
    riskLevel,
    confidence,
    confidenceType: "Demo Confidence",
    breakdown,
    positiveFactors,
    negativeFactors,
    recommendations,
    inputSummary: { ...data },
    generatedAt: new Date().toISOString()
  };
};

export const predictWithMLModel = async (data: StudentInput): Promise<PredictionResult> => {
  // In development: VITE_ML_API_URL is unset (empty), so apiUrl = '' and requests go to
  // /predict (relative URL). The Vite dev-server proxy forwards this to http://localhost:8000/predict.
  // In production: set VITE_ML_API_URL=https://your-api.com to use an absolute URL directly.
  const apiUrl = import.meta.env.VITE_ML_API_URL ?? '';
  
  // Call FastAPI backend.
  // Student identity fields (student_name, student_id, department, year, semester) are sent
  // for Supabase persistence. FastAPI extracts only the 8 numeric fields before calling the ML model.
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Identity — persisted in Supabase, not passed to ML model
        student_name:  data.name,
        student_id:    data.id,
        department:    data.department,
        year:          data.year,
        semester:      data.semester,
        // Academic inputs — sent to both ML model and Supabase
        attendance:               Number(data.attendance),
        internal_marks:           Number(data.internalMarks),
        assignment_average:       Number(data.assignmentAverage),
        previous_semester_marks:  Number(data.previousMarks),
        study_hours:              Number(data.studyHours),
        assignment_completion:    Number(data.assignmentCompletion),
        class_participation:      Number(data.participation),
        failed_subjects:          Number(data.failedSubjects),
      })
    });
  } catch {
    // Network-level error: server unreachable, CORS blocked at preflight, etc.
    throw new Error('Failed to fetch — network error or server unreachable.');
  }


  if (!response.ok) {
    throw new Error(`Failed to fetch from ML backend. Status: ${response.status}`);
  }

  const result = await response.json();
  const rawCategory: string = result.prediction ?? '';

  // Normalize probabilities: backend may return "At Risk" (with space) or "At_Risk" (underscore)
  // depending on Pydantic serialization. Standardize to space-separated display keys.
  const rawProbabilities: Record<string, number> = result.probabilities || {};
  const probabilities: Record<string, number> = {};
  for (const [key, val] of Object.entries(rawProbabilities)) {
    const normalizedKey = key.replace(/_/g, ' '); // "At_Risk" → "At Risk"
    probabilities[normalizedKey] = val as number;
  }

  // Normalize category key (handles "At_Risk" → "At Risk")
  const normalizedCategory = rawCategory.replace(/_/g, ' ') as PerformanceCategory;
  const maxProbability = probabilities[normalizedCategory] ?? probabilities[rawCategory] ?? 0;

  // Reuse the demo engine for Student Input Analysis (factor bars) and rule-based recommendations.
  // These are clearly labelled in the UI — NOT falsely claimed to be direct ML model outputs.
  const demoRes = demoPrediction(data);
  
  // Risk level derived from the ML-predicted category
  let riskLevel: RiskLevel = 'High Risk';
  if (normalizedCategory === 'Excellent' || normalizedCategory === 'Good') riskLevel = 'Low Risk';
  else if (normalizedCategory === 'Average') riskLevel = 'Medium Risk';
  
  // Express max class probability as a percentage for the "Model Probability" panel
  const probabilityPercentage = Math.round(maxProbability * 100);

  return {
    ...demoRes,
    score: probabilityPercentage, 
    category: normalizedCategory,
    confidence: probabilityPercentage,
    confidenceType: "Model Probability",
    probabilities: probabilities,
    riskLevel,
    generatedAt: new Date().toISOString()
  };
};

export const predictStudentPerformance = async (data: StudentInput): Promise<PredictionResult> => {
  // Simulate network delay for AI processing effect
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Future API call: 
  // const response = await fetch('/predict', { method: 'POST', body: JSON.stringify(data) });
  // return response.json();
  
  return demoPrediction(data);
};
