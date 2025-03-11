import { BaseScene } from "../scenes/BaseScene";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Ship } from "./Ship";

export type PlayerInput = {
  [key: string]: Phaser.Input.Keyboard.Key;
};

export class Player extends Ship {
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    private playerInput: PlayerInput,
  ) {
    const vertices = [
      [0, 0],
      [40, 10],
      [0, 20],
    ];

    super(scene, x, y, vertices);

    this.setFillStyle(Phaser.Display.Color.GetColor(110, 110, 110));

    this.attachPrimaryWeapon(new LaserWeaponSystem(this));
  }

  update(_time: number, _delta: number): void {
    if (!this.active) {
      return;
    }

    this.stopMoving();

    if (this.playerInput["right"]?.isDown) {
      this.moveRight();
    }

    if (this.playerInput["left"]?.isDown) {
      this.moveLeft();
    }

    if (this.playerInput["up"]?.isDown) {
      this.moveUp();
    }

    if (this.playerInput["down"]?.isDown) {
      this.moveDown();
    }

    if (this.playerInput["face-left"]?.isDown) {
      this.faceLeft();
    }

    if (this.playerInput["face-right"]?.isDown) {
      this.faceRight();
    }

    if (this.playerInput["fire-primary"]?.isDown) {
      this.firePrimaryWeapon();
    }
  }
}
