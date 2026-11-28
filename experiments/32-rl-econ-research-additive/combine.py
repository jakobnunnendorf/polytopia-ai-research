"""Experiment 32: write 29's economy path and 31's research path as level policies over econ-research25.

Usage (from the repo root): python3 experiments/32-rl-econ-research-additive/combine.py
Reads the m = 500 paths without income from both experiments' level-summary-b0.json and writes, next to this file:
  policy-combined.tsv    economy path x research path (the candidate)
  policy-econ-only.tsv   economy path, research at x1 (the same games as 29's policy-b0-m500.tsv: a check of the encoding)
  policy-research-only.tsv research path, economy at x1 (the same games as 31's policy-b0-m500.tsv)
A level policy keys on (turn, level before the turn); a path is one row per turn.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ECON = ["x0.25", "x0.5", "x0.75", "x1", "x1.5"]
RES = ["x0.5", "x0.75", "x1", "x1.33", "x2"]
START = (3, 2)  # (x1, x1), the set's default 3 * 5 + 2


def path(exp):
    d = json.load(open(os.path.join(HERE, "..", exp, "level-summary-b0.json")))
    run = next(r for r in d["runs"] if r["minCount"] == 500)
    return [name for _, name in sorted(run["path"])]


def write(name, econ, res, note):
    rows, prev = [], START
    for t in range(30):
        cur = (ECON.index(econ[t]), RES.index(res[t]))
        assert abs(cur[0] - prev[0]) <= 1 and abs(cur[1] - prev[1]) <= 1, f"turn {t}: more than one step"
        rows.append(f"{t}\t{prev[0] * 5 + prev[1]}\t0\t0\t0\t0\t{cur[0] * 5 + cur[1]}")
        prev = cur
    head = {"model": "greedy-full-probe-perf-r15", "boost": 1, "actions": "econ-research25", "levelKey": {"incomeBucket": 0},
            "note": note, "economy": econ, "research": res}
    open(os.path.join(HERE, name), "w").write("# " + json.dumps(head) + "\n" + "\n".join(rows) + "\n")
    print(name)


econ, res = path("29-rl-econ-level"), path("31-rl-research-level")
write("policy-combined.tsv", econ, res, "29's economy path and 31's research path (m500, no income), played together")
write("policy-econ-only.tsv", econ, ["x1"] * 30, "29's economy path, research at x1: the same games as 29's policy-b0-m500.tsv")
write("policy-research-only.tsv", ["x1"] * 30, res, "31's research path, economy at x1: the same games as 31's policy-b0-m500.tsv")
