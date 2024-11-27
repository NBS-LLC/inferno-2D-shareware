import { GameObjects, Scene } from "phaser";

export abstract class Ship extends GameObjects.Polygon {
  constructor(scene: Scene, x: number, y: number, vertices: number[][]) {
    // 0,0 is left,top corner of the screen
    // Positive x = right
    // Positive y = down
    // Vertices need to be clockwise

    super(scene, x, y, vertices);
    this.scene.add.existing(this);
    this.scene.matter.add.gameObject(this);
  }

  stopMoving() {
    this.setVelocity(0, 0);
  }

  moveUp() {
    this.setVelocityY(-5);
  }

  moveDown() {
    this.setVelocityY(5);
  }

  moveLeft() {
    this.setVelocityX(-5);
  }

  moveRight() {
    this.setVelocityX(5);
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
}

declare module "./Ship" {
  interface Ship
    extends GameObjects.Polygon,
      Phaser.Physics.Matter.Components.Velocity {}
}
