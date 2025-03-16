import { describe, expect, it } from "@jest/globals";
import { Scorer } from "./Scorer";

describe(Scorer.name, () => {
  describe(Scorer.calculateScore.name, () => {
    // prettier-ignore
    const testData = [
      { attackerLevel: 1,     defenderLevel: 1,   worth: 100,   expectedScore: 100 },
      { attackerLevel: 1,     defenderLevel: 2,   worth: 150,   expectedScore: 300 },
      { attackerLevel: 2,     defenderLevel: 1,   worth: 100,   expectedScore: 50 },
      { attackerLevel: 1,     defenderLevel: 1,   worth: 0,     expectedScore: 0 },
      // Rounds up to the nearest integer:
      { attackerLevel: 3,     defenderLevel: 1,   worth: 100,   expectedScore: 34 },
      { attackerLevel: 1000,  defenderLevel: 1,   worth: 100,   expectedScore: 1 },
      // Handles out of bounds values:
      { attackerLevel: 0,     defenderLevel: 1,   worth: 100,   expectedScore: 100 },
      { attackerLevel: 1,     defenderLevel: 0,   worth: 100,   expectedScore: 100 },
      { attackerLevel: 0,     defenderLevel: 0,   worth: 100,   expectedScore: 100 },
      { attackerLevel: -1,    defenderLevel: 0,   worth: 100,   expectedScore: 100 },
      { attackerLevel: 0,     defenderLevel: -1,  worth: 100,   expectedScore: 100 },
      { attackerLevel: -2,    defenderLevel: -2,  worth: 100,   expectedScore: 100 },
      // Handles non integer values:
      { attackerLevel: 1.5,   defenderLevel: 1,   worth: 100,   expectedScore: 100 },
      { attackerLevel: 1,     defenderLevel: 1.5, worth: 100,   expectedScore: 100 },
      { attackerLevel: 1,     defenderLevel: 1,   worth: 100.1, expectedScore: 100 },
    ];

    it.each(testData)("can calculate a score based on level (%p)", (data) => {
      expect(
        Scorer.calculateScore({
          attackerLevel: data.attackerLevel,
          defenderLevel: data.defenderLevel,
          worth: data.worth,
        }),
      ).toBe(data.expectedScore);
    });
  });
});
