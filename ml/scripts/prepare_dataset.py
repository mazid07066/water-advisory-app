from pathlib import Path
import pandas as pd
import numpy as np

BASE = Path(__file__).resolve().parents[1]
DATA_DIR = BASE / "data"
OUT_DIR = BASE / "outputs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FILES = [
    ("feed_kauser_12_30_brahamaputra.csv", "brahmaputra"),
    ("feed_kauser_2_05_pond water.csv", "pond"),
    ("feed_kauser_rain water_1_05.csv", "rain"),
    ("feed_kauser_drinking water_1_35.csv", "drinking"),
]

def load_and_label(filepath: Path, label: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)
    df["source_label"] = label
    return df

def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename_map = {
        "field1": "pH",
        "field2": "temp",
        "field3": "tds",
        "field4": "turbidity",
        "Temp": "temp",
        "Temperature": "temp",
        "temperature": "temp",
        "TDS ppm/L": "tds",
        "TDS": "tds",
        "TU (NTU)": "turbidity",
        "Turbidity": "turbidity",
    }

    df = df.rename(columns=rename_map)

    needed = ["created_at", "entry_id", "pH", "temp", "tds", "turbidity", "source_label"]
    for col in needed:
        if col not in df.columns:
            df[col] = np.nan

    return df[needed].copy()

def clean_numeric(df: pd.DataFrame) -> pd.DataFrame:
    for col in ["pH", "temp", "tds", "turbidity"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Convert Fahrenheit to Celsius if likely in F
    mask_f = df["temp"].between(45, 130, inclusive="both")
    df.loc[mask_f, "temp"] = (df.loc[mask_f, "temp"] - 32) * 5 / 9

    # Soft clipping for noisy low-cost sensors
    df["pH"] = df["pH"].clip(lower=0, upper=14)
    df["temp"] = df["temp"].clip(lower=0, upper=60)
    df["tds"] = df["tds"].clip(lower=0, upper=5000)
    df["turbidity"] = df["turbidity"].clip(lower=0, upper=5000)

    return df

def fill_missing_by_source(df: pd.DataFrame) -> pd.DataFrame:
    fallback = {
        "pH": 7.0,
        "temp": 25.0,
        "tds": 300.0,
        "turbidity": 10.0,
    }

    for col in ["pH", "temp", "tds", "turbidity"]:
        df[col] = df.groupby("source_label")[col].transform(
            lambda s: s.fillna(s.median())
        )
        df[col] = df[col].fillna(fallback[col])

    return df

def add_smoothed_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values(by=["source_label", "entry_id"], na_position="last").reset_index(drop=True)

    for col in ["pH", "temp", "tds", "turbidity"]:
        df[f"{col}_smooth"] = (
            df.groupby("source_label")[col]
            .transform(lambda s: s.rolling(window=5, min_periods=1, center=True).median())
        )

        df[f"{col}_mean3"] = (
            df.groupby("source_label")[col]
            .transform(lambda s: s.rolling(window=3, min_periods=1).mean())
        )

        df[f"{col}_std3"] = (
            df.groupby("source_label")[col]
            .transform(lambda s: s.rolling(window=3, min_periods=1).std().fillna(0))
        )

    return df

def assign_usage_label(row) -> str:
    """
    Hybrid weak-label logic:
    1) Try soft rule-based labeling
    2) If sensor noise makes rules unreliable, use source-aware fallback

    This is appropriate for noisy low-cost sensor data in FYDP settings.
    """
    source = row["source_label"]
    pH = row["pH_smooth"]
    tds = row["tds_smooth"]
    turb = row["turbidity_smooth"]

    # Soft rules first
    if 6.0 <= pH <= 8.8 and tds <= 500 and turb <= 8:
        return "drinkable"

    if 5.5 <= pH <= 9.0 and tds <= 800 and turb <= 20:
        return "household_nonpotable"

    if 5.0 <= pH <= 9.5 and tds <= 1200 and turb <= 50:
        return "irrigation_only"

    # Source-informed fallback
    # These are weak labels based on expected practical use of source types
    fallback_map = {
        "drinking": "drinkable",
        "rain": "household_nonpotable",
        "brahmaputra": "irrigation_only",
        "pond": "unsafe",
    }

    return fallback_map.get(source, "unsafe")

def add_usage_label(df: pd.DataFrame) -> pd.DataFrame:
    df["usage_label"] = df.apply(assign_usage_label, axis=1)
    return df

def print_quick_summary(df: pd.DataFrame):
    print("\nMissing values after cleaning:")
    print(df[["pH", "temp", "tds", "turbidity"]].isna().sum())

    print("\nFeature preview:")
    print(df[[
        "source_label", "pH", "temp", "tds", "turbidity",
        "pH_smooth", "temp_smooth", "tds_smooth", "turbidity_smooth",
        "usage_label"
    ]].head())

    print("\nSource counts:")
    print(df["source_label"].value_counts())

    print("\nUsage counts:")
    print(df["usage_label"].value_counts())

    print("\nUsage by source:")
    print(pd.crosstab(df["source_label"], df["usage_label"]))

def main():
    frames = []

    for filename, label in FILES:
        path = DATA_DIR / filename
        if not path.exists():
            raise FileNotFoundError(f"Missing file: {path}")
        frames.append(load_and_label(path, label))

    df = pd.concat(frames, ignore_index=True)
    df = standardize_columns(df)
    df = clean_numeric(df)
    df = fill_missing_by_source(df)
    df = add_smoothed_features(df)
    df = add_usage_label(df)

    output_csv = OUT_DIR / "cleaned_dataset.csv"
    df.to_csv(output_csv, index=False)

    print(f"Saved cleaned dataset to: {output_csv}")
    print_quick_summary(df)

if __name__ == "__main__":
    main()