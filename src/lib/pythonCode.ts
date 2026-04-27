/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PYTHON_CODE = `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler

# 1. DATASET GENERATION (Simulating Internship Data)
def generate_sample_data(n_samples=200):
    np.random.seed(42)
    data = {
        'Hours_Worked': np.random.randint(20, 50, n_samples),
        'Complexity_Score': np.random.randint(1, 11, n_samples),
        'Previous_Feedback': np.random.uniform(1, 5, n_samples),
        'Focus_Level': np.random.randint(1, 11, n_samples),
        'Technical_Skill_Score': np.random.randint(1, 10, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Simple logic for target: Completion Status (1=Completed, 0=Delayed)
    # Status depends on hours, feedback score, and complexity
    calc = (df['Hours_Worked'] * 0.4 + df['Previous_Feedback'] * 10 + df['Focus_Level'] * 2) - (df['Complexity_Score'] * 5)
    df['Completion_Status'] = (calc > 25).astype(int)
    
    return df

# 2. DATA PREPROCESSING
print("--- Step 1: Loading & Preprocessing Data ---")
df = generate_sample_data()
print(df.head())

X = df.drop('Completion_Status', axis=1)
y = df['Completion_Status']

# Scaling features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Splitting data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 3. MODEL BUILDING (Random Forest)
print("\\n--- Step 2: Training Machine Learning Model ---")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 4. TESTING & EVALUATION
print("\\n--- Step 3: Model Evaluation ---")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 5. VISUALIZATION
def plot_results():
    plt.figure(figsize=(10, 6))
    
    # Feature Importance Plot
    importances = model.feature_importances_
    features = X.columns
    indices = np.argsort(importances)

    plt.title('Feature Importances for Internship Task Completion')
    plt.barh(range(len(indices)), importances[indices], color='b', align='center')
    plt.yticks(range(len(indices)), [features[i] for i in indices])
    plt.xlabel('Relative Importance')
    plt.show()

# 6. PRODUCTIVITY PREDICTION FUNCTION
def predict_performance(hours, complexity, feedback, focus, skill):
    sample = np.array([[hours, complexity, feedback, focus, skill]])
    sample_scaled = scaler.transform(sample)
    prediction = model.predict(sample_scaled)
    prob = model.predict_proba(sample_scaled)[0][1]
    
    status = "Likely to Complete On-Time" if prediction[0] == 1 else "Risk of Delay"
    return status, prob

# Example Usage
print("\\n--- Interactive Prediction Example ---")
status, confidence = predict_performance(45, 8, 4.5, 9, 8)
print(f"Prediction: {status} (Confidence: {confidence*100:.2f}%)")

if __name__ == "__main__":
    plot_results()
`;

export const EXECUTION_GUIDE = `
### How to Run this Project

#### 1. Setup Environment
- Install Python (v3.8 or higher) from [python.org](https://python.org).
- Install required libraries:
  \`\`\`bash
  pip install pandas numpy scikit-learn matplotlib seaborn
  \`\`\`

#### 2. Running in Jupyter Notebook
1. Open Jupyter Notebook.
2. Create a new Python 3 notebook.
3. Copy-paste the provided code sections (Data Generation, Preprocessing, Model, Visualization) into separate cells.
4. Run cells sequentially (Shift + Enter).

#### 3. Running in VS Code
1. Create a file named \`internship_analysis.py\`.
2. Paste the full code into the file.
3. Open a terminal in VS Code.
4. Run command: \`python internship_analysis.py\`.

#### 4. Expected Output
- **Model Accuracy**: Should be around 85-95%.
- **Graphs**: A horizontal bar chart showing which factor (e.g., Hours Worked vs. Focus) affects task completion most.
- **Console**: Look for "Feature Importances" and "Interactive Prediction Example".
`;
