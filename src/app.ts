import { Game, Scene } from "phaser";
import { Player } from "./Player";
import { LaserGroup } from "./laser";

import GameConfig = Phaser.Types.Core.GameConfig;
import Key = Phaser.Input.Keyboard.Key;
import Text = Phaser.GameObjects.Text;

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: {
    init,
    preload,
    create,
    update,
  },
};

const game = new Game(config);
let debugging: boolean = false;
let player: Player;
const playerInput: { [key: string]: Key } = {};
let laserGroup: LaserGroup;
let fpsText: Text;
let pointerText: Text;

function init(this: Scene) {
  this.input.keyboard.addKey("esc").on("down", handleRestart.bind(this));

  this.input.keyboard
    .addKey("backtick")
    .on("down", () => (debugging = !debugging));
}

function preload(this: Scene) {
  // TODO: Preload scene data.
}

function create(this: Scene) {
  const background = this.add.graphics();
  const bgGradient = getDayGradient();
  background.fillGradientStyle(
    bgGradient[0],
    bgGradient[1],
    bgGradient[2],
    bgGradient[3],
    1,
  );
  background.fillRect(0, 0, 800, 600);

  player = Player.createDefault(this);
  laserGroup = new LaserGroup(this);

  playerInput["right"] = this.input.keyboard.addKey("RIGHT");
  playerInput["left"] = this.input.keyboard.addKey("LEFT");
  playerInput["up"] = this.input.keyboard.addKey("UP");
  playerInput["down"] = this.input.keyboard.addKey("DOWN");

  playerInput["face-left"] = this.input.keyboard.addKey("A");
  playerInput["face-right"] = this.input.keyboard.addKey("D");

  playerInput["primary-fire"] = this.input.keyboard.addKey("SPACE");

  fpsText = this.add.text(16, 32, "", { fontSize: "16px", color: "#FFF" });
  pointerText = this.add.text(16, 48, "", { fontSize: "16px", color: "#FFF" });
}

function update(this: Scene) {
  player.stopMoving();

  if (playerInput["right"].isDown) {
    player.moveRight();
  }

  if (playerInput["left"].isDown) {
    player.moveLeft();
  }

  if (playerInput["up"].isDown) {
    player.moveUp();
  }

  if (playerInput["down"].isDown) {
    player.moveDown();
  }

  if (playerInput["face-left"].isDown) {
    player.faceLeft();
  }

  if (playerInput["face-right"].isDown) {
    player.faceRight();
  }

  if (playerInput["primary-fire"].isDown) {
    if (player.isFacingLeft) {
      laserGroup.fireLaser(player.x - 5, player.y + 10, player.isFacingLeft);
    } else {
      laserGroup.fireLaser(player.x + 45, player.y + 10, player.isFacingLeft);
    }
  }

  fpsText.setText(debugging ? getFPSDetails() : "");
  pointerText.setText(debugging ? getPointerDetails(this) : "");
}

function getDayGradient(): number[] {
  return [0x0288d1, 0x288d1, 0xacf0f2, 0xacf0f2];
}

function getFPSDetails(): string {
  return "FPS: " + game.loop.actualFps.toFixed(2);
}

function getPointerDetails(scene: Scene): string[] {
  const pointer = scene.input.activePointer;
  return ["x: " + pointer.x, "y: " + pointer.y];
}

function handleRestart(this: Scene) {
  debugging = false;
  this.scene.restart();
}
