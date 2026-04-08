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
OUT_DIR = BASE / "outputs"

CANDIDATE_FEATURES = [
    "pH_smooth",
    "temp_smooth",
    "tds_smooth",
    "turbidity_smooth",
    "pH_mean3",
    "temp_mean3",
    "tds_mean3",
    "turbidity_mean3",
    "pH_std3",
    "temp_std3",
    "tds_std3",
    "turbidity_std3",
]

def get_valid_features(df: pd.DataFrame):
    valid = []
    for col in CANDIDATE_FEATURES:
        if col in df.columns and df[col].notna().any():
            valid.append(col)
    return valid

def main():
    df = pd.read_csv(OUT_DIR / "cleaned_dataset.csv")

    FEATURES = get_valid_features(df)
    if len(FEATURES) < 2:
        raise ValueError(f"Not enough valid features found. Valid features: {FEATURES}")

    print("Using features:")
    print(FEATURES)

    X = df[FEATURES]
    y = df["source_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(
            n_estimators=300,
            max_depth=8,
            min_samples_leaf=2,
            random_state=42
        ))
    ])

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    metrics = {
        "task": "source_classification",
        "accuracy": acc,
        "features": FEATURES,
        "report": report
    }

    with open(OUT_DIR / "source_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    joblib.dump(model, OUT_DIR / "source_model.joblib")

    # confusion matrix
    labels = sorted(y.unique())
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
    disp.plot(cmap="Blues")
    plt.title("Source Classification Confusion Matrix")
    plt.tight_layout()
    plt.savefig(OUT_DIR / "source_confusion_matrix.png", dpi=200)
    plt.close()

    # feature importance
    rf = model.named_steps["clf"]
    importances = pd.Series(rf.feature_importances_, index=FEATURES).sort_values(ascending=False)
    importances.plot(kind="bar", figsize=(10, 5))
    plt.title("Source Model Feature Importance")
    plt.ylabel("Importance")
    plt.tight_layout()
    plt.savefig(OUT_DIR / "source_feature_importance.png", dpi=200)
    plt.close()

    print(f"\nSource classification accuracy: {acc:.4f}")
    print("Saved:")
    print("- source_model.joblib")
    print("- source_metrics.json")
    print("- source_confusion_matrix.png")
    print("- source_feature_importance.png")

if __name__ == "__main__":
    main()