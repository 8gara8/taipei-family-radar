import assert from "node:assert/strict";
import { test } from "node:test";
import { nextScanStart } from "./scan-schedule";
import { formatNextUpdate } from "./utils";

const cases = [
  ["Monday before start", "2026-10-19T01:59:59+08:00", "2026-10-19T02:00:00+08:00"],
  ["Monday at start", "2026-10-19T02:00:00+08:00", "2026-10-20T02:00:00+08:00"],
  ["Monday after start", "2026-10-19T02:00:01+08:00", "2026-10-20T02:00:00+08:00"],
  ["Tuesday before start", "2026-10-20T01:59:59+08:00", "2026-10-20T02:00:00+08:00"],
  ["Tuesday at start", "2026-10-20T02:00:00+08:00", "2026-10-26T02:00:00+08:00"],
  ["Tuesday after start", "2026-10-20T02:00:01+08:00", "2026-10-26T02:00:00+08:00"],
  ["Taipei Monday while UTC Sunday", "2026-10-18T17:59:00Z", "2026-10-19T02:00:00+08:00"],
  ["Taipei Tuesday after start while UTC Monday", "2026-10-19T18:01:00Z", "2026-10-26T02:00:00+08:00"],
  ["year rollover", "2026-12-29T02:00:00+08:00", "2027-01-04T02:00:00+08:00"],
] as const;

for (const [name, now, expected] of cases) {
  test(name, () => {
    assert.equal(nextScanStart(new Date(now)).toISOString(), new Date(expected).toISOString());
  });
}

test("return-visit date uses Taipei even when its UTC date differs", () => {
  assert.equal(formatNextUpdate(new Date("2026-10-18T17:59:00Z")), "2026年10月19日");
  assert.equal(formatNextUpdate(new Date("2026-10-19T18:00:00Z")), "2026年10月26日");
});
