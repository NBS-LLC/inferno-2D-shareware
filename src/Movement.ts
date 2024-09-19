import { Physics } from "phaser";

export abstract class Movement {
  abstract getBody(): Physics.Arcade.Body;

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
}
