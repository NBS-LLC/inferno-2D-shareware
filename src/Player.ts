import { GameObjects, Physics, Scene } from "phaser";
import { Weapon } from "./Weapon";
import { EmptyWeaponSystem } from "./weapons/EmptyWeaponSystem";
import { LaserWeaponSystem } from "./weapons/LaserWeaponSystem";

export class Player {
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(
    private shape: GameObjects.Shape,
    private body: Physics.Arcade.Body,
  ) {}

  static createDefault(scene: Scene): Player {
    // 0,0 is top,left
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
    player.attachPrimaryWeapon(new LaserWeaponSystem());

    return player;
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

  stopMoving() {
    this.body.setVelocity(0, 0);
  }

  moveUp() {
    this.body.setVelocityY(-300);
  }

  moveDown() {
    this.body.setVelocityY(300);
  }

  moveLeft() {
    this.body.setVelocityX(-300);
  }

  moveRight() {
    this.body.setVelocityX(300);
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
