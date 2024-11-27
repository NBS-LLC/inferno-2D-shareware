import "@geckos.io/phaser-on-nodejs";
import { describe, expect, jest, test } from "@jest/globals";
import { Game, Scene } from "phaser";
import { Enemy } from "./Enemy";
import { Player } from "./Player";

window.focus = jest.fn();

const MS_PER_FRAME = 1000 / 60;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.HEADLESS,
  customEnvironment: false,
  width: 800,
  height: 600,
  audio: {
    noAudio: true,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 0 },
    },
  },
  fps: {
    forceSetTimeOut: true,
  },
  scene: {
    create,
  },
};

let player: Player;
let enemy: Enemy;

function create(this: Scene) {
  player = Player.createDefault(this);
  enemy = Enemy.createDefault(this, 700, 400);
}

jest.useFakeTimers();

describe(Player.name, () => {
  describe("Integration", () => {
    test(
      "Movement and Position",
      async () => {
        new Game(config);

        // the player was added to the scene at: 100,400
        expect(player.x).toEqual(100);
        expect(player.y).toEqual(400);

        // move the player right at 5ppf for 25 frames
        for (let n = 1; n <= 25; n++) {
          player.moveRight();
          jest.advanceTimersByTime(MS_PER_FRAME);
        }

        player.stopMoving();
        jest.advanceTimersByTime(MS_PER_FRAME);

        // the player should now be roughly located at 225,400
        expect(player.x).toBeCloseTo(225);
        expect(player.y).toEqual(400);

        // move the player up at 5ppf for 10 frames
        for (let n = 1; n <= 10; n++) {
          player.moveUp();
          jest.advanceTimersByTime(MS_PER_FRAME);
        }

        player.stopMoving();
        jest.advanceTimersByTime(MS_PER_FRAME);

        // the player should now be roughly located at 225,350
        expect(player.x).toBeCloseTo(225);
        expect(player.y).toBeCloseTo(350);

        // move the player down and left at 5ppf for 10 frames
        for (let n = 1; n <= 10; n++) {
          player.moveDown();
          player.moveLeft();
          jest.advanceTimersByTime(MS_PER_FRAME);
        }

        player.stopMoving();
        jest.advanceTimersByTime(MS_PER_FRAME);

        // the player should now be roughly located at 175,400
        expect(player.x).toBeCloseTo(175);
        expect(player.y).toBeCloseTo(400);

        // should face right by default
        expect(player.getShape().angle).toEqual(0);
        expect(player.isFacingLeft).toBeFalsy();

        // have the player face left
        player.faceLeft();
        jest.advanceTimersByTime(MS_PER_FRAME);
        expect(player.getShape().angle).toEqual(-180);
        expect(player.isFacingLeft).toBeTruthy();

        // have the player face right
        player.faceRight();
        jest.advanceTimersByTime(MS_PER_FRAME);
        expect(player.getShape().angle).toEqual(0);
        expect(player.isFacingLeft).toBeFalsy();
      },
      1000 * 30,
    );
    test("Weapon System", async () => {
      new Game(config);
      jest.advanceTimersByTime(MS_PER_FRAME);

      // the player was added to the scene at: 100,400
      expect(player.x).toEqual(100);
      expect(player.y).toEqual(400);

      // the enemy was added to the scene at: 700,400
      expect(enemy.x).toEqual(700);
      expect(enemy.y).toEqual(400);

      // fire the player's primary weapon at 10ppf
      player.firePrimaryWeapon();

      // the laser should be roughly 600,400: no collision
      jest.advanceTimersByTime(50 * MS_PER_FRAME);
      expect(enemy.getShape().active).toBeTruthy();

      // the laser should be roughly 700,400: collision with enemy
      jest.advanceTimersByTime(10 * MS_PER_FRAME);
      expect(enemy.getShape().active).toBeFalsy();
      expect(enemy.getShape().body).toBeUndefined();

      // BUG: getBody() will hold onto a destroyed game object's body
      // TODO: expect(enemy.getBody()).toBeUndefined();
    });
  });
});
