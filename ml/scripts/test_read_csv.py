from pathlib import Path
import pandas as pd

DATA = Path("ml/data")

files = list(DATA.glob("*.csv"))

encodings = ["utf-8", "utf-8-sig", "cp1252", "latin1", "iso-8859-1"]

for file in files:
    print(f"\nChecking: {file.name}")
    loaded = False
    for enc in encodings:
        try:
            df = pd.read_csv(file, encoding=enc)
            print(f"  OK with {enc}")
            print(f"  Columns: {list(df.columns)}")
            loaded = True
            break
        except Exception as e:
            print(f"  Failed with {enc}: {type(e).__name__}")
    if not loaded:
        print("  Could not read this file with tested encodings.")