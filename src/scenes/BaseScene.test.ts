import { describe, expect, it } from "@jest/globals";
import { BaseScene } from "./BaseScene";

class TestScene extends BaseScene {
  constructor() {
    super("TestScene");
  }
}

describe(BaseScene.name, () => {
  it("can reset the score", () => {
    const scene = new TestScene();
    scene.getScorer().addToScore(100);
    expect(scene.getScorer().getScore()).toEqual(100);

    scene.resetScore();
    expect(scene.getScorer().getScore()).toEqual(0);
  });
});
