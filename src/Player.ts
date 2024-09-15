import { GameObjects, Physics, Scene } from "phaser";
import { applyMixins } from "./Mixins";
import { Movement } from "./Movement";
import { Weapon } from "./Weapon";
import { EmptyWeaponSystem } from "./weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "./weapons/LaserWeaponSystem";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Player {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(
    private shape: GameObjects.Shape,
    private body: Physics.Arcade.Body,
  ) {}

  static createDefault(scene: Scene): Player {
    // 0,0 is left,top corner of the screen
    // Positive x = right
    // Positive y = down
    // Vertices need to be clockwise

    const playerVertices = [
      [0, 0],
      [40, 10],
      [0, 20],
    ];

    const shape = scene.add.polygon(
      100,
      400,
      playerVertices,
      Phaser.Display.Color.GetColor(110, 110, 110),
    );

    const body = scene.physics.add.existing(shape).body as Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    const player = new Player(shape, body);
    player.attachPrimaryWeapon(new LaserWeaponSystem(scene));

    return player;
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
      this.isFacingLeft ? this.x - 5 : this.x + 45,
      this.y + 10,
      this.isFacingLeft ? -600 : 600,
    );
  }

  get x() {
    return this.body.x;
  }

  get y() {
    return this.body.y;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Player extends Movement {}
applyMixins(Player, [Movement]);
