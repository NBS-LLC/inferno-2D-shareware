import { Scene } from "phaser";
import { EmptyWeaponSystem } from "../weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Weapon } from "../weapons/Weapon";
import { Ship } from "./Ship";

export class Player extends Ship {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

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

  attachPrimaryWeapon(weapon: Weapon) {
    this.primaryWeapon = weapon;
  }

  firePrimaryWeapon() {
    this.primaryWeapon.fire(
      this.isFacingLeft ? this.x - 20 : this.x + 20,
      this.y,
      this.isFacingLeft ? -10 : 10,
    );
  }
}
