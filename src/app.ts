import { Game, Scene } from "phaser";

import GameConfig = Phaser.Types.Core.GameConfig;
import DynamicBody = Phaser.Physics.Arcade.Body;
import Key = Phaser.Input.Keyboard.Key;
import Color = Phaser.Display.Color;
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
let player: DynamicBody;
const playerInput: { [key: string]: Key } = {};
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

  const playerShape = this.add.polygon(
    100,
    400,
    getPlayerVertices(),
    Color.GetColor(110, 110, 110),
  );

  player = this.physics.add.existing(playerShape).body as DynamicBody;
  player.setCollideWorldBounds(true);

  playerInput["right"] = this.input.keyboard.addKey("right");
  playerInput["left"] = this.input.keyboard.addKey("left");
  playerInput["up"] = this.input.keyboard.addKey("up");
  playerInput["down"] = this.input.keyboard.addKey("down");

  playerInput["face-left"] = this.input.keyboard.addKey("A");
  playerInput["face-right"] = this.input.keyboard.addKey("D");

  fpsText = this.add.text(16, 32, "", { fontSize: "16px", color: "#FFF" });
  pointerText = this.add.text(16, 48, "", { fontSize: "16px", color: "#FFF" });
}

function update(this: Scene) {
  player.setVelocity(0);

  if (playerInput["right"].isDown) {
    player.setVelocityX(300);
  }

  if (playerInput["left"].isDown) {
    player.setVelocityX(-300);
  }

  if (playerInput["up"].isDown) {
    player.setVelocityY(-300);
  }

  if (playerInput["down"].isDown) {
    player.setVelocityY(300);
  }

  if (playerInput["face-left"].isDown) {
    const shape = player.gameObject as Phaser.GameObjects.Polygon;
    shape.setAngle(180);
  }

  if (playerInput["face-right"].isDown) {
    const shape = player.gameObject as Phaser.GameObjects.Polygon;
    shape.setAngle(0);
  }

  fpsText.setText(debugging ? getFPSDetails() : "");
  pointerText.setText(debugging ? getPointerDetails(this) : "");
}

function getDayGradient(): number[] {
  return [0x0288d1, 0x288d1, 0xacf0f2, 0xacf0f2];
}

function getPlayerVertices(): number[][] {
  // 0,0 is top,left
  // Positive x = right
  // Positive y = down
  // Vertices need to be clockwise

  return [
    [0, 0],
    [40, 10],
    [0, 20],
  ];
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
