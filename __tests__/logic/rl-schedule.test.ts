/**
 * Models of kind "rl-schedule" (logic/agents/registry.ts rlScheduleAgent): the full bot with one move type's
 * factor on a per-turn schedule. The app plays them in TypeScript, the Elo tournament through the Rust engine's
 * playGames (kind "schedule", engine/api); both must give the same game.
 */
import { applyAction, createGame, scoreOf } from "@/logic/engine";
import { fullBotStep, fullWeights } from "@/logic/engine/botFull";
import { call } from "@/logic/engine/rust";
import { createAgent } from "@/logic/agents/registry";
import type { ModelSpec } from "@/logic/agents/types";
import type { Action } from "@/logic/engine/types";
import econ from "../../models/rl-econ-level/model.json";
import r15 from "../../models/greedy-full-probe-perf-r15/model.json";

const spec = econ as ModelSpec;
const r15spec = r15 as ModelSpec;

describe("rl-schedule models", () => {
  it("rl-econ-level is Probe R's weights with experiment 29's economy schedule", () => {
    expect(spec.kind).toBe("rl-schedule");
    expect(spec.full).toEqual(r15spec.full);
    expect(spec.schedule?.type).toBe("build");
    expect(spec.schedule?.factors).toHaveLength(30);
    expect(spec.schedule?.factors.every((f) => [0.25, 0.5, 0.75, 1, 1.5].includes(f))).toBe(true);
  });

  it("plays the full bot with the factor of the turn, the same game as the engine's schedule policy", async () => {
    const opts = { mapSize: 11, players: 2, mode: "perfection" as const, seed: 5, humans: [] as number[] };
    const agent = createAgent(spec);
    const base = fullWeights(spec.full);
    const opp = fullWeights(r15spec.full);
    const factors = spec.schedule!.factors;
    let s = createGame(opts);
    let moves = 0;
    let checked = 0;
    while (!s.over && moves < 20000) {
      let a: Action;
      if (s.current % 2 === 0) {
        a = await agent.act(s);
        const f = factors[Math.min(s.turn, factors.length - 1)];
        expect(a).toEqual(fullBotStep(s, { ...base, type: { ...base.type, build: base.type.build * f } }));
        checked++;
      } else {
        a = fullBotStep(s, opp);
      }
      s = applyAction(s, a);
      moves++;
    }
    expect(checked).toBeGreaterThan(50);
    const [rust] = call<{ moves: number; scores: number[] }[]>("playGames", [
      { opts, policies: [{ kind: "schedule", weights: base, schedule: spec.schedule }, { kind: "full", weights: opp }], maxMoves: 20000 },
    ]);
    expect(rust.moves).toBe(moves);
    expect(rust.scores).toEqual([scoreOf(s, 0), scoreOf(s, 1)]);
  }, 60000);

  it("plays differently from its base bot", async () => {
    const opts = { mapSize: 11, players: 2, mode: "perfection" as const, seed: 5, humans: [] as number[] };
    const games = call<{ scores: number[] }[]>("playGames", [
      { opts, policies: [{ kind: "schedule", weights: fullWeights(spec.full), schedule: spec.schedule }, { kind: "full", weights: fullWeights(r15spec.full) }], maxMoves: 20000 },
      { opts, policies: [{ kind: "full", weights: fullWeights(r15spec.full) }, { kind: "full", weights: fullWeights(r15spec.full) }], maxMoves: 20000 },
    ]);
    expect(games[0].scores).not.toEqual(games[1].scores);
  });
});
