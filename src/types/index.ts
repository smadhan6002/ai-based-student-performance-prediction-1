export type Department = 
  | 'Artificial Intelligence & Data Science'
  | 'Computer Science Engineering'
  | 'Information Technology'
  | 'Electronics & Communication Engineering'
  | 'Electrical & Electronics Engineering'
  | 'Mechanical Engineering'
  | 'Civil Engineering';

export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type Semester = 'Semester 1' | 'Semester 2' | 'Semester 3' | 'Semester 4' | 'Semester 5' | 'Semester 6' | 'Semester 7' | 'Semester 8';

export interface StudentInput {
  name: string;
  id: string;
  department: Department;
  year: Year;
  semester: Semester;
  
  attendance: number;
  internalMarks: number;
  assignmentAverage: number;
  previousMarks: number;
  studyHours: number;
  assignmentCompletion: number;
  participation: number;
  failedSubjects: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type PerformanceCategory = 'Excellent' | 'Good' | 'Average' | 'At Risk';

export interface Factor {
  name: string;
  value: number;
  max: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface PredictionResult {
  score: number;
  category: PerformanceCategory;
  confidence: number;
  riskLevel: RiskLevel;
  factors: Factor[];
  recommendations: string[];
}

export interface StudentRecord extends StudentInput {
  prediction: PredictionResult;
  date: string;
}
