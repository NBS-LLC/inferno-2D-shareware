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
    default: "arcade",
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

      player.faceLeft();

      // the player was added to the scene at: 100,400
      // the player's center is used when adding it to the scene
      // width: 40, height: 20 => center: 20,10
      // player absolute position: 100-20,400-10 => 80,390

      expect(player.x).toEqual(80);
      expect(player.y).toEqual(390);

      // start moving the player left at 300pps, or 5ppf (300pps/60fps)
      player.moveLeft();

      // TODO: bug? player starts moving on the 2nd frame
      // player moves left 75 pixels (5ppf * 15 frames), 80 - 75 = 5
      jest.advanceTimersByTime(MS_PER_FRAME);
      jest.advanceTimersByTime(15 * MS_PER_FRAME);
      expect(player.x).toEqual(5);

      // player moves left one more frame, 5 - 5 = 0
      jest.advanceTimersByTime(MS_PER_FRAME);
      expect(player.isFacingLeft).toBeTruthy();
      expect(player.x).toEqual(0);
      expect(player.y).toEqual(390);

      // try to keep moving the player left
      jest.advanceTimersByTime(10 * MS_PER_FRAME);
      expect(player.isFacingLeft).toBeTruthy();
      expect(player.x).toEqual(0); // must not move further left because of world bounds
      expect(player.y).toEqual(390);
    },
    1000 * 30,
  );
});
