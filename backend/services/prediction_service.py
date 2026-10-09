import pandas as pd
import joblib
import os
import logging

logger = logging.getLogger(__name__)

# Global variable for the model
_model_pipeline = None

def load_model():
    """Load the model once on startup."""
    global _model_pipeline
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'student_performance_model.pkl')
    try:
        _model_pipeline = joblib.load(model_path)
        logger.info(f"Successfully loaded ML model from {model_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to load ML model: {e}")
        return False

def get_model():
    return _model_pipeline

def predict_student(data_dict: dict) -> dict:
    """Predict performance using the loaded model."""
    if _model_pipeline is None:
        raise RuntimeError("Model is not loaded.")
        
    df = pd.DataFrame([data_dict])
    
    expected_cols = [
        'attendance', 'internal_marks', 'assignment_average', 'previous_semester_marks',
        'study_hours', 'assignment_completion', 'class_participation', 'failed_subjects'
    ]
    df = df[expected_cols]
    
    pred_class = _model_pipeline.predict(df)[0]
    
    classes = _model_pipeline.classes_
    proba_values = _model_pipeline.predict_proba(df)[0]
    
    probabilities = {cls: round(float(prob), 4) for cls, prob in zip(classes, proba_values)}
    
    return {
        "prediction": str(pred_class),
        "probabilities": probabilities
    }
