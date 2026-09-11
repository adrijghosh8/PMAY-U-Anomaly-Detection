"""
prepare_data.py

Converts the research project's CSV outputs into clean JSON files used
by the frontend. Run this again any time the backend regenerates its
CSVs, to refresh the dashboard's data.

Usage:
    python scripts/prepare_data.py

Reads from:  ../research/  (a copy of the backend's reports/ and experiments/ folders)
Writes to:   ../src/data/
"""
import json
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "research"
OUT = ROOT / "src" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def read_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def to_num(v):
    try:
        if v is None or v == "":
            return None
        f = float(v)
        return int(f) if f.is_integer() else f
    except (TypeError, ValueError):
        return v


def write_json(name, data):
    with open(OUT / name, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"wrote {name}")


# ---------------------------------------------------------------
# 1. Dataset summary (table1)
# ---------------------------------------------------------------
rows = read_csv(SRC / "reports/tables/table1_dataset_summary.csv")
dataset_summary = {r["Metric"]: to_num(r["Value"]) for r in rows}
write_json("dataset_summary.json", dataset_summary)

# ---------------------------------------------------------------
# 2. Model comparison (table2)
# ---------------------------------------------------------------
rows = read_csv(SRC / "reports/tables/table2_model_comparison.csv")
model_comparison = [
    {
        "model": r["Model"],
        "configuration": r["Selected Configuration"],
        "stability": to_num(r["Top-5% Stability"]),
        "stabilitySd": to_num(r["Stability_SD"]),
    }
    for r in rows
]
write_json("model_comparison.json", model_comparison)

# ---------------------------------------------------------------
# 3. Detection summary (table3)
# ---------------------------------------------------------------
rows = read_csv(SRC / "reports/tables/table3_detection_summary.csv")
detection_summary = {r["Metric"]: to_num(r["Value"]) for r in rows}
write_json("detection_summary.json", detection_summary)

# ---------------------------------------------------------------
# 4. Top 20 anomaly candidates (full record, for the table page)
# ---------------------------------------------------------------
rows = read_csv(SRC / "experiments/results/top20_anomalies.csv")
top20 = []
for r in rows:
    top20.append({
        "rank": to_num(r["Anomaly_Rank"]),
        "country": r["Country"],
        "state": r["State"],
        "year": r["Year"],
        "city": r["City"],
        "investment": to_num(r["Investment"]),
        "centralAssistanceSanctioned": to_num(r["Central_assistance_sanctioned"]),
        "centralAssistanceReleased": to_num(r["Central_assistance_released"]),
        "housesSanctioned": to_num(r["Houses_sanctioned"]),
        "housesGrounded": to_num(r["Houses_grounded"]),
        "housesCompleted": to_num(r["Houses_completed"]),
        "anomalyScore": to_num(r["Anomaly_Score"]),
        "priority": r["Priority"],
    })
write_json("top20_anomalies.json", top20)

# ---------------------------------------------------------------
# 5. Top 10 anomaly explanations, grouped by anomaly (rank = index+1)
# ---------------------------------------------------------------
rows = read_csv(SRC / "experiments/results/top10_anomaly_explanations.csv")
by_index = {}
for r in rows:
    idx = int(r["Anomaly_Index"])
    by_index.setdefault(idx, {"rank": idx + 1, "city": r["City"], "features": []})
    by_index[idx]["features"].append({
        "feature": r["Feature"],
        "originalValue": to_num(r["Original_Value"]),
        "referenceMedian": to_num(r["Reference_Median"]),
        "originalScore": to_num(r["Original_Score"]),
        "modifiedScore": to_num(r["Modified_Score"]),
        "scoreChange": to_num(r["Score_Change"]),
        "absoluteInfluence": to_num(r["Absolute_Influence"]),
    })
explanations = [by_index[k] for k in sorted(by_index)]
write_json("top10_explanations.json", explanations)

# ---------------------------------------------------------------
# 6. Feature influence summary (overall, across top 10 anomalies)
# ---------------------------------------------------------------
rows = read_csv(SRC / "experiments/results/feature_influence_summary.csv")
feature_influence = [
    {
        "feature": r["Feature"],
        "meanInfluence": to_num(r["Mean_Influence"]),
        "medianInfluence": to_num(r["Median_Influence"]),
        "maxInfluence": to_num(r["Max_Influence"]),
    }
    for r in rows
]
feature_influence.sort(key=lambda x: x["meanInfluence"], reverse=True)
write_json("feature_influence.json", feature_influence)

# ---------------------------------------------------------------
# 7. State-level anomaly distribution (table6)
# ---------------------------------------------------------------
rows = read_csv(SRC / "reports/tables/table6_state_anomaly_distribution.csv")
state_anomaly = [
    {
        "state": r["State"],
        "totalObservations": to_num(r["Total_Observations"]),
        "anomalies": to_num(r["Anomalies"]),
        "normalObservations": to_num(r["Normal_Observations"]),
        "anomalyRatePercent": to_num(r["Anomaly_Rate_Percent"]),
    }
    for r in rows
]
state_anomaly.sort(key=lambda x: x["anomalyRatePercent"], reverse=True)
write_json("state_anomaly.json", state_anomaly)

# ---------------------------------------------------------------
# 8. Anomaly vs normal feature statistics (table5)
# ---------------------------------------------------------------
rows = read_csv(SRC / "reports/tables/table5_anomaly_vs_normal_statistics.csv")
anomaly_vs_normal = [
    {
        "feature": r["Feature"],
        "normalMedian": to_num(r["Normal_Median"]),
        "anomalyMedian": to_num(r["Anomaly_Median"]),
        "normalMean": to_num(r["Normal_Mean"]),
        "anomalyMean": to_num(r["Anomaly_Mean"]),
        "normal75th": to_num(r["Normal_75th_Percentile"]),
        "anomaly75th": to_num(r["Anomaly_75th_Percentile"]),
        "normal95th": to_num(r["Normal_95th_Percentile"]),
        "anomaly95th": to_num(r["Anomaly_95th_Percentile"]),
    }
    for r in rows
]
write_json("anomaly_vs_normal_stats.json", anomaly_vs_normal)

# ---------------------------------------------------------------
# 9. Priority counts (derived from the full anomaly report)
# ---------------------------------------------------------------
rows = read_csv(SRC / "experiments/results/final_anomaly_report.csv")
counts = {"Critical": 0, "High": 0, "Moderate": 0, "Low": 0}
for r in rows:
    p = r["Priority"]
    if p in counts:
        counts[p] += 1
priority_counts = [{"priority": k, "count": v} for k, v in counts.items()]
write_json("priority_counts.json", priority_counts)

print("\nDone. All JSON files written to", OUT)
