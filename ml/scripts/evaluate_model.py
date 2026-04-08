from pathlib import Path
import json
import pandas as pd
import joblib
from sklearn.metrics import classification_report

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / "outputs"

df = pd.read_csv(OUT / "cleaned_dataset.csv")
model = joblib.load(OUT / "water_source_model.joblib")

feature_cols = [
    "pH_smooth",
    "temp_smooth",
    "tds_smooth",
    "turbidity_smooth",
]

X = df[feature_cols]
pred = model.predict(X)

report = classification_report(df["label"], pred)
print(report)

sample = X.iloc[[0]]
sample_pred = model.predict(sample)[0]
sample_prob = model.predict_proba(sample)[0]

print("Sample prediction:", sample_pred)
print("Class probabilities:", sample_prob)

with open(OUT / "quick_eval.txt", "w", encoding="utf-8") as f:
    f.write(report)