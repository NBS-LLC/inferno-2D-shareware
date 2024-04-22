import { expect } from "chai";
import { GameObjects, Physics } from "phaser";
import { instance, mock } from "ts-mockito";
import { Player } from "./Player";

describe(Player.name, () => {
  describe(Player.prototype.faceLeft.name, () => {
    it("should face the player left", () => {
      const mockShape = mock(GameObjects.Shape);
      const mockBody = mock(Physics.Arcade.Body);
      const player = new Player(instance(mockShape), instance(mockBody));
      expect(player).to.be.instanceOf(Player);
    });
  });
});
