import { beforeEach, describe, expect, it } from "@jest/globals";
import { GameObjects, Physics } from "phaser";
import { capture, instance, mock, reset } from "ts-mockito";
import { Player } from "./Player";

describe(Player.name, () => {
  const mockShape = mock(GameObjects.Shape);
  const mockBody = mock(Physics.Arcade.Body);
  let player: Player;

  beforeEach(() => {
    reset(mockShape);
    reset(mockBody);

    player = new Player(instance(mockShape), instance(mockBody));
  });

  describe(Player.prototype.faceLeft.name, () => {
    it("should face the player left", () => {
      player.faceLeft();

      const [degrees] = capture(mockShape.setAngle).last();
      expect(degrees).toEqual(180);
    });
  });

  describe(Player.prototype.faceRight.name, () => {
    it("should face the player right", () => {
      player.faceRight();

      const [degrees] = capture(mockShape.setAngle).last();
      expect(degrees).toEqual(0);
    });
  });

  describe(Player.prototype.moveUp.name, () => {
    it("should move the player up", () => {
      player.moveUp();

      const [value] = capture(mockBody.setVelocityY).last();
      expect(value).toEqual(-300);
    });
  });

  describe(Player.prototype.moveDown.name, () => {
    it("should move the player down", () => {
      player.moveDown();

      const [value] = capture(mockBody.setVelocityY).last();
      expect(value).toEqual(300);
    });
  });

  describe(Player.prototype.moveLeft.name, () => {
    it("should move the player left", () => {
      player.moveLeft();

      const [value] = capture(mockBody.setVelocityX).last();
      expect(value).toEqual(-300);
    });
  });

  describe(Player.prototype.moveRight.name, () => {
    it("should move the player right", () => {
      player.moveRight();

      const [value] = capture(mockBody.setVelocityX).last();
      expect(value).toEqual(300);
    });
  });
});
