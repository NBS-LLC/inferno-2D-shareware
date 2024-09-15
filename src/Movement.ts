import { GameObjects, Physics } from "phaser";

export abstract class Movement {
  abstract getBody(): Physics.Arcade.Body;
  abstract getShape(): GameObjects.Shape;

  stopMoving() {
    this.getBody().setVelocity(0, 0);
  }

  moveUp() {
    this.getBody().setVelocityY(-300);
  }

  moveDown() {
    this.getBody().setVelocityY(300);
  }

  moveLeft() {
    this.getBody().setVelocityX(-300);
  }

  moveRight() {
    this.getBody().setVelocityX(300);
  }

  faceLeft() {
    this.getShape().setAngle(180);
  }

  faceRight() {
    this.getShape().setAngle(0);
  }

  get isFacingLeft() {
    return Math.abs(this.getShape().angle) === 180;
  }
}
