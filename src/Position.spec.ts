import { beforeEach, describe, expect, it } from "@jest/globals";
import { GameObjects, Physics } from "phaser";
import { capture, instance, mock, reset } from "ts-mockito";
import { Position } from "./Position";

class TestPosition extends Position {
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

describe(Position.name, () => {
  const mockBody = mock(Physics.Arcade.Body);
  const mockShape = mock(GameObjects.Shape);
  let position: Position;

  beforeEach(() => {
    reset(mockBody);
    reset(mockShape);

    position = new TestPosition(instance(mockBody), instance(mockShape));
  });

  describe(Position.prototype.faceLeft.name, () => {
    it("should face the shape left", () => {
      position.faceLeft();

      const [degrees] = capture(mockShape.setAngle).last();
      expect(degrees).toEqual(180);
    });
  });

  describe(Position.prototype.faceRight.name, () => {
    it("should face the shape right", () => {
      position.faceRight();

      const [degrees] = capture(mockShape.setAngle).last();
      expect(degrees).toEqual(0);
    });
  });
});
