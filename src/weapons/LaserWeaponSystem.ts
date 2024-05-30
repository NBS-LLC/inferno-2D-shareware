import { Weapon } from "../Weapon";

export class LaserWeaponSystem
  extends Phaser.Physics.Arcade.Group
  implements Weapon
{
  private fireDelay = 1000 * 0.25;
  private nextFireAt: number;

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: LaserAmmo,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "laser",
    });

    this.delayFire();
  }

  fire(x: number, y: number, velocity: number) {
    const laser = this.getFirstDead(false) as LaserAmmo;
    if (laser && this.canFire()) {
      laser.fire(x, y, velocity);
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

class LaserAmmo extends Phaser.GameObjects.Line {
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

  fire(x: number, y: number, velocity: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);

    this.body.setVelocityX(velocity);
  }
}
