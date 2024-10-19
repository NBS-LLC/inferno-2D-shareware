import { GameObjects, Scene } from "phaser";
import { applyMixins } from "./Mixins";
import { Movement } from "./Movement";
import { Position } from "./Position";
import { Weapon } from "./Weapon";
import { EmptyWeaponSystem } from "./weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "./weapons/LaserWeaponSystem";

export class Enemy {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(
    private shape: GameObjects.Shape,
    private body: MatterJS.BodyType,
  ) {}

  static createDefault(scene: Scene, x: number = 0, y: number = 0): Enemy {
    // 0,0 is left,top corner of the screen
    // Positive x = right
    // Positive y = down
    // Vertices need to be clockwise

    const playerVertices = [
      [0, 0],
      [40, 0],
      [40, 20],
      [0, 20],
    ];

    const shape = scene.add.polygon(
      x,
      y,
      playerVertices,
      Phaser.Display.Color.GetColor(200, 110, 110),
    );

    const body = scene.matter.add.gameObject(shape).body as MatterJS.BodyType;
    scene.matter.body.setInertia(body, Infinity);

    const ship = new Enemy(shape, body);
    ship.attachPrimaryWeapon(new LaserWeaponSystem(scene));

    return ship;
  }

  getBody() {
    return this.body;
  }

  getShape() {
    return this.shape;
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

applyMixins(Enemy, [Movement, Position]);
declare module "./Enemy" {
  interface Enemy extends Movement, Position {}
}
