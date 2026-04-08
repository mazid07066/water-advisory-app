from pathlib import Path
import json

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / "outputs"

rules = {
    "version": 1,
    "notes": "Explainable advisory rules for web deployment",
    "drinkable": {
        "ph_min": 6.5,
        "ph_max": 8.5,
        "tds_max": 500,
        "turbidity_max": 5
    },
    "irrigation": {
        "tds_max": 1000,
        "turbidity_max": 20
    }
}

with open(OUT / "web_rules.json", "w", encoding="utf-8") as f:
    json.dump(rules, f, indent=2)

print("Saved rules to web_rules.json")