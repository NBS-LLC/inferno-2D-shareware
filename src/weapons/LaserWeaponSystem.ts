import { Weapon } from "./Weapon";

export class LaserWeaponSystem
  extends Phaser.GameObjects.Group
  implements Weapon
{
  private fireDelay = 1000 * 0.25;
  private nextFireAt = 0;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.createMultiple({
      classType: LaserAmmo,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "laser",
    });
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
  body: MatterJS.BodyType;

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

    this.setName(LaserAmmo.name);

    this.setLineWidth(2, 1);

    // TODO: determine more performant way to add laser glow fx
    // try {
    //   this.postFX.addGlow(Phaser.Display.Color.GetColor(201, 232, 255), 4);
    // } catch {
    //   /* Does Nothing */
    // }

    scene.matter.add.gameObject(this, {
      frictionAir: 0,
    });

    // TODO: use arrow function notation instead of binding "this".
    this.body.onCollideCallback = this.onCollision.bind(this);

    this.scene.matter.body.setInertia(this.body, Infinity);
    this.scene.matter.world.remove(this.body, true);
  }

  preUpdate() {
    if (this.x < 0 || this.x > 800) {
      this.hide();
    }
  }

  fire(x: number, y: number, velocity: number) {
    this.unhide();
    this.scene.matter.body.setPosition(this.body, { x, y });
    this.scene.matter.setVelocityY(this.body, 0);
    this.scene.matter.setVelocityX(this.body, velocity);
  }

  onCollision(pair: Phaser.Types.Physics.Matter.MatterCollisionPair) {
    const { bodyA, bodyB } = pair;

    if (bodyA.gameObject instanceof LaserAmmo) {
      bodyA.gameObject.hide();
    } else {
      bodyA.gameObject.destroy();
    }

    if (bodyB.gameObject instanceof LaserAmmo) {
      bodyB.gameObject.hide();
    } else {
      bodyB.gameObject.destroy();
    }
  }

  private hide() {
    this.setActive(false);
    this.setVisible(false);
    this.scene.matter.world.remove(this.body, true);
  }

  private unhide() {
    this.scene.matter.world.add(this.body);
    this.setVisible(true);
    this.setActive(true);
  }
}
