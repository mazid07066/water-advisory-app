from pathlib import Path
import pandas as pd

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / "data"
OUT = BASE / "outputs"
OUT.mkdir(parents=True, exist_ok=True)

files = [
    ("feed_kauser_12_30_brahamaputra.csv", "brahmaputra"),
    ("feed_kauser_2_05_pond water.csv", "pond"),
    ("feed_kauser_rain water_1_05.csv", "rain"),
    ("feed_kauser_drinking water_1_35.csv", "drinking"),
]

frames = []

def read_csv_robust(path: Path) -> pd.DataFrame:
    encodings_to_try = [
        "utf-8",
        "utf-8-sig",
        "cp1252",
        "latin1",
        "iso-8859-1",
    ]

    last_error = None
    for enc in encodings_to_try:
        try:
            df = pd.read_csv(path, encoding=enc)
            print(f"[OK] Loaded {path.name} with encoding: {enc}")
            return df
        except Exception as e:
            last_error = e

    raise last_error

for filename, label in files:
    path = DATA / filename

    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    df = read_csv_robust(path)
    df["label"] = label
    frames.append(df)

df = pd.concat(frames, ignore_index=True)

# Clean column names first
df.columns = [str(col).strip() for col in df.columns]

print("\nDetected original columns:")
print(list(df.columns))

# Rename columns to standard names
rename_map = {
    "field1": "pH",
    "field2": "temp",
    "field3": "tds",
    "field4": "turbidity",
    "pH": "pH",
    "PH": "pH",
    "Temp": "temp",
    "Temp °": "temp",
    "Temp ©": "temp",
    "Temperature": "temp",
    "TDS ppm/L": "tds",
    "TDS": "tds",
    "TU (NTU)": "turbidity",
    "Turbidity": "turbidity",
    "created_at": "created_at",
    "entry_id": "entry_id",
}

df = df.rename(columns=rename_map)

print("\nColumns after rename:")
print(list(df.columns))

required_cols = ["pH", "temp", "tds", "turbidity", "label"]
missing = [c for c in required_cols if c not in df.columns]

if missing:
    print("\n[WARNING] Missing expected columns:", missing)
    print("Available columns are:", list(df.columns))
    raise ValueError("CSV column names do not match expected format.")

keep_cols = [c for c in ["created_at", "entry_id", "pH", "temp", "tds", "turbidity", "label"] if c in df.columns]
df = df[keep_cols].copy()

# Convert numeric columns
for col in ["pH", "temp", "tds", "turbidity"]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Drop rows where all sensor columns are missing
df = df.dropna(subset=["pH", "temp", "tds", "turbidity"], how="all").copy()

# Temperature correction if likely Fahrenheit
mask = df["temp"].between(45, 130, inclusive="both")
df.loc[mask, "temp"] = (df.loc[mask, "temp"] - 32) * 5 / 9

# Clip extreme values
df["pH"] = df["pH"].clip(lower=0, upper=14)
df["temp"] = df["temp"].clip(lower=0, upper=60)
df["tds"] = df["tds"].clip(lower=0, upper=3000)
df["turbidity"] = df["turbidity"].clip(lower=0, upper=500)

# Sort
sort_cols = ["label"]
if "entry_id" in df.columns:
    sort_cols.append("entry_id")
df = df.sort_values(by=sort_cols).reset_index(drop=True)

# Rolling median smoothing
for col in ["pH", "temp", "tds", "turbidity"]:
    df[f"{col}_smooth"] = (
        df.groupby("label")[col]
        .transform(lambda s: s.rolling(window=5, min_periods=1, center=True).median())
    )

# Initial usage labels
df["usage_class"] = "treatment_required"

safe_mask = (
    df["pH_smooth"].between(6.5, 8.5, inclusive="both")
    & (df["turbidity_smooth"] <= 5)
    & (df["tds_smooth"] <= 500)
)

irrigation_mask = (
    (df["tds_smooth"] <= 1000)
    & (df["turbidity_smooth"] <= 20)
)

df.loc[safe_mask, "usage_class"] = "drinkable_or_treatable"
df.loc[(~safe_mask) & irrigation_mask, "usage_class"] = "irrigation_only"
df.loc[(df["tds_smooth"] > 1000) | (df["turbidity_smooth"] > 20), "usage_class"] = "unsafe"

output_path = OUT / "cleaned_dataset.csv"
df.to_csv(output_path, index=False, encoding="utf-8-sig")

print(f"\nSaved cleaned dataset to: {output_path}")
print("\nFirst 5 rows:")
print(df.head())

print("\nLabel counts:")
print(df["label"].value_counts())

print("\nUsage class counts:")
print(df["usage_class"].value_counts())