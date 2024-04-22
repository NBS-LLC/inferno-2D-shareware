import { GameObjects, Physics } from "phaser";
import { instance, mock, verify } from "ts-mockito";
import { Player } from "./Player";

describe(Player.name, () => {
  describe(Player.prototype.faceLeft.name, () => {
    it("should face the player left", () => {
      const mockShape = mock(GameObjects.Shape);
      const mockBody = mock(Physics.Arcade.Body);
      const player = new Player(instance(mockShape), instance(mockBody));

      player.faceLeft();
      verify(mockShape.setAngle(180)).once();
    });
  });

  describe(Player.prototype.faceRight.name, () => {
    it("should face the player right", () => {
      const mockShape = mock(GameObjects.Shape);
      const mockBody = mock(Physics.Arcade.Body);
      const player = new Player(instance(mockShape), instance(mockBody));

      player.faceRight();
      verify(mockShape.setAngle(0)).once();
    });
  });
});
