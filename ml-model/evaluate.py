import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix

def perform_eda():
    print("Performing Exploratory Data Analysis...")
    df = pd.read_csv('dataset/student_performance.csv')
    os.makedirs('evaluation', exist_ok=True)
    
    # 1. Class Distribution
    plt.figure(figsize=(8, 6))
    sns.countplot(data=df, x='performance_category', order=['Excellent', 'Good', 'Average', 'At Risk'])
    plt.title('Class Distribution')
    plt.savefig('evaluation/eda_class_distribution.png')
    plt.close()
    
    # 2. Correlation Matrix
    plt.figure(figsize=(10, 8))
    # Map target to numeric for correlation
    target_map = {'Excellent': 4, 'Good': 3, 'Average': 2, 'At Risk': 1}
    df_corr = df.copy()
    df_corr['performance_numeric'] = df_corr['performance_category'].map(target_map)
    df_corr = df_corr.drop('performance_category', axis=1)
    sns.heatmap(df_corr.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Feature Correlation Matrix')
    plt.tight_layout()
    plt.savefig('evaluation/eda_correlation_matrix.png')
    plt.close()

def evaluate_model():
    print("Evaluating Model...")
    test_df = pd.read_csv('evaluation/test_set.csv')
    
    X_test = test_df.drop('true_category', axis=1)
    y_test = test_df['true_category']
    
    pipeline = joblib.load('models/student_performance_model.pkl')
    y_pred = pipeline.predict(X_test)
    
    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    print(f"\n--- Model Performance ---")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f} (weighted)")
    print(f"Recall:    {rec:.4f} (weighted)")
    print(f"F1-Score:  {f1:.4f} (weighted)")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred, labels=['Excellent', 'Good', 'Average', 'At Risk'])
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['Excellent', 'Good', 'Average', 'At Risk'],
                yticklabels=['Excellent', 'Good', 'Average', 'At Risk'])
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.savefig('evaluation/confusion_matrix.png')
    plt.close()
    print("Saved confusion matrix to evaluation/confusion_matrix.png")
    
    # Feature Importance
    clf = pipeline.named_steps['clf']
    feature_names = X_test.columns
    importances = clf.feature_importances_
    
    fi_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)
    
    fi_df.to_csv('evaluation/feature_importance.csv', index=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(data=fi_df, x='Importance', y='Feature', palette='viridis')
    plt.title('Random Forest Feature Importance')
    plt.tight_layout()
    plt.savefig('evaluation/feature_importance.png')
    plt.close()
    print("Saved feature importance to evaluation/feature_importance.csv and .png")

if __name__ == "__main__":
    perform_eda()
    evaluate_model()
