import { GameObjects, Physics } from "phaser";
import { Weapon } from "./Weapon";

export class Player {
  constructor(
    private shape: GameObjects.Shape,
    private body: Physics.Arcade.Body,
  ) {}

  attachPrimaryWeapon(_weapon: Weapon) {}

  moveRight() {}
  moveLeft() {}
  moveUp() {}
  moveDown() {}

  faceRight() {}
  faceLeft() {}

  firePrimaryWeapon() {}
}
