export class Scorer {
  private currentScore = 0;

  addToScore(value: number) {
    this.currentScore += value;
  }

  getScore() {
    return this.currentScore;
  }
}
