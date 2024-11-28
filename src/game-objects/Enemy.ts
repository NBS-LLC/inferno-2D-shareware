import { Scene } from "phaser";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Ship } from "./Ship";

export class Enemy extends Ship {
  private updateState: "idle" | "engage" = "idle";
  private updateTime = 0;
  private updateDelay = 2000;

  readonly originX: number;
  readonly originY: number;

  constructor(scene: Scene, x: number, y: number) {
    const vertices = [
      [0, 0],
      [40, 0],
      [40, 20],
      [0, 20],
    ];

    super(scene, x, y, vertices);
    this.originX = x;
    this.originY = y;

    this.setFillStyle(Phaser.Display.Color.GetColor(200, 110, 110));

    this.attachPrimaryWeapon(new LaserWeaponSystem(this.scene));
  }

  update(time: number, _delta: number): void {
    if (!this.active) {
      return;
    }

    const elapsed = time - this.updateTime;
    if (time > this.updateDelay && elapsed < this.updateDelay) {
      return;
    }
    this.updateTime = time;

    if (this.updateState == "idle") {
      this.updateDelay = Phaser.Math.RND.between(50, 150);
      this.setSpeed(0.25);

      if (this.x - this.originX <= this.getSpeed() * -3) {
        this.moveRight();
      } else if (this.x - this.originX >= this.getSpeed() * 3) {
        this.moveLeft();
      } else if (this.y - this.originY <= this.getSpeed() * -3) {
        this.moveDown();
      } else if (this.y - this.originY >= this.getSpeed() * 3) {
        this.moveUp();
      } else {
        const movement = Phaser.Math.RND.pick([
          this.moveUp,
          this.moveDown,
          this.moveLeft,
          this.moveRight,
        ]);
        movement.bind(this)();
      }

      return;
    }
  }
}
