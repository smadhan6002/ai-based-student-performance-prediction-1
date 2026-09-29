import type { StudentInput, PredictionResult, PerformanceCategory, RiskLevel, Factor } from '../types';

/**
 * Demo Prediction Engine
 * Note: This simulates a machine learning model.
 * It uses simple heuristics for demonstration purposes.
 * In production, this would make an API call to a real ML backend (e.g., Python FastAPI).
 */
export const predictPerformance = async (data: StudentInput): Promise<PredictionResult> => {
  // Simulate network delay for AI processing effect
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Weights for different factors
  const weights = {
    attendance: 0.25,
    internalMarks: 0.25,
    assignmentAverage: 0.15,
    previousMarks: 0.15,
    studyHours: 0.10, // Max 12 hours mapped to 100
    assignmentCompletion: 0.10,
  };

  const studyHoursScore = Math.min((data.studyHours / 12) * 100, 100);

  // Penalty for failed subjects and low participation
  const failedPenalty = data.failedSubjects * 5; // 5 points deduction per failure
  const participationBonus = (data.participation / 100) * 5; 

  let score = (
    (data.attendance * weights.attendance) +
    (data.internalMarks * weights.internalMarks) +
    (data.assignmentAverage * weights.assignmentAverage) +
    (data.previousMarks * weights.previousMarks) +
    (studyHoursScore * weights.studyHours) +
    (data.assignmentCompletion * weights.assignmentCompletion)
  );

  score = score - failedPenalty + participationBonus;
  score = Math.max(0, Math.min(100, Math.round(score))); // clamp between 0 and 100

  // Determine Category & Risk
  let category: PerformanceCategory = 'At Risk';
  let riskLevel: RiskLevel = 'High';
  let confidence = 0.65 + (Math.random() * 0.25); // Random confidence between 65% and 90%

  if (score >= 80) {
    category = 'Excellent';
    riskLevel = 'Low';
    confidence += 0.05;
  } else if (score >= 60) {
    category = 'Good';
    riskLevel = 'Low';
  } else if (score >= 40) {
    category = 'Average';
    riskLevel = 'Medium';
  }

  confidence = Math.min(0.99, Number(confidence.toFixed(2)));

  // Generate Factors
  const factors: Factor[] = [
    {
      name: 'Attendance',
      value: data.attendance,
      max: 100,
      impact: data.attendance >= 75 ? 'positive' : 'negative',
      description: data.attendance >= 75 ? 'Good attendance positively influences score.' : 'Low attendance is a risk factor.'
    },
    {
      name: 'Internal Marks',
      value: data.internalMarks,
      max: 100,
      impact: data.internalMarks >= 60 ? 'positive' : 'negative',
      description: 'Core indicator of current semester understanding.'
    },
    {
      name: 'Study Hours',
      value: data.studyHours,
      max: 12,
      impact: data.studyHours >= 3 ? 'positive' : (data.studyHours < 1 ? 'negative' : 'neutral'),
      description: 'Daily independent study time.'
    },
    {
      name: 'Previous Performance',
      value: data.previousMarks,
      max: 100,
      impact: data.previousMarks >= 60 ? 'positive' : 'negative',
      description: 'Historical academic baseline.'
    }
  ];

  // Generate Recommendations
  const recommendations: string[] = [];
  
  if (data.attendance < 75) {
    recommendations.push('Improve attendance above 75% to ensure you do not miss critical lectures.');
  }
  if (data.studyHours < 2) {
    recommendations.push('Consider increasing your focused study time to at least 2-3 hours daily.');
  }
  if (data.assignmentCompletion < 80) {
    recommendations.push('Focus on completing all pending assignments. Consistent practice is key.');
  }
  if (data.failedSubjects > 0) {
    recommendations.push('Prioritize clearing previous arrears/failed subjects during this semester.');
  }
  if (data.internalMarks < 50) {
    recommendations.push('Focus on subjects with lower internal marks by seeking faculty assistance.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain consistent academic performance. You are doing great!');
    recommendations.push('Consider participating in extracurricular tech events or projects to enhance skills.');
  }

  return {
    score,
    category,
    confidence,
    riskLevel,
    factors,
    recommendations
  };
};
