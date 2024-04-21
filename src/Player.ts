import { GameObjects, Physics } from "phaser";
import { Weapon } from "./Weapon";

export class Player {
  constructor(
    private gameObject: GameObjects.GameObject,
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
