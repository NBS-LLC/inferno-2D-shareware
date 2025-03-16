import { GameObjects } from "phaser";
import { Ship } from "../game-objects/Ship";
import { Ammo } from "./Ammo";
import { Weapon } from "./Weapon";

export class LaserWeaponSystem
  extends Phaser.GameObjects.Group
  implements Weapon
{
  private fireDelay = 1000 * 0.25;
  private nextFireAt = 0;

  constructor(ship: Ship) {
    super(ship.scene);

    this.createMultipleCallback = (items) => {
      items.forEach((gameObject) => {
        if (gameObject instanceof LaserAmmo) {
          gameObject.firedBy(ship);
        }
      });
    };

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

class LaserAmmo extends Phaser.GameObjects.Line implements Ammo {
  body: MatterJS.BodyType;
  originator: GameObjects.GameObject;

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

    this.setName(this.constructor.name);

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

    [bodyA.gameObject, bodyB.gameObject].forEach((gameObject) => {
      if (gameObject instanceof LaserAmmo) {
        gameObject.hide();
      } else if (gameObject instanceof Ship) {
        gameObject.kill(this.getFiredBy());
      } else {
        gameObject.destroy();
      }
    });
  }

  firedBy(gameObject: GameObjects.GameObject): void {
    this.originator = gameObject;
  }

  getFiredBy() {
    return this.originator;
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
