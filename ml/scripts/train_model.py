from pathlib import Path
import json
import joblib
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / "outputs"

df = pd.read_csv(OUT / "cleaned_dataset.csv")

feature_cols = [
    "pH_smooth",
    "temp_smooth",
    "tds_smooth",
    "turbidity_smooth",
]

X = df[feature_cols]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("clf", RandomForestClassifier(
        n_estimators=200,
        max_depth=6,
        min_samples_leaf=2,
        random_state=42
    ))
])

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)

metrics = {
    "accuracy": acc,
    "features": feature_cols,
    "report": report,
}

with open(OUT / "metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)

joblib.dump(model, OUT / "water_source_model.joblib")

cm = confusion_matrix(y_test, y_pred, labels=sorted(y.unique()))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=sorted(y.unique()))
disp.plot(cmap="Blues")
plt.title("Water Source Classification Confusion Matrix")
plt.tight_layout()
plt.savefig(OUT / "confusion_matrix.png", dpi=200)
plt.close()

rf = model.named_steps["clf"]
importances = pd.Series(rf.feature_importances_, index=feature_cols).sort_values(ascending=False)
importances.plot(kind="bar")
plt.ylabel("Importance")
plt.title("Feature Importance")
plt.tight_layout()
plt.savefig(OUT / "feature_importance.png", dpi=200)
plt.close()

print(f"Accuracy: {acc:.4f}")
print("Saved model, metrics, confusion matrix, and feature importance plot.")