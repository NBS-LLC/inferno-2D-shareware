import { GameObjects } from "phaser";

export abstract class Position {
  abstract getBody(): MatterJS.BodyType;
  abstract getShape(): GameObjects.Shape;

  faceLeft() {
    this.getShape().setAngle(180);
  }

  faceRight() {
    this.getShape().setAngle(0);
  }

  get isFacingLeft() {
    return Math.abs(this.getShape().angle) === 180;
  }

  get x() {
    return this.getBody().position.x;
  }

  get y() {
    return this.getBody().position.y;
  }
}
