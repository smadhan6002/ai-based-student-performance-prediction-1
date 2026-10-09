import pandas as pd
import numpy as np
import os

def generate_synthetic_dataset(num_records=1500, random_state=42):
    np.random.seed(random_state)
    
    # 1. Base Profiles
    # To create overlap and realistic groupings, we define three "student profiles"
    # Profile 1: High performers (30%)
    # Profile 2: Average performers (50%)
    # Profile 3: Struggling performers (20%)
    
    profiles = np.random.choice([0, 1, 2], size=num_records, p=[0.3, 0.5, 0.2])
    
    data = []
    for p in profiles:
        if p == 0: # High
            att = np.random.normal(90, 8)
            int_m = np.random.normal(85, 10)
            ass_a = np.random.normal(88, 8)
            prev_m = np.random.normal(82, 10)
            study = np.random.normal(5, 1.5)
            ass_c = np.random.normal(92, 8)
            part = np.random.normal(80, 12)
            fail = np.random.poisson(0.1)
        elif p == 1: # Average
            att = np.random.normal(75, 12)
            int_m = np.random.normal(65, 12)
            ass_a = np.random.normal(70, 10)
            prev_m = np.random.normal(68, 12)
            study = np.random.normal(3, 1.5)
            ass_c = np.random.normal(75, 15)
            part = np.random.normal(60, 15)
            fail = np.random.poisson(0.5)
        else: # Struggling
            att = np.random.normal(55, 15)
            int_m = np.random.normal(45, 15)
            ass_a = np.random.normal(50, 15)
            prev_m = np.random.normal(48, 15)
            study = np.random.normal(1.5, 1.0)
            ass_c = np.random.normal(50, 20)
            part = np.random.normal(40, 15)
            fail = np.random.poisson(2.0)
            
        # Add a bit of random noise to everything to create overlaps
        att += np.random.normal(0, 5)
        int_m += np.random.normal(0, 5)
        
        # Clamp values to logical ranges
        att = np.clip(att, 0, 100)
        int_m = np.clip(int_m, 0, 100)
        ass_a = np.clip(ass_a, 0, 100)
        prev_m = np.clip(prev_m, 0, 100)
        study = np.clip(study, 0, 12)
        ass_c = np.clip(ass_c, 0, 100)
        part = np.clip(part, 0, 100)
        fail = np.clip(fail, 0, 10)
        
        # Compute a hidden "true score" to assign targets, but add noise so no single feature defines it
        true_score = (
            (att * 0.20) + 
            (int_m * 0.20) + 
            (ass_a * 0.15) + 
            (prev_m * 0.15) + 
            ((study / 12 * 100) * 0.10) + 
            (ass_c * 0.10) + 
            (part * 0.10)
        )
        
        # Penalty for fails
        if fail == 1: true_score -= 5
        elif fail == 2: true_score -= 10
        elif fail == 3: true_score -= 15
        elif fail >= 4: true_score -= 20
            
        true_score += np.random.normal(0, 8) # Target noise
        true_score = np.clip(true_score, 0, 100)
        
        # Assign category
        if true_score >= 80:
            category = 'Excellent'
        elif true_score >= 60:
            category = 'Good'
        elif true_score >= 40:
            category = 'Average'
        else:
            category = 'At Risk'
            
        data.append([att, int_m, ass_a, prev_m, study, ass_c, part, fail, category])
        
    df = pd.DataFrame(data, columns=[
        'attendance', 'internal_marks', 'assignment_average', 'previous_semester_marks',
        'study_hours', 'assignment_completion', 'class_participation', 'failed_subjects', 
        'performance_category'
    ])
    
    # Round float values
    for col in df.columns[:-1]:
        if col == 'failed_subjects':
            df[col] = df[col].astype(int)
        elif col == 'study_hours':
            df[col] = df[col].round(1)
        else:
            df[col] = df[col].round(0).astype(int)
            
    return df

if __name__ == "__main__":
    os.makedirs('dataset', exist_ok=True)
    
    print("Generating synthetic dataset...")
    df = generate_synthetic_dataset(1500)
    
    # Data Validation
    print("Dataset Shape:", df.shape)
    print("Missing Values:\n", df.isnull().sum())
    print("Duplicates:", df.duplicated().sum())
    print("Class Distribution:\n", df['performance_category'].value_counts())
    
    # Check ranges
    assert df['attendance'].between(0, 100).all(), "Attendance out of range"
    assert df['study_hours'].between(0, 12).all(), "Study hours out of range"
    assert df['failed_subjects'].between(0, 10).all(), "Failed subjects out of range"
    
    df.to_csv('dataset/student_performance.csv', index=False)
    print("Dataset saved to dataset/student_performance.csv")
