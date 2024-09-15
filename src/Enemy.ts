import { GameObjects, Physics, Scene } from "phaser";
import { applyMixins } from "./Mixins";
import { Movement } from "./Movement";
import { Weapon } from "./Weapon";
import { EmptyWeaponSystem } from "./weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "./weapons/LaserWeaponSystem";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Enemy {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(
    private shape: GameObjects.Shape,
    private body: Physics.Arcade.Body,
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

    const body = scene.physics.add.existing(shape).body as Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    const ship = new Enemy(shape, body);
    ship.attachPrimaryWeapon(new LaserWeaponSystem(scene));

    return ship;
  }

  getBody() {
    return this.body;
  }

  attachPrimaryWeapon(weapon: Weapon) {
    this.primaryWeapon = weapon;
  }

  firePrimaryWeapon() {
    this.primaryWeapon.fire(
      this.isFacingLeft ? this.x - 5 : this.x + 45,
      this.y + 10,
      this.isFacingLeft ? -600 : 600,
    );
  }

  faceLeft() {
    this.shape.setAngle(180);
  }

  faceRight() {
    this.shape.setAngle(0);
  }

  get x() {
    return this.body.x;
  }

  get y() {
    return this.body.y;
  }

  get isFacingLeft() {
    return Math.abs(this.shape.angle) === 180;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Enemy extends Movement {}
applyMixins(Enemy, [Movement]);
