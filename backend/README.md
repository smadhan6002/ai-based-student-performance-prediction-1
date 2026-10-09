# AI-Based Student Performance Prediction Backend

This directory contains the Python FastAPI backend designed to serve the trained Machine Learning model.

## Architecture

* **Framework:** FastAPI
* **Server:** Uvicorn
* **Data Validation:** Pydantic
* **Model Inference:** scikit-learn & joblib

## Endpoints

- `GET /health` : Verifies backend status and if the ML model is loaded.
- `POST /predict` : Takes student metrics and returns the predicted performance category along with prediction probabilities.
- `GET /docs` : Interactive Swagger UI for testing endpoints.

## Request Format (`POST /predict`)

```json
{
  "attendance": 88,
  "internal_marks": 82,
  "assignment_average": 91,
  "previous_semester_marks": 79,
  "study_hours": 4.5,
  "assignment_completion": 95,
  "class_participation": 85,
  "failed_subjects": 0
}
```

## Response Format

```json
{
  "prediction": "Excellent",
  "probabilities": {
    "Excellent": 0.5,
    "Good": 0.5,
    "Average": 0.0,
    "At Risk": 0.0
  }
}
```

## How to Start

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## How the Model is Loaded
The application uses FastAPI's `lifespan` context manager to load the `joblib` file `models/student_performance_model.pkl` precisely once upon startup. It stays in memory for all subsequent requests, eliminating file I/O overhead during inference.

## Limitations
* The model probabilities indicate the internal confidence of the Random Forest model regarding its own learned patterns. They should NOT be treated as a guaranteed, clinically validated real-world confidence metric.
* Ensure the request payload strictly matches the Pydantic schema validation rules.
