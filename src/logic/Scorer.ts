interface Scorable {
  attackerLevel: number;
  defenderLevel: number;
  credits: number;
}

export class Scorer {
  private currentScore = 0;

  static calculateScore(stats: Scorable) {
    const defenderLevel = Math.max(1, Math.floor(stats.defenderLevel));
    const attackerLevel = Math.max(1, Math.floor(stats.attackerLevel));
    const credits = Math.max(0, Math.floor(stats.credits));
    return Math.ceil(credits * (defenderLevel / attackerLevel));
  }

  addToScore(value: number) {
    this.currentScore += value;
  }

  getScore() {
    return this.currentScore;
  }
}
