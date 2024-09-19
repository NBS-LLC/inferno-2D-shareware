import { beforeEach, describe, expect, it } from "@jest/globals";
import { GameObjects, Physics } from "phaser";
import { capture, instance, mock, reset } from "ts-mockito";
import { Movement } from "./Movement";

class TestMovement extends Movement {
  constructor(
    private body: Physics.Arcade.Body,
    private shape: GameObjects.Shape,
  ) {
    super();
  }

  getBody(): Physics.Arcade.Body {
    return this.body;
  }

  getShape(): GameObjects.Shape {
    return this.shape;
  }
}

describe(Movement.name, () => {
  const mockBody = mock(Physics.Arcade.Body);
  const mockShape = mock(GameObjects.Shape);
  let movement: Movement;

  beforeEach(() => {
    reset(mockBody);
    reset(mockShape);

    movement = new TestMovement(instance(mockBody), instance(mockShape));
  });

  describe(Movement.prototype.moveUp.name, () => {
    it("should move the body up", () => {
      movement.moveUp();

      const [value] = capture(mockBody.setVelocityY).last();
      expect(value).toEqual(-300);
    });
  });

  describe(Movement.prototype.moveDown.name, () => {
    it("should move the body down", () => {
      movement.moveDown();

      const [value] = capture(mockBody.setVelocityY).last();
      expect(value).toEqual(300);
    });
  });

  describe(Movement.prototype.moveLeft.name, () => {
    it("should move the body left", () => {
      movement.moveLeft();

      const [value] = capture(mockBody.setVelocityX).last();
      expect(value).toEqual(-300);
    });
  });

  describe(Movement.prototype.moveRight.name, () => {
    it("should move the body right", () => {
      movement.moveRight();

      const [value] = capture(mockBody.setVelocityX).last();
      expect(value).toEqual(300);
    });
  });

  describe(Movement.prototype.stopMoving.name, () => {
    it("should stop the body's movement", () => {
      movement.stopMoving();

      const [x, y] = capture(mockBody.setVelocity).last();
      expect(x).toEqual(0);
      expect(y).toEqual(0);
    });
  });
});
