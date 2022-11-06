function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      roundsToSpecial: 0,
      roundsToHeal: 0,
      winner: null,
      battleLog: [],
    };
  },
  computed: {
    monsterBar() {
      return { width: this.monsterHealth + "%" };
    },
    playerBar() {
      return { width: this.playerHealth + "%" };
    },
    specialDisabled() {
      return this.roundsToSpecial > 0 ? true : false;
    },
    healDisabled() {
      return this.roundsToHeal > 0 ? true : false;
    },
    isWinner() {
      return this.winner ? "You won!" : "You lost";
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0) {
        this.winner = false;
        return "You lost!";
      }
    },
    monsterHealth(value) {
      if (value <= 0) {
        this.winner = true;
        return "You won!";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      this.roundsToSpecial--;
      this.roundsToHeal--;
      const attackValue = getRandomValue(5, 12);
      this.addLogMessage("player", "attack", attackValue);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.addLogMessage("monster", "attack", attackValue);
      this.playerHealth -= attackValue;
    },
    specialAttack() {
      this.currentRound++;
      this.roundsToHeal--;
      this.roundsToSpecial = 3;
      const attackValue = getRandomValue(10, 25);
      this.addLogMessage("player", "special attack", attackValue);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
    },
    heal() {
      this.currentRound++;
      this.roundsToSpecial--;
      this.roundsToHeal = 1;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = false;
      this.playerHealth = 0;
    },
    startNewGame() {
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.roundsToHeal = 0;
      this.roundsToSpecial = 0;
      this.battleLog = [];
    },
    addLogMessage(who, what, value) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
