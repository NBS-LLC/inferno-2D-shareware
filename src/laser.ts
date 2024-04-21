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

  fireLaser(x: number, y: number, isFacingLeft: boolean) {
    const laser = this.getFirstDead(false) as Laser;
    if (laser && this.canFire()) {
      laser.fire(x, y, isFacingLeft);
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
      Phaser.Display.Color.GetColor(255, 255, 255),
    );

    this.setLineWidth(2, 1);
    this.postFX.addGlow(Phaser.Display.Color.GetColor(201, 232, 255), 4);

    scene.physics.add.existing(this);
  }

  preUpdate() {
    if (this.x < 0 || this.x > 800) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  fire(x: number, y: number, isFacingLeft: boolean) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);

    if (isFacingLeft) {
      this.body.setVelocityX(-600);
    } else {
      this.body.setVelocityX(600);
    }
  }
}
