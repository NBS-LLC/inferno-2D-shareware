import "@geckos.io/phaser-on-nodejs";
import { describe, expect, it, jest } from "@jest/globals";
import { Game, Scene } from "phaser";
import { Player } from "./Player";

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
    update,
  },
};

let player: Player;

function create(this: Scene) {
  player = Player.createDefault(this);
}

function update(this: Scene) {}

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

      expect(player.x).toEqual(80);
      expect(player.y).toEqual(390);

      for (let i = 1; i <= 16; i++) {
        player.moveLeft();
        jest.advanceTimersByTime(16);
      }

      expect(player.x).toEqual(5);

      player.moveLeft();
      jest.advanceTimersByTime(16);

      expect(player.isFacingLeft).toBeTruthy();
      expect(player.x).toEqual(0);
      expect(player.y).toEqual(390);
    },
    1000 * 30,
  );
});
