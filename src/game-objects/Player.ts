import { Scene } from "phaser";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Ship } from "./Ship";

export class Player extends Ship {
  constructor(scene: Scene, x: number, y: number) {
    const vertices = [
      [0, 0],
      [40, 10],
      [0, 20],
    ];

    super(scene, x, y, vertices);

    this.setFillStyle(Phaser.Display.Color.GetColor(110, 110, 110));

    this.attachPrimaryWeapon(new LaserWeaponSystem(this.scene));
  }
}
