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

export const predictStudentPerformance = async (data: StudentInput): Promise<PredictionResult> => {
  // Simulate network delay for AI processing effect
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Future API call: 
  // const response = await fetch('/predict', { method: 'POST', body: JSON.stringify(data) });
  // return response.json();
  
  return demoPrediction(data);
};
