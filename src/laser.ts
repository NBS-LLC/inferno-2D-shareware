export class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Laser,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "laser",
    });
  }

  fireLaser(x: number, y: number) {
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y);
    }
  }
}

class Laser extends Phaser.GameObjects.Line {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 0, 0, 5, 0, Phaser.Display.Color.GetColor(66, 135, 245));
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
    this.body.setVelocityX(800);
  }
}
