import type { StudentRecord, PredictionResult } from '../types';
import { mockStudents } from '../data/mockData';

const STORAGE_KEY = 'ai_student_predictions';

export const getPredictionHistory = (): StudentRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Seed with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStudents));
    return mockStudents;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

export const savePrediction = (prediction: PredictionResult) => {
  try {
    const history = getPredictionHistory();
    const newRecord: StudentRecord = {
      ...prediction.inputSummary,
      prediction,
      date: prediction.generatedAt
    };
    
    // Replace if same student ID exists to act like an upsert, or just append
    const existingIndex = history.findIndex(r => r.id === newRecord.id);
    if (existingIndex >= 0) {
      history[existingIndex] = newRecord;
    } else {
      history.unshift(newRecord);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const clearPredictionHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage", error);
  }
};
