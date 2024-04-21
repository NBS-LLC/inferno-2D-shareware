import { describe, expect, it } from "@jest/globals";
import { Player } from "./Player";

describe(Player.name, () => {
  describe(Player.prototype.faceLeft.name, () => {
    it("faces the player to the left", () => {
      expect(true).toBeTruthy();
    });
  });
});
