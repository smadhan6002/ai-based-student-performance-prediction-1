import type { StudentRecord, StudentInput } from '../types';

const mockInputs: StudentInput[] = [
  {
    name: 'Madhan S',
    id: 'ST2023001',
    department: 'Artificial Intelligence & Data Science',
    year: '3rd Year',
    semester: 'Semester 5',
    attendance: 88,
    internalMarks: 82,
    assignmentAverage: 91,
    previousMarks: 79,
    studyHours: 4.5,
    assignmentCompletion: 95,
    participation: 85,
    failedSubjects: 0
  },
  {
    name: 'Priya K',
    id: 'ST2023002',
    department: 'Computer Science Engineering',
    year: '4th Year',
    semester: 'Semester 7',
    attendance: 95,
    internalMarks: 90,
    assignmentAverage: 92,
    previousMarks: 88,
    studyHours: 6,
    assignmentCompletion: 100,
    participation: 90,
    failedSubjects: 0
  },
  {
    name: 'Rahul V',
    id: 'ST2023003',
    department: 'Information Technology',
    year: '2nd Year',
    semester: 'Semester 3',
    attendance: 65,
    internalMarks: 52,
    assignmentAverage: 60,
    previousMarks: 55,
    studyHours: 1.5,
    assignmentCompletion: 70,
    participation: 40,
    failedSubjects: 1
  },
  {
    name: 'Sneha M',
    id: 'ST2023004',
    department: 'Electronics & Communication Engineering',
    year: '3rd Year',
    semester: 'Semester 5',
    attendance: 40,
    internalMarks: 35,
    assignmentAverage: 45,
    previousMarks: 42,
    studyHours: 0.5,
    assignmentCompletion: 50,
    participation: 20,
    failedSubjects: 3
  }
];

export const mockStudents: StudentRecord[] = mockInputs.map(input => {
  // We mock the prediction so we don't have to duplicate the logic here.
  // The storage will initialize it properly. For now we can just provide a dummy structure
  // that won't be used since the UI relies on dynamic data or localStorage.
  return {
    ...input,
    date: new Date().toISOString(),
    prediction: {
      score: 75,
      category: 'Good',
      riskLevel: 'Low Risk',
      confidence: 90,
      confidenceType: "Demo Confidence",
      breakdown: [],
      positiveFactors: [],
      negativeFactors: [],
      recommendations: [],
      inputSummary: input,
      generatedAt: new Date().toISOString()
    }
  } as StudentRecord;
});
