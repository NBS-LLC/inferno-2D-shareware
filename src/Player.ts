import { GameObjects, Physics } from "phaser";
import { Weapon } from "./Weapon";

export class Player {
  constructor(
    private shape: GameObjects.Shape,
    private body: Physics.Arcade.Body,
  ) {}

  attachPrimaryWeapon(_weapon: Weapon) {}
  firePrimaryWeapon() {}

  moveUp() {
    this.body.setVelocityY(-300);
  }

  moveDown() {
    this.body.setVelocityY(300);
  }

  moveLeft() {
    this.body.setVelocityX(-300);
  }

  moveRight() {
    this.body.setVelocityX(300);
  }

  faceLeft() {
    this.shape.setAngle(180);
  }

  faceRight() {
    this.shape.setAngle(0);
  }
}
