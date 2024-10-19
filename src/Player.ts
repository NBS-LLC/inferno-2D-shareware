import { GameObjects, Scene } from "phaser";
import { applyMixins } from "./Mixins";
import { Movement } from "./Movement";
import { Position } from "./Position";
import { Weapon } from "./Weapon";
import { EmptyWeaponSystem } from "./weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "./weapons/LaserWeaponSystem";

export class Player {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(
    private shape: GameObjects.Shape,
    private body: MatterJS.BodyType,
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

    const body = scene.matter.add.gameObject(shape).body as MatterJS.BodyType;
    scene.matter.body.setInertia(body, Infinity);

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
      this.isFacingLeft ? this.x - 20 : this.x + 20,
      this.y,
      this.isFacingLeft ? -10 : 10,
    );
  }
}

applyMixins(Player, [Movement, Position]);
declare module "./Player" {
  interface Player extends Movement, Position {}
}
