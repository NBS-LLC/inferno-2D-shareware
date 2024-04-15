export class LaserGroup extends Phaser.Physics.Arcade.Group {
  private fireDelay = 1000 * 0.25;
  private nextFireAt: number;

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Laser,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "laser",
    });

    this.delayFire();
  }

  fireLaser(x: number, y: number) {
    const laser = this.getFirstDead(false);
    if (laser && this.canFire()) {
      laser.fire(x, y);
      this.delayFire();
    }
  }

  private canFire() {
    return this.nextFireAt <= this.scene.time.now;
  }

  private delayFire() {
    this.nextFireAt = this.scene.time.now + this.fireDelay;
  }
}

class Laser extends Phaser.GameObjects.Line {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      0,
      0,
      0,
      0,
      10,
      0,
      Phaser.Display.Color.GetColor(66, 135, 245),
    );
    scene.physics.add.existing(this);
  }

  preUpdate() {
    if (this.x > 800) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  fire(x: number, y: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body.setVelocityX(600);
  }
}
