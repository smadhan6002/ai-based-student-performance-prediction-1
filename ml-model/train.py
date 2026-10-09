import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def main():
    print("Loading dataset...")
    df = pd.read_csv('dataset/student_performance.csv')
    
    X = df.drop('performance_category', axis=1)
    y = df['performance_category']
    
    # Stratified split to maintain class distribution
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 1. Baseline Model (Logistic Regression)
    print("\nTraining Baseline Model (Logistic Regression)...")
    baseline_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000, random_state=42))
    ])
    baseline_pipeline.fit(X_train, y_train)
    
    base_preds = baseline_pipeline.predict(X_test)
    base_acc = accuracy_score(y_test, base_preds)
    print(f"Baseline Accuracy: {base_acc:.4f}")
    
    # 2. Main Model (Random Forest)
    print("\nTraining Random Forest Classifier...")
    rf_pipeline = Pipeline([
        # StandardScaler isn't strictly necessary for RF, but good for pipeline consistency
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])
    rf_pipeline.fit(X_train, y_train)
    
    rf_preds = rf_pipeline.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"Random Forest Accuracy: {rf_acc:.4f}")
    
    # Save the best model
    os.makedirs('models', exist_ok=True)
    model_path = 'models/student_performance_model.pkl'
    joblib.dump(rf_pipeline, model_path)
    
    # Save the test set for evaluation script
    os.makedirs('evaluation', exist_ok=True)
    test_data = X_test.copy()
    test_data['true_category'] = y_test
    test_data.to_csv('evaluation/test_set.csv', index=False)
    
    print(f"\nModel saved successfully to {model_path}")

if __name__ == '__main__':
    main()
