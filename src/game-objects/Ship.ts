import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { Scorer } from "../logic/Scorer";
import { BaseScene } from "../scenes/BaseScene";
import { EmptyWeaponSystem } from "../weapons/EmptyWeaponSystem";
import { Weapon } from "../weapons/Weapon";

export enum ShipType {
  Player,
  Enemy,
}

export abstract class Ship extends GameObjects.Polygon {
  private level = 1;
  private speed = 5;
  private worth = 0;
  private primaryWeapon: Weapon = new EmptyWeaponSystem();

  constructor(scene: BaseScene, x: number, y: number, vertices: number[][]) {
    // 0,0 is left,top corner of the screen
    // Positive x = right
    // Positive y = down
    // Vertices need to be clockwise

    super(scene, x, y, vertices);
    this.setName(this.constructor.name);
    this.scene.add.existing(this);
    this.scene.matter.add.gameObject(this);
    this.scene.matter.body.setInertia(this.getBody(), Infinity);
  }

  abstract update(time: number, delta: number): void;
  abstract getType(): ShipType;

  kill(killer: GameObjects.GameObject) {
    console.log(this.name, "killed by", killer.name);
    if (killer instanceof Ship && killer.getType() === ShipType.Player) {
      const score = Scorer.calculateScore({
        attackerLevel: killer.getLevel(),
        defenderLevel: this.getLevel(),
        worth: this.getWorth(),
      });

      this.getScene().getScorer().addToScore(score);
    }
    this.destroy();
  }

  getScene() {
    return this.scene as BaseScene;
  }

  getBody() {
    return this.body as BodyType;
  }

  getLevel() {
    return this.level;
  }

  setLevel(value: number) {
    this.level = Math.max(1, value);
  }

  getSpeed() {
    return this.speed;
  }

  getWorth() {
    return this.worth;
  }

  setWorth(value: number) {
    this.worth = Math.max(0, value);
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  stopMoving() {
    this.setVelocity(0, 0);
  }

  moveUp() {
    this.setVelocityY(this.getSpeed() * -1);
  }

  moveDown() {
    this.setVelocityY(this.getSpeed());
  }

  moveLeft() {
    this.setVelocityX(this.getSpeed() * -1);
  }

  moveRight() {
    this.setVelocityX(this.getSpeed());
  }

  faceLeft() {
    this.setAngle(180);
  }

  faceRight() {
    this.setAngle(0);
  }

  get isFacingLeft() {
    return Math.abs(this.angle) === 180;
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

declare module "./Ship" {
  interface Ship
    extends GameObjects.Polygon,
      Phaser.Physics.Matter.Components.Velocity {}
}
