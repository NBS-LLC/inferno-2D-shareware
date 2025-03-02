import "@geckos.io/phaser-on-nodejs";
import { beforeEach, describe, expect, it, jest, test } from "@jest/globals";
import { Game, Scene } from "phaser";
import { Enemy } from "./game-objects/Enemy";
import { Player, PlayerInput } from "./game-objects/Player";
import { Ship } from "./game-objects/Ship";

window.focus = jest.fn();
jest.spyOn(console, "log").mockImplementation(() => {});

const FPS = 60;
const MS_PER_FRAME = 1000 / FPS;

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
  scene: {
    create,
    update,
  },
};

let game: Game;
let frameIndex: number;
let player: Player;
let enemy: Enemy;

function create(this: Scene) {
  player = new Player(this, 100, 400, {});
  enemy = new Enemy(this, 700, 400);
}

function update(time: number, delta: number) {
  player.update(time, delta);
  enemy.update(time, delta);
}

describe("Game", () => {
  beforeEach(() => {
    game = new Game(config);
    frameIndex = 0;
    stepFramesBy(1);
  });

  describe(Ship.name, () => {
    it("should not rotate on collision", () => {
      // position the player above the enemy, with some horizontal overlap
      player.setPosition(680, 350);
      enemy.setPosition(700, 400);
      player.setSpeed(5);

      // collide the player into the enemy
      for (let frame = 1; frame <= 10; frame++) {
        player.moveDown();
        stepFramesBy(1);

        expect(player.getBody().angle).toEqual(0);
        expect(enemy.getBody().angle).toEqual(0);
      }
    });
  });

  describe("Simulation", () => {
    test("Movement and Position", () => {
      // the player was added to the scene at: 100,400
      expect(player.x).toEqual(100);
      expect(player.y).toEqual(400);

      // move the player right at 5ppf for 25 frames
      for (let n = 1; n <= 25; n++) {
        player.moveRight();
        stepFramesBy(1);
      }

      player.stopMoving();
      stepFramesBy(1);

      // the player should now be roughly located at 225,400
      expect(player.x).toBeCloseTo(225);
      expect(player.y).toEqual(400);

      // move the player up at 5ppf for 10 frames
      for (let n = 1; n <= 10; n++) {
        player.moveUp();
        stepFramesBy(1);
      }

      player.stopMoving();
      stepFramesBy(1);

      // the player should now be roughly located at 225,350
      expect(player.x).toBeCloseTo(225);
      expect(player.y).toBeCloseTo(350);

      // move the player down and left at 5ppf for 10 frames
      for (let n = 1; n <= 10; n++) {
        player.moveDown();
        player.moveLeft();
        stepFramesBy(1);
      }

      player.stopMoving();
      stepFramesBy(1);

      // the player should now be roughly located at 175,400
      expect(player.x).toBeCloseTo(175);
      expect(player.y).toBeCloseTo(400);

      // should face right by default
      expect(player.angle).toEqual(0);
      expect(player.isFacingLeft).toBeFalsy();

      // have the player face left
      player.faceLeft();
      stepFramesBy(1);
      expect(player.angle).toEqual(-180);
      expect(player.isFacingLeft).toBeTruthy();

      // have the player face right
      player.faceRight();
      stepFramesBy(1);
      expect(player.angle).toEqual(0);
      expect(player.isFacingLeft).toBeFalsy();
    });

    test("Weapon System", async () => {
      // the player was added to the scene at: 100,400
      expect(player.x).toEqual(100);
      expect(player.y).toEqual(400);

      // the enemy was added to the scene at: 700,400
      expect(enemy.x).toEqual(700);
      expect(enemy.y).toEqual(400);

      // fire the player's primary weapon at 10ppf
      player.firePrimaryWeapon();

      stepFramesBy(50);
      // the laser should be roughly 600,400: no collision
      expect(enemy.active).toBeTruthy();

      stepFramesBy(10);
      // the laser should be roughly 700,400: collision with enemy
      expect(enemy.active).toBeFalsy();
      expect(enemy.body).toBeUndefined();
    });

    test("Enemy Idle State", async () => {
      const originX = enemy.x;
      const originY = enemy.y;

      expect(enemy.getVelocity()).toEqual({ x: 0, y: 0 });

      // simulate 5 seconds worth of idle state
      for (let frame = 1; frame <= FPS * 5; frame++) {
        enemy.idle();
        stepFramesBy(1);

        // tolerance + (speed * max_idle_delay_frames)
        const precision = 3 + 0.25 * 10;

        expect(enemy.getVelocity()).not.toEqual({ x: 0, y: 0 });
        expect(enemy.x).toBeCloseTo(originX, precision);
        expect(enemy.y).toBeCloseTo(originY, precision);
      }
    });

    test("Enemy Destruction", () => {
      expect(enemy.active).toBeTruthy();

      enemy.destroy();
      stepFramesBy(1);
      // update must handle destruction gracefully
      enemy.update(MS_PER_FRAME, MS_PER_FRAME);

      expect(enemy.active).toBeFalsy();
    });

    test("Player Destruction", () => {
      expect(player.active).toBeTruthy();

      player.destroy();
      stepFramesBy(1);
      // update must handle destruction gracefully
      player.update(MS_PER_FRAME, MS_PER_FRAME);

      expect(player.active).toBeFalsy();
    });

    test("Player Input Mapping", () => {
      const scene = game.scene.getAt(0);
      player.destroy();
      enemy.destroy();

      const playerInput: PlayerInput = {};
      playerInput["right"] = scene.input.keyboard.addKey("RIGHT");
      playerInput["left"] = scene.input.keyboard.addKey("LEFT");
      playerInput["up"] = scene.input.keyboard.addKey("UP");
      playerInput["down"] = scene.input.keyboard.addKey("DOWN");
      playerInput["face-left"] = scene.input.keyboard.addKey("A");
      playerInput["face-right"] = scene.input.keyboard.addKey("D");
      playerInput["fire-primary"] = scene.input.keyboard.addKey("SPACE");

      const myPlayer = new Player(scene, 200, 200, playerInput);
      expect(myPlayer.x).toBe(200);
      expect(myPlayer.y).toBe(200);

      resetPlayerInput(playerInput);
      playerInput["right"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(205, 1);
      expect(myPlayer.y).toBe(200);

      resetPlayerInput(playerInput);
      playerInput["left"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(200, 1);
      expect(myPlayer.y).toBe(200);

      resetPlayerInput(playerInput);
      playerInput["up"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(200, 1);
      expect(myPlayer.y).toBeCloseTo(195, 1);

      resetPlayerInput(playerInput);
      playerInput["down"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(200, 1);
      expect(myPlayer.y).toBeCloseTo(200, 1);

      resetPlayerInput(playerInput);
      playerInput["up"].isDown = true;
      playerInput["right"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(205, 1);
      expect(myPlayer.y).toBeCloseTo(195, 1);

      resetPlayerInput(playerInput);
      playerInput["left"].isDown = true;
      playerInput["down"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.x).toBeCloseTo(200, 1);
      expect(myPlayer.y).toBeCloseTo(200, 1);

      resetPlayerInput(playerInput);
      playerInput["face-left"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.isFacingLeft).toBeTruthy();

      resetPlayerInput(playerInput);
      playerInput["face-right"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(myPlayer.isFacingLeft).toBeFalsy();

      expect(getActiveLaserAmmo(scene)).toHaveLength(0);
      resetPlayerInput(playerInput);
      playerInput["fire-primary"].isDown = true;
      myPlayer.update(MS_PER_FRAME, MS_PER_FRAME);
      stepFramesBy(1);
      expect(getActiveLaserAmmo(scene)).toHaveLength(1);
    });
  });
});

function resetPlayerInput(playerInput: PlayerInput) {
  for (const inputName in playerInput) {
    const key = playerInput[inputName];
    key.isDown = false;
  }
}

function getActiveLaserAmmo(scene: Scene) {
  return scene.children
    .getAll()
    .filter(
      (gameObject) => gameObject.name == "LaserAmmo" && gameObject.active,
    );
}

function stepFramesBy(count: number) {
  for (let n = 0; n < count; n++) {
    game.headlessStep(++frameIndex * MS_PER_FRAME, MS_PER_FRAME);
  }
}
