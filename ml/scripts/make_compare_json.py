from pathlib import Path
import json
import pandas as pd

BASE = Path(__file__).resolve().parents[2]
ML_DIR = BASE / "ml"
OUT_DIR = ML_DIR / "outputs"
DATA_DIR = BASE / "data"

OUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

STATUS_MAP = {
    "drinkable": ("Safe", "পান ও রান্নার জন্য উপযোগী"),
    "household_nonpotable": ("Caution", "গৃহস্থালী ব্যবহারে উপযোগী, কিন্তু সরাসরি পান নয়"),
    "irrigation_only": ("Caution", "মূলত সেচের জন্য উপযোগী"),
    "unsafe": ("Unsafe", "সরাসরি ব্যবহার ঝুঁকিপূর্ণ"),
}

NAME_MAP = {
    "brahmaputra": ("ব্রহ্মপুত্র নদীর পানি", "Brahmaputra River Water"),
    "pond": ("পুকুরের পানি", "Pond Water"),
    "rain": ("সংরক্ষিত বৃষ্টির পানি", "Stored Rain Water"),
    "drinking": ("পানযোগ্য পানি", "Drinking Water"),
}

def score_from_usage(usage: str) -> int:
    if usage == "drinkable":
        return 90
    if usage == "household_nonpotable":
        return 72
    if usage == "irrigation_only":
        return 58
    return 38

def main():
    df = pd.read_csv(OUT_DIR / "cleaned_dataset.csv")

    grouped = df.groupby("source_label").agg({
        "pH_smooth": "mean",
        "temp_smooth": "mean",
        "tds_smooth": "mean",
        "turbidity_smooth": "mean",
        "usage_label": lambda x: x.mode().iloc[0] if not x.mode().empty else "unsafe"
    }).reset_index()

    profiles = []

    for _, row in grouped.iterrows():
        source_id = row["source_label"]
        usage = row["usage_label"]
        status, best_use = STATUS_MAP.get(usage, ("Unsafe", "অজানা"))
        name_bn, name_en = NAME_MAP.get(source_id, (source_id, source_id))
        score = score_from_usage(usage)

        if usage == "drinkable":
            note = f"{name_bn} তুলনামূলকভাবে সবচেয়ে নিরাপদ উৎস হিসেবে চিহ্নিত হয়েছে।"
        elif usage == "household_nonpotable":
            note = f"{name_bn} গৃহস্থালী কাজে ব্যবহারযোগ্য, তবে সরাসরি পান করা উচিত নয়।"
        elif usage == "irrigation_only":
            note = f"{name_bn} কৃষি সেচের জন্য বেশি উপযোগী হিসেবে চিহ্নিত হয়েছে।"
        else:
            note = f"{name_bn} সরাসরি ব্যবহারের জন্য ঝুঁকিপূর্ণ বলে ধরা হয়েছে।"

        profiles.append({
            "id": source_id,
            "nameBn": name_bn,
            "nameEn": name_en,
            "pH": round(float(row["pH_smooth"]), 2),
            "temp": round(float(row["temp_smooth"]), 2),
            "tds": round(float(row["tds_smooth"]), 2),
            "turbidity": round(float(row["turbidity_smooth"]), 2),
            "score": score,
            "status": status,
            "bestUseBn": best_use,
            "noteBn": note
        })

    profiles = sorted(profiles, key=lambda x: x["score"], reverse=True)

    out1 = OUT_DIR / "compare_profiles.json"
    out2 = DATA_DIR / "compare_profiles.json"

    with open(out1, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)

    with open(out2, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)

    print(f"Saved: {out1}")
    print(f"Saved: {out2}")

if __name__ == "__main__":
    main()