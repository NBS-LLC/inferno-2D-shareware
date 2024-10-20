import "@geckos.io/phaser-on-nodejs";
import { describe, expect, it, jest } from "@jest/globals";
import { Game, Scene } from "phaser";
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

function create(this: Scene) {
  player = Player.createDefault(this);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jest.useFakeTimers();

describe(Player.name, () => {
  it(
    "Integration",
    async () => {
      const game = new Game(config);

      while (!game.isBooted) {
        await sleep(100);
      }

      while (!game.isRunning) {
        await sleep(100);
      }

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
      expect(player.x).toBeGreaterThan(100 + 5 * 24);
      expect(player.x).toBeLessThan(100 + 5 * 26);
      expect(player.y).toEqual(400);

      // move the player up at 5ppf for 10 frames
      for (let n = 1; n <= 10; n++) {
        player.moveUp();
        jest.advanceTimersByTime(MS_PER_FRAME);
      }

      player.stopMoving();
      jest.advanceTimersByTime(MS_PER_FRAME);

      // the player should now be roughly located at 225,350
      expect(player.x).toBeGreaterThan(100 + 5 * 24);
      expect(player.x).toBeLessThan(100 + 5 * 26);
      expect(player.y).toBeGreaterThan(400 - 5 * 11);
      expect(player.y).toBeLessThan(400 - 5 * 9);

      // move the player down and left at 5ppf for 10 frames
      for (let n = 1; n <= 10; n++) {
        player.moveDown();
        player.moveLeft();
        jest.advanceTimersByTime(MS_PER_FRAME);
      }

      player.stopMoving();
      jest.advanceTimersByTime(MS_PER_FRAME);

      // the player should now be roughly located at 175,400
      expect(player.x).toBeGreaterThan(225 - 5 * 11);
      expect(player.x).toBeLessThan(225 - 5 * 9);
      expect(player.y).toBeGreaterThan(350 + 5 * 9);
      expect(player.y).toBeLessThan(350 + 5 * 11);

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
});
