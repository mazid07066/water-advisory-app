from pathlib import Path
import json
import pandas as pd

BASE = Path(__file__).resolve().parents[2]
ML_DIR = BASE / "ml"
OUT_DIR = ML_DIR / "outputs"
DATA_DIR = BASE / "data"

OUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

FEATURES = ["pH_smooth", "temp_smooth", "tds_smooth", "turbidity_smooth"]

def build_artifact(df: pd.DataFrame, label_col: str):
    mins = {}
    maxs = {}
    centroids = {}

    for feature in FEATURES:
        mins[feature] = float(df[feature].min())
        maxs[feature] = float(df[feature].max())

    for label, group in df.groupby(label_col):
        centroids[label] = {
            feature: float(group[feature].mean()) for feature in FEATURES
        }

    return {
        "features": FEATURES,
        "mins": mins,
        "maxs": maxs,
        "centroids": centroids
    }

def main():
    df = pd.read_csv(OUT_DIR / "cleaned_dataset.csv")

    source_artifact = build_artifact(df, "source_label")
    usage_artifact = build_artifact(df, "usage_label")

    source_out = DATA_DIR / "source_model_artifact.json"
    usage_out = DATA_DIR / "usage_model_artifact.json"

    with open(source_out, "w", encoding="utf-8") as f:
        json.dump(source_artifact, f, indent=2, ensure_ascii=False)

    with open(usage_out, "w", encoding="utf-8") as f:
        json.dump(usage_artifact, f, indent=2, ensure_ascii=False)

    print(f"Saved: {source_out}")
    print(f"Saved: {usage_out}")

if __name__ == "__main__":
    main()