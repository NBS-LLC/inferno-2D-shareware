import { Game, Scene } from "phaser";

import GameConfig = Phaser.Types.Core.GameConfig;
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

  fpsText = this.add.text(16, 32, "", { fontSize: "16px", color: "#FFF" });
  pointerText = this.add.text(16, 48, "", { fontSize: "16px", color: "#FFF" });
}

function update(this: Scene) {
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
