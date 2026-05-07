import type { CheckResult, CheckStatus } from "./checks";

export type DiffRow = {
  id: string;
  name: string;
  wcagCriterion: string;
  before: { status: CheckStatus; count?: number };
  after: { status: CheckStatus; count?: number };
  delta: "improved" | "regressed" | "unchanged";
  countDelta?: number;
};

const STATUS_RANK: Record<CheckStatus, number> = {
  pass: 2,
  warning: 1,
  fail: 0,
};

export type DiffSummary = {
  rows: DiffRow[];
  improved: number;
  regressed: number;
  unchanged: number;
  scoreDelta: number;
};

export function diffResults(
  before: { checks: CheckResult[]; score: number },
  after: { checks: CheckResult[]; score: number }
): DiffSummary {
  const beforeMap = new Map(before.checks.map((c) => [c.id, c]));
  const afterMap = new Map(after.checks.map((c) => [c.id, c]));
  const ids = new Set<string>();
  for (const id of beforeMap.keys()) ids.add(id);
  for (const id of afterMap.keys()) ids.add(id);

  let improved = 0;
  let regressed = 0;
  let unchanged = 0;

  const rows: DiffRow[] = [];
  for (const id of ids) {
    const b = beforeMap.get(id);
    const a = afterMap.get(id);
    if (!b || !a) continue;
    const delta: DiffRow["delta"] =
      STATUS_RANK[a.status] > STATUS_RANK[b.status]
        ? "improved"
        : STATUS_RANK[a.status] < STATUS_RANK[b.status]
          ? "regressed"
          : (a.count ?? 0) < (b.count ?? 0)
            ? "improved"
            : (a.count ?? 0) > (b.count ?? 0)
              ? "regressed"
              : "unchanged";
    if (delta === "improved") improved++;
    else if (delta === "regressed") regressed++;
    else unchanged++;
    rows.push({
      id,
      name: a.name,
      wcagCriterion: a.wcagCriterion,
      before: { status: b.status, count: b.count },
      after: { status: a.status, count: a.count },
      delta,
      countDelta:
        b.count != null && a.count != null ? a.count - b.count : undefined,
    });
  }

  return {
    rows: rows.sort((x, y) => {
      const order = { regressed: 0, improved: 1, unchanged: 2 } as const;
      return order[x.delta] - order[y.delta];
    }),
    improved,
    regressed,
    unchanged,
    scoreDelta: after.score - before.score,
  };
}
