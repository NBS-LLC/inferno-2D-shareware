import { Scene } from "phaser";
import { LaserWeaponSystem } from "../weapons/LaserWeaponSystem";
import { Ship } from "./Ship";

export class Enemy extends Ship {
  private updateState: "disabled" | "idle" | "engage" = "disabled";
  private updateTime = 0;
  private updateDelay = 0;

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

  idle() {
    this.updateState = "idle";
  }

  update(time: number, _delta: number): void {
    if (!this.active) {
      return;
    }

    const elapsed = time - this.updateTime;
    if (elapsed < this.updateDelay) {
      return;
    }
    this.updateTime = time;

    if (this.updateState == "idle") {
      const tolerance = 3;

      // Introduce a random delay of ~5 to ~10 frames
      this.updateDelay = Phaser.Math.RND.between(80, 160);
      this.setSpeed(0.25);

      // Pick a random movement direction
      let movement = Phaser.Math.RND.pick([
        this.moveUp,
        this.moveDown,
        this.moveLeft,
        this.moveRight,
      ]);

      // Unless we've already moved too far (outside the tolerance)
      if (this.x - this.originX <= tolerance * -1) {
        this.moveRight();
        movement = null;
      } else if (this.x - this.originX >= tolerance) {
        this.moveLeft();
        movement = null;
      }

      // In which case we try to get back to the origin
      if (this.y - this.originY <= tolerance * -1) {
        this.moveDown();
        movement = null;
      } else if (this.y - this.originY >= tolerance) {
        this.moveUp();
        movement = null;
      }

      // If we've moved too far, the random movement pick will be null
      if (movement) {
        movement.bind(this)();
      }
    }
  }
}
