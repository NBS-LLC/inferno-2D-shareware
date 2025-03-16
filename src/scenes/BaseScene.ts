import { Scene } from "phaser";
import { Scorer } from "../logic/Scorer";

export abstract class BaseScene extends Scene {
  private scorer: Scorer;

  constructor(key: string) {
    super(key);
    this.scorer = new Scorer();
  }

  resetScore() {
    this.scorer = new Scorer();
  }

  getScorer() {
    return this.scorer;
  }
}
