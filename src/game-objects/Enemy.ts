import { Scene } from "phaser";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Ship } from "./Ship";

export class Enemy extends Ship {
  constructor(scene: Scene, x: number, y: number) {
    const vertices = [
      [0, 0],
      [40, 0],
      [40, 20],
      [0, 20],
    ];

    super(scene, x, y, vertices);

    this.setFillStyle(Phaser.Display.Color.GetColor(200, 110, 110));

    this.attachPrimaryWeapon(new LaserWeaponSystem(this.scene));
  }
}
