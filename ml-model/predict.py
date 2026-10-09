import pandas as pd
import joblib

def predict_student(student_data):
    """
    Predicts the performance category and probabilities for a single student.
    
    Expected student_data dict keys:
    - attendance
    - internal_marks
    - assignment_average
    - previous_semester_marks
    - study_hours
    - assignment_completion
    - class_participation
    - failed_subjects
    """
    # Load model
    try:
        pipeline = joblib.load('models/student_performance_model.pkl')
    except FileNotFoundError:
        return {"error": "Model not found. Please run train.py first."}
    
    # Convert dict to DataFrame
    df = pd.DataFrame([student_data])
    
    # Ensure correct column order
    expected_cols = [
        'attendance', 'internal_marks', 'assignment_average', 'previous_semester_marks',
        'study_hours', 'assignment_completion', 'class_participation', 'failed_subjects'
    ]
    df = df[expected_cols]
    
    # Predict
    pred_class = pipeline.predict(df)[0]
    
    # Probabilities
    classes = pipeline.classes_
    proba_values = pipeline.predict_proba(df)[0]
    
    probabilities = {cls: round(prob, 4) for cls, prob in zip(classes, proba_values)}
    
    return {
        "prediction": pred_class,
        "probabilities": probabilities
    }

if __name__ == "__main__":
    sample_student = {
        "attendance": 88,
        "internal_marks": 82,
        "assignment_average": 91,
        "previous_semester_marks": 79,
        "study_hours": 4.5,
        "assignment_completion": 95,
        "class_participation": 85,
        "failed_subjects": 0
    }
    
    print("Testing prediction on sample student:")
    print(sample_student)
    
    result = predict_student(sample_student)
    print("\nResult:")
    import json
    print(json.dumps(result, indent=2))
