# AI-Based Student Performance Prediction (ML Environment)

## Project
This directory contains the machine learning environment for the **AI-Based Student Performance Prediction** prototype.

## Objective
To predict a student's academic performance category using multiple academic and behavioural indicators. The aim is to identify at-risk students early using predictive analytics.

## Dataset
**IMPORTANT:** The dataset used in this prototype (`dataset/student_performance.csv`) is **synthetic**. It was programmatically generated specifically for an Engineering Day prototype demonstration. It contains realistic variance, correlations, and overlaps, but it does **not** represent real student records.

## Features
The model uses the following input features to generate predictions:
- `attendance` (0-100%)
- `internal_marks` (0-100)
- `assignment_average` (0-100)
- `previous_semester_marks` (0-100)
- `study_hours` (0-12 hours)
- `assignment_completion` (0-100%)
- `class_participation` (0-100%)
- `failed_subjects` (0-10)

Target Classes: `Excellent`, `Good`, `Average`, `At Risk`

## Models
1. **Logistic Regression (Baseline):** A simple linear model trained first to establish a baseline performance metric.
2. **Random Forest Classifier:** An ensemble learning method used as the primary predictive model. It captures non-linear relationships well and provides feature importance.

## Evaluation
The models are evaluated using a strict 80/20 stratified train-test split. The evaluation script generates:
- **Accuracy**
- **Precision (Weighted)**
- **Recall (Weighted)**
- **F1-score (Weighted)**
- **Confusion Matrix:** Saved in the `evaluation/` folder.
- **Feature Importance:** Analyzed for the Random Forest to see which factors contribute most to the predictions.

## Limitations & Disclaimer
- **Synthetic Data:** The dataset is synthetic. Therefore, the models are trained on simulated patterns.
- **Demonstration Only:** The results are strictly for demonstration purposes. Model performance on real, unseen student data may differ significantly.
- **No Guaranteed Outcomes:** The probabilities provided by the model are mathematical estimations based on the training data, not absolute certainties.
- **Real Deployment:** Any real-world deployment requires properly collected, anonymized, and ethically handled institutional data.
